import { abortReason } from './errors.js';
import { parseUnsigned64, snapshotArtifactDescriptor } from './validation.js';

export class ActionScope {
  #jobId;
  #trace;
  #parentCallId;
  #host;
  #controller = new AbortController();
  #open = true;
  #activeArtifactIds = new Set();
  #storedArtifacts = new Map();
  context;

  constructor({ jobId, deadline, trace, parentCallId, host }) {
    this.#jobId = jobId;
    this.#trace = structuredClone(trace);
    this.#parentCallId = String(parentCallId);
    this.#host = host;
    this.context = Object.freeze({
      jobId,
      deadline: deadline === undefined ? undefined : structuredClone(deadline),
      trace: Object.freeze(structuredClone(trace)),
      signal: this.#controller.signal,
      hostCall: (call) => this.#run(() => host.call(this.#nestedTrace(), call, {
        signal: this.#controller.signal,
      })),
      getConfig: (path = { segments: [] }) => this.#run(() => host.getConfig(
        this.#nestedTrace(),
        path,
        { signal: this.#controller.signal },
      )),
      invokeConfigFunction: (functionRef, arguments_) => this.#run(() =>
        host.invokeConfigFunction(
          this.#nestedTrace(),
          functionRef,
          arguments_,
          { signal: this.#controller.signal },
        )),
      log: (level, target, message, fields = {}) => this.#run(() => host.log(
        this.#trace,
        level,
        target,
        message,
        fields,
        { signal: this.#controller.signal },
      )),
      storeArtifact: (artifact, chunks, options) => this.#storeArtifact(
        artifact,
        chunks,
        options,
      ),
    });
  }

  cancel(reason) {
    this.#open = false;
    if (!this.#controller.signal.aborted) this.#controller.abort(reason);
  }

  close() {
    this.#open = false;
  }

  verifyStoredArtifacts(artifacts) {
    for (const artifact of artifacts) {
      const stored = this.#storedArtifacts.get(artifact.artifactId.value);
      if (!stored || !sameArtifact(stored, artifact)) {
        throw new Error('action result references an artifact not stored by this job');
      }
    }
  }

  async #storeArtifact(artifact, chunks, options) {
    this.#assertOpen();
    const descriptor = snapshotArtifactDescriptor(artifact);
    if (this.#activeArtifactIds.has(descriptor.artifactId.value)
        || this.#storedArtifacts.has(descriptor.artifactId.value)) {
      throw new Error('job already used this artifact ID');
    }
    // Reserve before the first await so concurrent calls cannot race through
    // the stored-artifact check. Failed attempts release the local reservation;
    // oll remains authoritative for deployment-wide ID reuse.
    this.#activeArtifactIds.add(descriptor.artifactId.value);
    try {
      const stored = await this.#host.storeArtifact(
        this.#trace,
        this.#jobId,
        descriptor,
        chunks,
        { ...options, signal: this.#controller.signal },
      );
      this.#assertOpen();
      this.#storedArtifacts.set(descriptor.artifactId.value, descriptor);
      return stored;
    } finally {
      this.#activeArtifactIds.delete(descriptor.artifactId.value);
    }
  }

  async #run(operation) {
    this.#assertOpen();
    return operation();
  }

  #assertOpen() {
    if (!this.#open || this.#controller.signal.aborted) {
      throw abortReason(this.#controller.signal, 'job is no longer active');
    }
  }

  #nestedTrace() {
    this.#assertOpen();
    const callDepth = Number(this.#trace.callDepth ?? 0) + 1;
    if (!Number.isSafeInteger(callDepth) || callDepth > this.#host.maximumCallDepth) {
      throw new RangeError('host call exceeds the negotiated call-depth limit');
    }
    return {
      ...structuredClone(this.#trace),
      parentCallId: this.#parentCallId,
      callDepth,
    };
  }
}

function sameArtifact(left, right) {
  return left.artifactId.value === right.artifactId.value
    && left.fileName === right.fileName
    && left.mediaType === right.mediaType
    && parseUnsigned64(left.sizeBytes, 'artifact size')
      === parseUnsigned64(right.sizeBytes, 'artifact size')
    && Buffer.from(left.sha256).equals(Buffer.from(right.sha256));
}
