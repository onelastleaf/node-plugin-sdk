import { createHash } from 'node:crypto';

export class Host {
  #sender;
  #pending = new Map();
  maximumArtifactChunkBytes;
  maximumCallDepth;

  constructor(sender, maximumArtifactChunkBytes, maximumCallDepth) {
    this.#sender = sender;
    this.maximumArtifactChunkBytes = BigInt(maximumArtifactChunkBytes);
    this.maximumCallDepth = Number(maximumCallDepth);
  }

  async call(trace, call, { signal } = {}) {
    const response = await this.#request(trace, { hostCall: call }, signal);
    if (response.payload === 'protocolError') {
      throw new Error(`host rejected request: ${response.protocolError.message}`);
    }
    if (response.payload !== 'hostResult') {
      throw new Error('host call received another response kind');
    }
    if (response.hostResult.result === 'error') {
      throw new Error(`host rejected request: ${response.hostResult.error.message}`);
    }
    return response.hostResult;
  }

  getConfig(trace, path, options) {
    return this.call(trace, { getConfig: { path } }, options).then((response) => {
      if (response.result !== 'getConfig') throw new Error('GetConfig received another response kind');
      return response.getConfig;
    });
  }

  invokeConfigFunction(trace, functionRef, arguments_, options) {
    return this.call(trace, {
      invokeConfigFunction: { function: functionRef, arguments: arguments_ },
    }, options).then((response) => {
      if (response.result !== 'invokeConfigFunction') {
        throw new Error('InvokeConfigFunction received another response kind');
      }
      return response.invokeConfigFunction;
    });
  }

  async log(trace, level, target, message, fields = {}) {
    await this.#sender.send(undefined, trace, {
      log: { timestamp: timestamp(), level, target, message, fields },
    });
  }

  async storeArtifact(trace, jobId, artifact, chunks, { signal } = {}) {
    if (!isCanonicalUuidV4(artifact?.artifactId?.value)
        || !artifact?.fileName || !artifact?.mediaType
        || Buffer.from(artifact?.sha256 ?? []).length !== 32) {
      throw new Error('artifact descriptor is invalid');
    }
    if (!chunks.length || chunks.some((chunk) => !chunk.length)) {
      throw new Error('artifact chunks must be nonempty');
    }
    if (chunks.length > 0xffff_ffff) throw new Error('artifact has too many chunks');
    for (const chunk of chunks) {
      if (BigInt(chunk.length) > this.maximumArtifactChunkBytes) {
        throw new Error('artifact chunk exceeds the negotiated limit');
      }
    }
    const size = chunks.reduce((total, chunk) => total + BigInt(chunk.length), 0n);
    const hasher = createHash('sha256');
    for (const chunk of chunks) hasher.update(chunk);
    const digest = hasher.digest();
    if (BigInt(artifact.sizeBytes) !== size
        || !digest.equals(Buffer.from(artifact.sha256 ?? []))) {
      throw new Error('artifact size or SHA-256 does not match its bytes');
    }
    const accepted = await this.#request(trace, {
      artifactStart: { jobId: { value: jobId }, artifact, chunkCount: chunks.length },
    }, signal);
    if (accepted.payload !== 'artifactAccepted'
        || accepted.artifactAccepted.artifactId?.value !== artifact.artifactId?.value) {
      throw new Error('host did not accept the artifact transfer');
    }
    for (const [chunkIndex, data] of chunks.entries()) {
      await this.#sender.send(undefined, trace, {
        artifactChunk: { artifactId: artifact.artifactId, chunkIndex, data },
      });
    }
    const stored = await this.#request(trace, {
      artifactComplete: { artifactId: artifact.artifactId },
    }, signal);
    if (stored.payload !== 'artifactStored'
        || stored.artifactStored.artifactId?.value !== artifact.artifactId.value) {
      throw new Error('host did not store the artifact');
    }
    return stored.artifactStored;
  }

  route(envelope) {
    const key = String(envelope.replyTo);
    const waiter = this.#pending.get(key);
    if (!waiter) throw new Error('host response names no pending plugin request');
    this.#pending.delete(key);
    if (waiter.correlationId !== envelope.trace.correlationId) {
      waiter.reject(new Error('host response changed correlation context'));
      return;
    }
    waiter.resolve(envelope);
  }

  #request(trace, payload, signal) {
    return new Promise((resolve, reject) => {
      let key;
      const abort = () => {
        if (key !== undefined) this.#pending.delete(key);
        reject(signal.reason ?? new Error('host call cancelled'));
      };
      if (signal?.aborted) return abort();
      this.#sender.send(undefined, trace, payload, (messageId) => {
        key = messageId.toString();
        signal?.addEventListener('abort', abort, { once: true });
        this.#pending.set(key, {
          correlationId: trace.correlationId,
          resolve: (value) => { signal?.removeEventListener('abort', abort); resolve(value); },
          reject: (error) => { signal?.removeEventListener('abort', abort); reject(error); },
        });
      }).catch((error) => {
        if (key !== undefined) this.#pending.delete(key);
        signal?.removeEventListener('abort', abort);
        reject(error);
      });
    });
  }
}

function isCanonicalUuidV4(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}

function timestamp() {
  const milliseconds = Date.now();
  return {
    seconds: String(Math.floor(milliseconds / 1000)),
    nanos: (milliseconds % 1000) * 1_000_000,
  };
}
