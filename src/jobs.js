import { ActionScope } from './action-scope.js';
import { assertActionResult } from './result.js';
import { toProtocolError } from './errors.js';
import { JOB_CANCELLATION_REASONS } from './protocol.js';
import {
  assertCanonicalUuidV4,
  tracesEqual,
  validateNonemptyString,
  validateTimestamp,
} from './validation.js';

export class JobManager {
  #actions;
  #sender;
  #host;
  #onFatal;
  #jobs = new Map();
  #background = new Set();
  #accepting = true;

  constructor(actions, sender, host, onFatal) {
    this.#actions = actions;
    this.#sender = sender;
    this.#host = host;
    this.#onFatal = onFatal;
  }

  start(envelope) {
    if (!this.#accepting) throw new Error('plugin session is not accepting jobs');
    const request = envelope.startJob;
    const id = request?.jobId?.value;
    assertCanonicalUuidV4(id, 'job ID');
    if (this.#jobs.has(id)) throw new Error('StartJobRequest repeats an active job ID');
    if (request.invocation !== 'action' || !request.action) {
      throw new Error('StartJobRequest must contain an action invocation');
    }
    validateNonemptyString(request.action.action, 'action name');
    const registered = this.#actions.get(request.action.action);
    if (!registered) throw new Error(`host requested undeclared action ${request.action.action}`);
    const arguments_ = request.action.arguments ?? [];
    if (!Array.isArray(arguments_) || arguments_.some((value) => typeof value !== 'string')) {
      throw new TypeError('action arguments must be strings');
    }
    if (request.deadline !== undefined) validateTimestamp(request.deadline, 'job deadline');

    const job = new RunningJob({
      id,
      request,
      trace: envelope.trace,
      parentCallId: envelope.messageId,
      handler: registered.handler,
      arguments_,
      sender: this.#sender,
      host: this.#host,
      inactive: () => {
        if (this.#jobs.get(id) === job) this.#jobs.delete(id);
      },
      watch: (task) => this.#watch(task),
    });
    // Synchronously reserve both the active-job slot and the ordered acceptance
    // before returning to the session reader. The handler itself waits for the
    // acceptance write, while cancellation and duplicate detection can proceed
    // without making the entire input stream wait on transport backpressure.
    const accepted = this.#sender.send(envelope.messageId, envelope.trace, {
      jobAccepted: { jobId: request.jobId },
    });
    this.#jobs.set(id, job);
    this.#watch(job.start(accepted));
  }

  cancel(envelope) {
    const request = envelope.cancelJob;
    const id = request?.jobId?.value;
    assertCanonicalUuidV4(id, 'cancelled job ID');
    if (!JOB_CANCELLATION_REASONS.includes(request.reason)) {
      throw new Error('CancelJobRequest contains an invalid cancellation reason');
    }
    const cancellation = {
      replyTo: envelope.messageId,
      trace: structuredClone(envelope.trace),
      jobId: request.jobId,
      reason: request.reason,
    };
    const job = this.#jobs.get(id);
    if (!job) {
      this.#sendInBackground(() => this.#acknowledge(cancellation));
      return;
    }
    if (!tracesEqual(job.trace, envelope.trace)) {
      throw new Error('CancelJobRequest changed the job trace context');
    }
    job.cancel(cancellation);
  }

  async shutdown(reason = 'plugin shutdown') {
    this.#accepting = false;
    const jobs = [...this.#jobs.values()];
    for (const job of jobs) job.stopForShutdown(reason);
    await Promise.allSettled(jobs.map((job) => job.done));
    for (const job of jobs) job.removeIfInactive();
    await this.drain();
  }

  close(reason = 'plugin session ended') {
    this.#accepting = false;
    for (const job of this.#jobs.values()) job.stopForShutdown(reason);
  }

  async drain() {
    while (this.#background.size > 0) {
      await Promise.allSettled([...this.#background]);
    }
  }

  async #acknowledge(cancellation) {
    await this.#sender.send(cancellation.replyTo, cancellation.trace, {
      cancelJobAcknowledged: { jobId: cancellation.jobId },
    });
  }

  #sendInBackground(operation) {
    let task;
    try {
      task = operation();
    } catch (error) {
      this.#reportFatal(error);
      return;
    }
    this.#watch(task);
  }

  #watch(task) {
    const promise = Promise.resolve(task);
    this.#background.add(promise);
    const observation = promise.then(
      () => { this.#background.delete(promise); },
      (error) => {
        this.#background.delete(promise);
        this.#reportFatal(error);
      },
    );
    observation.catch(() => {});
  }

  #reportFatal(error) {
    try {
      this.#onFatal(error);
    } catch {
      // The session failure owner must not turn observing one rejected worker
      // into a second unhandled rejection.
    }
  }
}

class RunningJob {
  #request;
  #handler;
  #arguments;
  #sender;
  #scope;
  #inactive;
  #watch;
  #state = 'active';
  #cancellations = [];
  done;
  trace;

  constructor({
    id,
    request,
    trace,
    parentCallId,
    handler,
    arguments_,
    sender,
    host,
    inactive,
    watch,
  }) {
    this.#request = request;
    this.trace = structuredClone(trace);
    this.#handler = handler;
    this.#arguments = [...arguments_];
    this.#sender = sender;
    this.#inactive = inactive;
    this.#watch = watch;
    this.#scope = new ActionScope({
      jobId: id,
      deadline: request.deadline,
      trace,
      parentCallId,
      host,
    });
  }

  start(accepted) {
    this.done = Promise.resolve(accepted).then(() => {
      if (this.#state !== 'active') return undefined;
      return this.#execute();
    });
    return this.done;
  }

  cancel(cancellation) {
    this.#cancellations.push(cancellation);
    if (this.#state === 'cancelling') return;
    if (this.#state !== 'active') return;
    this.#state = 'cancelling';
    const message = cancellation.reason === 'JOB_CANCELLATION_REASON_DEADLINE'
      ? 'job deadline exceeded'
      : 'job cancelled';
    this.#scope.cancel(new JobCancellationError(message, cancellation.reason));
    this.#watch(this.#settleCancellation());
  }

  stopForShutdown(reason) {
    if (this.#state === 'active') {
      this.#state = 'quiescing';
      this.#scope.cancel(new JobCancellationError(reason, 'PLUGIN_SHUTDOWN'));
    }
  }

  removeIfInactive() {
    if (this.#state !== 'active') this.#inactive();
  }

  async #execute() {
    let update;
    try {
      // The handler is invoked inside the Promise continuation so a synchronous
      // throw follows the same job-failure path as an async rejection.
      const result = await Promise.resolve().then(() => this.#handler(
        this.#scope.context,
        [...this.#arguments],
      ));
      assertActionResult(result);
      this.#scope.verifyStoredArtifacts(result.artifacts);
      update = {
        jobId: this.#request.jobId,
        state: 'JOB_STATE_SUCCEEDED',
        progress: 1,
        ...(result.result === undefined ? {} : { result: result.result }),
        artifacts: [...result.artifacts],
      };
    } catch (error) {
      update = {
        jobId: this.#request.jobId,
        state: 'JOB_STATE_FAILED',
        progress: 1,
        error: toProtocolError(error),
      };
    } finally {
      this.#scope.close();
    }

    if (this.#state !== 'active') return;
    const terminal = this.#sender.send(undefined, this.trace, { jobUpdate: update });
    this.#state = 'terminal-queued';
    // Removal happens only after send() has synchronously admitted the terminal
    // update to the ordered queue. A crossing cancellation therefore either
    // suppresses completion or sees an already inactive job and is acknowledged.
    this.#inactive();
    await terminal;
  }

  async #settleCancellation() {
    await this.done;
    this.#state = 'cancelled';
    this.#inactive();
    const requests = this.#cancellations.splice(0);
    for (const cancellation of requests) {
      await this.#sender.send(cancellation.replyTo, cancellation.trace, {
        cancelJobAcknowledged: { jobId: cancellation.jobId },
      });
    }
  }
}

class JobCancellationError extends Error {
  constructor(message, reason) {
    super(message);
    this.name = 'AbortError';
    this.reason = reason;
  }
}
