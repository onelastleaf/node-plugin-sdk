import { createHash } from 'node:crypto';
import { BoundedMap } from './bounded-map.js';
import {
  abortReason,
  HostError,
  raceWithSignal,
  throwIfProtocolError,
  throwIfAborted,
} from './errors.js';
import {
  assertCanonicalUuidV4,
  parseUnsigned64,
  snapshotArtifactDescriptor,
  tracesEqual,
  validateArtifactChunkPlan,
  validateUint32,
} from './validation.js';

const MAXIMUM_TRACKED_ONE_WAY_REQUESTS = 256;
const MAXIMUM_ACTIVE_TRANSFERS = 256;

export class ArtifactTransfers {
  #sender;
  #request;
  #maximumChunkBytes;
  #oneWayRequests = new BoundedMap(MAXIMUM_TRACKED_ONE_WAY_REQUESTS);
  #active = new Set();
  #closedError;

  constructor({ sender, request, maximumChunkBytes }) {
    this.#sender = sender;
    this.#request = request;
    this.#maximumChunkBytes = parseUnsigned64(
      maximumChunkBytes,
      'maximum artifact chunk size',
    );
    if (this.#maximumChunkBytes === 0n) {
      throw new RangeError('maximum artifact chunk size must be nonzero');
    }
  }

  /** @param {{ signal?: AbortSignal, chunkCount?: number }} [options] */
  async store(trace, jobId, artifact, chunks, options = {}) {
    if (this.#closedError) throw this.#closedError;
    const { signal, chunkCount } = options;
    assertCanonicalUuidV4(jobId, 'artifact job ID');
    const descriptor = snapshotArtifactDescriptor(artifact);
    const count = resolveChunkCount(chunks, chunkCount);
    validateArtifactChunkPlan(descriptor.sizeBytes, count, this.#maximumChunkBytes);
    if (this.#active.size >= MAXIMUM_ACTIVE_TRANSFERS) {
      throw new Error('too many artifact transfers are active');
    }

    const transfer = new TransferSignal(signal, trace);
    this.#active.add(transfer);
    try {
      const accepted = await this.#request(
        trace,
        {
          artifactStart: {
            jobId: { value: jobId },
            artifact: descriptor,
            chunkCount: count,
          },
        },
        transfer.signal,
        new Set(['artifactAccepted', 'protocolError']),
      );
      throwIfProtocolError(accepted);
      requireArtifactIdentity(
        accepted.artifactAccepted?.artifactId,
        descriptor.artifactId.value,
        'accept',
      );

      await this.#sendChunks(trace, descriptor, chunks, count, transfer);
      const stored = await this.#request(
        trace,
        { artifactComplete: { artifactId: descriptor.artifactId } },
        transfer.signal,
        new Set(['artifactStored', 'protocolError']),
      );
      throwIfProtocolError(stored);
      requireArtifactIdentity(
        stored.artifactStored?.artifactId,
        descriptor.artifactId.value,
        'store',
      );
      return stored.artifactStored;
    } finally {
      this.#active.delete(transfer);
      transfer.close();
      this.#oneWayRequests.deleteValues(transfer);
    }
  }

  route(envelope) {
    const key = String(envelope.replyTo);
    const transfer = this.#oneWayRequests.get(key);
    if (!transfer) return false;
    this.#oneWayRequests.delete(key);
    if (envelope.payload !== 'protocolError') {
      throw new Error('one-way artifact chunk received a non-error response');
    }
    if (!tracesEqual(transfer.trace, envelope.trace)) {
      throw new Error('host response changed artifact trace context');
    }
    transfer.fail(new HostError(envelope.protocolError));
    return true;
  }

  close(error) {
    if (this.#closedError) return;
    this.#closedError = error;
    for (const transfer of this.#active) transfer.fail(error);
    this.#active.clear();
    this.#oneWayRequests.clear();
  }

  async #sendChunks(trace, artifact, chunks, count, transfer) {
    const expectedSize = parseUnsigned64(artifact.sizeBytes, 'artifact size');
    const expectedDigest = Buffer.from(artifact.sha256);
    const hasher = createHash('sha256');
    const iterator = artifactIterator(chunks);
    let iteratorFinished = false;
    let index = 0;
    let bytesSent = 0n;
    try {
      while (true) {
        const iteration = await raceWithSignal(
          Promise.resolve().then(() => iterator.next()),
          transfer.signal,
          'artifact transfer cancelled',
        );
        if (iteration.done) {
          iteratorFinished = true;
          break;
        }
        throwIfAborted(transfer.signal, 'artifact transfer cancelled');
        const data = validateChunk(
          iteration.value,
          index,
          count,
          bytesSent,
          expectedSize,
          this.#maximumChunkBytes,
        );
        hasher.update(data);
        const sent = this.#sender.send(undefined, trace, {
          artifactChunk: {
            artifactId: artifact.artifactId,
            chunkIndex: index,
            data,
          },
        }, (messageId) => {
          this.#oneWayRequests.set(messageId.toString(), transfer);
        });
        await raceWithSignal(sent, transfer.signal, 'artifact transfer cancelled');
        bytesSent += BigInt(data.byteLength);
        index += 1;
      }
    } finally {
      if (!iteratorFinished) closeIterator(iterator);
    }

    if (index !== count || bytesSent !== expectedSize) {
      throw new RangeError('artifact yielded fewer chunks or bytes than declared');
    }
    if (!hasher.digest().equals(expectedDigest)) {
      throw new Error('artifact SHA-256 does not match its bytes');
    }
    throwIfAborted(transfer.signal, 'artifact transfer cancelled');
  }
}

class TransferSignal {
  #controller = new AbortController();
  #source;
  #relay;
  trace;

  constructor(source, trace) {
    this.trace = structuredClone(trace);
    this.#source = source;
    this.#relay = () => this.fail(abortReason(source, 'artifact transfer cancelled'));
    if (source?.aborted) this.#relay();
    else source?.addEventListener('abort', this.#relay, { once: true });
  }

  get signal() { return this.#controller.signal; }

  fail(error) {
    if (!this.signal.aborted) this.#controller.abort(error);
  }

  close() {
    this.#source?.removeEventListener('abort', this.#relay);
  }
}

function validateChunk(value, index, count, bytesSent, expectedSize, maximumChunkBytes) {
  if (index >= count) throw new RangeError('artifact yielded more chunks than declared');
  if (!(value instanceof Uint8Array)) {
    throw new TypeError(`artifact chunk ${index} must be a Uint8Array`);
  }
  if (value.byteLength === 0) throw new RangeError(`artifact chunk ${index} is empty`);
  if (BigInt(value.byteLength) > maximumChunkBytes) {
    throw new RangeError(`artifact chunk ${index} exceeds the negotiated limit`);
  }

  // Sender admission snapshots the payload synchronously. Keeping this view
  // here avoids a second full chunk copy before hashing and queueing it.
  const data = value;
  const nextBytes = bytesSent + BigInt(data.byteLength);
  const remainingChunks = BigInt(count - index - 1);
  const remainingBytes = expectedSize - nextBytes;
  if (nextBytes > expectedSize
      || remainingBytes < remainingChunks
      || remainingBytes > remainingChunks * maximumChunkBytes) {
    throw new RangeError(`artifact chunk ${index} cannot satisfy the declared size and count`);
  }
  return data;
}

function resolveChunkCount(chunks, configured) {
  const iterable = chunks != null
    && (typeof chunks[Symbol.iterator] === 'function'
      || typeof chunks[Symbol.asyncIterator] === 'function');
  if (!iterable) throw new TypeError('artifact chunks must be an iterable or async iterable');
  if (configured !== undefined) return validateUint32(configured, 'artifact chunk count');
  if (Array.isArray(chunks)) return validateUint32(chunks.length, 'artifact chunk count');
  throw new TypeError('chunkCount is required when artifact chunks are not an array');
}

function artifactIterator(chunks) {
  if (typeof chunks[Symbol.asyncIterator] === 'function') return chunks[Symbol.asyncIterator]();
  return chunks[Symbol.iterator]();
}

function closeIterator(iterator) {
  if (typeof iterator.return !== 'function') return;
  try {
    Promise.resolve(iterator.return()).catch(() => {});
  } catch {
    // The transfer's original validation, transport, or cancellation error wins.
  }
}

function requireArtifactIdentity(actual, expected, operation) {
  if (actual?.value !== expected) {
    throw new Error(`host ${operation} response changed the artifact identity`);
  }
}
