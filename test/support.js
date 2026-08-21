export class RecordingSender {
  nextMessageId = 1n;
  messages = [];
  failure;
  sessionId = 'test-plugin-session';

  send(replyTo, trace, payload, beforeQueue) {
    const messageId = this.nextMessageId;
    this.nextMessageId += 1n;
    beforeQueue?.(messageId);
    const message = { messageId, replyTo, trace: structuredClone(trace), ...payload };
    this.messages.push(message);
    if (this.failure?.(message)) return Promise.reject(new Error('injected send failure'));
    return Promise.resolve(messageId);
  }
}

export function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return { promise, resolve, reject };
}

export async function eventually(predicate, message = 'condition was not reached') {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const result = predicate();
    if (result) return result;
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error(message);
}

export const TRACE = Object.freeze({
  correlationId: '00000000-0000-4000-8000-000000000001',
  callDepth: 0,
  causalDepth: 0,
});

export function startEnvelope({
  messageId = '1',
  jobId = '00000000-0000-4000-8000-000000000011',
  action = 'test',
  arguments_ = [],
  deadline,
  trace = TRACE,
} = {}) {
  return {
    messageId,
    trace: structuredClone(trace),
    payload: 'startJob',
    startJob: {
      jobId: { value: jobId },
      ...(deadline === undefined ? {} : { deadline }),
      invocation: 'action',
      action: { action, arguments: arguments_ },
    },
  };
}

export function cancelEnvelope({
  messageId = '2',
  jobId = '00000000-0000-4000-8000-000000000011',
  reason = 'JOB_CANCELLATION_REASON_USER_REQUEST',
  trace = TRACE,
} = {}) {
  return {
    messageId,
    trace: structuredClone(trace),
    payload: 'cancelJob',
    cancelJob: { jobId: { value: jobId }, reason },
  };
}
