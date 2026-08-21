const MAXIMUM_QUEUED_ENVELOPES = 256;
const MAXIMUM_MESSAGE_ID = 0xffff_ffff_ffff_ffffn;

export class Sender {
  #stream;
  #nextMessageId = 1n;
  #queued = 0;
  #tail = Promise.resolve();
  #closedError;
  #sessionId = '';
  #pluginInstanceId = '';

  constructor(stream) {
    if (!stream || typeof stream.write !== 'function') {
      throw new TypeError('sender requires a writable gRPC stream');
    }
    this.#stream = stream;
  }

  setIdentity(sessionId, pluginInstanceId) {
    if (this.#sessionId || this.#pluginInstanceId) {
      throw new Error('plugin session identity is already established');
    }
    this.#sessionId = sessionId;
    this.#pluginInstanceId = pluginInstanceId;
  }

  get sessionId() { return this.#sessionId; }

  get pluginInstanceId() { return this.#pluginInstanceId; }

  send(replyTo, trace, payload, beforeQueue) {
    if (this.#closedError) throw this.#closedError;
    if (this.#queued >= MAXIMUM_QUEUED_ENVELOPES) {
      throw new Error('plugin output queue is full');
    }

    const messageId = this.#reserveMessageId();
    beforeQueue?.(messageId);
    // Admission is the ownership boundary. Snapshot the complete payload now
    // so caller mutation cannot change an envelope while it waits behind an
    // earlier gRPC write.
    const payloadSnapshot = structuredClone(payload);
    const envelope = {
      messageId: messageId.toString(),
      ...(replyTo === undefined ? {} : { replyTo: replyTo.toString() }),
      sessionId: this.#sessionId,
      pluginInstanceId: this.#pluginInstanceId,
      trace: structuredClone(trace),
      ...payloadSnapshot,
    };

    this.#queued += 1;
    const current = this.#tail.then(() => writeEnvelope(this.#stream, envelope, messageId));
    // A failed write poisons every envelope already queued behind it. Attach a
    // handler here as well as returning `current`, so an owner that is being
    // torn down can never leave the ordered tail as an unobserved rejection.
    this.#tail = current;
    current.catch(() => {});
    const result = current.finally(() => { this.#queued -= 1; });
    result.catch(() => {});
    return result;
  }

  close(error = new Error('plugin sender is closed')) {
    this.#closedError ??= error;
  }

  #reserveMessageId() {
    if (this.#nextMessageId > MAXIMUM_MESSAGE_ID) {
      throw new Error('plugin exhausted message IDs');
    }
    const reserved = this.#nextMessageId;
    this.#nextMessageId += 1n;
    return reserved;
  }
}

function writeEnvelope(stream, envelope, messageId) {
  return new Promise((resolve, reject) => {
    try {
      stream.write(envelope, (error) => {
        if (error) reject(error);
        else resolve(messageId);
      });
    } catch (error) {
      reject(error);
    }
  });
}
