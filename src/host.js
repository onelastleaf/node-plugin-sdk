import { ArtifactTransfers } from './artifacts.js';
import { BoundedMap } from './bounded-map.js';
import { HOST_CALL_KINDS, LOG_LEVELS } from './protocol.js';
import {
  abortReason,
  HostError,
  raceWithSignal,
  throwIfProtocolError,
  throwIfAborted,
} from './errors.js';
import {
  assertRecord,
  tracesEqual,
  validateConfigPath,
  validateConfigValue,
  validateNonemptyString,
  validateUint32,
} from './validation.js';

const MAXIMUM_PENDING_HOST_REQUESTS = 256;
const MAXIMUM_IGNORED_RESPONSES = 256;
export class Host {
  #sender;
  #pending = new Map();
  #ignoredResponses = new BoundedMap(MAXIMUM_IGNORED_RESPONSES);
  #artifacts;
  #closedError;
  #sessionId;
  maximumCallDepth;

  constructor(sender, maximumArtifactChunkBytes, maximumCallDepth, sessionId = sender?.sessionId) {
    if (!sender || typeof sender.send !== 'function') {
      throw new TypeError('Host requires an ordered sender');
    }
    this.#sender = sender;
    this.#sessionId = validateNonemptyString(sessionId, 'plugin session ID');
    this.#artifacts = new ArtifactTransfers({
      sender,
      maximumChunkBytes: maximumArtifactChunkBytes,
      request: (...arguments_) => this.#request(...arguments_),
    });
    this.maximumCallDepth = validateUint32(
      Number(maximumCallDepth),
      'maximum call depth',
      { nonzero: true },
    );
  }

  /** @param {{ signal?: AbortSignal }} [options] */
  async call(trace, call, options = {}) {
    const { signal } = options;
    const callKind = validateHostCall(call);
    const response = await this.#request(
      trace,
      { hostCall: call },
      signal,
      new Set(['hostResult', 'protocolError']),
    );
    throwIfProtocolError(response);
    assertRecord(response.hostResult, 'host call response');
    if (response.hostResult.result === 'error') {
      throw new HostError(response.hostResult.error);
    }
    if (response.hostResult.result !== callKind) {
      throw new Error(`host call ${callKind} received another response kind`);
    }
    assertRecord(response.hostResult[callKind], `host call ${callKind} response`);
    return response.hostResult;
  }

  async getConfig(trace, path = { segments: [] }, options) {
    validateConfigPath(path);
    const response = await this.call(trace, { getConfig: { path } }, options);
    assertRecord(response.getConfig, 'GetConfig response');
    validateConfigValue(response.getConfig.value, {
      allowFunction: true,
      functionSession: this.#sessionId,
      label: 'GetConfig response value',
    });
    return response.getConfig;
  }

  async invokeConfigFunction(trace, functionRef, arguments_, options) {
    assertRecord(functionRef, 'configuration function reference');
    validateNonemptyString(functionRef.sessionId, 'configuration function session ID');
    validateNonemptyString(functionRef.functionId, 'configuration function ID');
    if (functionRef.sessionId !== this.#sessionId) {
      throw new TypeError('configuration function belongs to another plugin session');
    }
    if (!Array.isArray(arguments_)) {
      throw new TypeError('configuration function arguments must be an array');
    }
    arguments_.forEach((argument, index) => {
      validateConfigValue(argument, {
        allowFunction: true,
        functionSession: this.#sessionId,
        label: `configuration function argument ${index}`,
      });
    });
    const response = await this.call(trace, {
      invokeConfigFunction: { function: functionRef, arguments: arguments_ },
    }, options);
    assertRecord(response.invokeConfigFunction, 'InvokeConfigFunction response');
    if (!Array.isArray(response.invokeConfigFunction.results)) {
      throw new TypeError('InvokeConfigFunction response results must be an array');
    }
    response.invokeConfigFunction.results.forEach((result, index) => {
      validateConfigValue(result, {
        allowFunction: true,
        functionSession: this.#sessionId,
        label: `InvokeConfigFunction response result ${index}`,
      });
    });
    return response.invokeConfigFunction;
  }

  /** @param {{ signal?: AbortSignal }} [options] */
  async log(trace, level, target, message, fields = {}, options = {}) {
    const { signal } = options;
    if (!LOG_LEVELS.includes(level)) throw new TypeError('log level must be a concrete LogLevel');
    validateNonemptyString(target, 'log target');
    if (typeof message !== 'string') throw new TypeError('log message must be a string');
    assertRecord(fields, 'log fields');
    for (const [key, value] of Object.entries(fields)) {
      validateConfigValue(value, { label: `log field ${key}` });
    }
    throwIfAborted(signal, 'log cancelled');
    const sent = this.#sender.send(undefined, trace, {
      log: { timestamp: timestamp(), level, target, message, fields },
    });
    await raceWithSignal(sent, signal, 'log cancelled');
  }

  /** @param {{ signal?: AbortSignal, chunkCount?: number }} [options] */
  async storeArtifact(trace, jobId, artifact, chunks, options = {}) {
    return this.#artifacts.store(trace, jobId, artifact, chunks, options);
  }

  route(envelope) {
    const key = String(envelope.replyTo);
    const waiter = this.#pending.get(key);
    if (waiter) {
      this.#pending.delete(key);
      waiter.cleanup();
      try {
        validateResponse(waiter, envelope);
      } catch (error) {
        waiter.reject(error);
        throw error;
      }
      waiter.resolve(envelope);
      return;
    }
    const ignored = this.#ignoredResponses.get(key);
    if (ignored) {
      this.#ignoredResponses.delete(key);
      validateResponse(ignored, envelope);
      return;
    }

    if (this.#artifacts.route(envelope)) return;
    if (envelope.payload === 'protocolError') throw new HostError(envelope.protocolError);
    throw new Error('host response names no pending plugin request');
  }

  close(error = new Error('plugin session ended before the host responded')) {
    if (this.#closedError) return;
    this.#closedError = error;
    for (const waiter of this.#pending.values()) {
      waiter.cleanup();
      waiter.reject(error);
    }
    this.#pending.clear();
    this.#ignoredResponses.clear();
    this.#artifacts.close(error);
  }

  #request(trace, payload, signal, payloads) {
    if (this.#closedError) return Promise.reject(this.#closedError);
    if (this.#pending.size >= MAXIMUM_PENDING_HOST_REQUESTS) {
      return Promise.reject(new Error('too many host requests are pending'));
    }
    if (signal?.aborted) return Promise.reject(abortReason(signal, 'host request cancelled'));

    return new Promise((resolve, reject) => {
      let key;
      let settled = false;
      const cleanup = () => signal?.removeEventListener('abort', abort);
      const rejectOnce = (error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      };
      const resolveOnce = (value) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      };
      const waiter = {
        trace: structuredClone(trace),
        payloads,
        cleanup,
        reject: rejectOnce,
        resolve: resolveOnce,
      };
      const abort = () => {
        if (key !== undefined && this.#pending.get(key) === waiter) {
          this.#pending.delete(key);
          // A request can already be on the wire when AbortSignal fires. Keep
          // a bounded tombstone so its valid response cannot be mistaken for a
          // response to unknown state and tear down the whole session.
          this.#ignoredResponses.set(key, {
            trace: waiter.trace,
            payloads: waiter.payloads,
          });
        }
        rejectOnce(abortReason(signal, 'host request cancelled'));
      };

      let sent;
      try {
        sent = this.#sender.send(undefined, trace, payload, (messageId) => {
          key = messageId.toString();
          this.#pending.set(key, waiter);
          signal?.addEventListener('abort', abort, { once: true });
        });
      } catch (error) {
        if (key !== undefined) this.#pending.delete(key);
        rejectOnce(error);
        return;
      }
      sent.then(undefined, (error) => {
        if (key !== undefined && this.#pending.get(key) === waiter) this.#pending.delete(key);
        rejectOnce(error);
      });
    });
  }
}

function validateHostCall(call) {
  assertRecord(call, 'host call');
  const present = HOST_CALL_KINDS.filter((kind) => call[kind] !== undefined);
  if (present.length !== 1) throw new TypeError('host call must set exactly one request kind');
  assertRecord(call[present[0]], `host call ${present[0]} request`);
  return present[0];
}

function validateResponse(waiter, envelope) {
  if (!tracesEqual(waiter.trace, envelope.trace)) {
    throw new Error('host response changed trace context');
  }
  if (!waiter.payloads.has(envelope.payload)) {
    throw new Error('host response has the wrong payload kind');
  }
}

function timestamp() {
  const milliseconds = Date.now();
  return {
    seconds: String(Math.floor(milliseconds / 1000)),
    nanos: (milliseconds % 1000) * 1_000_000,
  };
}
