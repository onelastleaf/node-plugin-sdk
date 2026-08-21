import { PROTOCOL_ERROR_CODES } from './protocol.js';

export class HostError extends Error {
  constructor({
    code = 'ERROR_CODE_UNSPECIFIED',
    message = 'host rejected the request',
    retryable = false,
    metadata = {},
    details = [],
  } = {}, options) {
    if (!PROTOCOL_ERROR_CODES.includes(code)) throw new TypeError('host error code is invalid');
    if (typeof message !== 'string') throw new TypeError('host error message must be a string');
    if (typeof retryable !== 'boolean') throw new TypeError('host retryable flag must be boolean');
    if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)
        || Object.values(metadata).some((value) => typeof value !== 'string')) {
      throw new TypeError('host error metadata must contain string values');
    }
    if (!Array.isArray(details)) throw new TypeError('host error details must be an array');
    super(message || 'host rejected the request', options);
    this.name = 'HostError';
    this.code = code;
    this.retryable = retryable;
    this.metadata = Object.freeze({ ...metadata });
    this.details = Object.freeze([...details]);
  }
}

export function toProtocolError(error) {
  if (error instanceof HostError) {
    return {
      code: error.code === 'ERROR_CODE_UNSPECIFIED' ? 'ERROR_CODE_INTERNAL' : error.code,
      message: error.message,
      retryable: error.retryable,
      metadata: { ...error.metadata },
      details: [...error.details],
    };
  }
  return {
    code: 'ERROR_CODE_INTERNAL',
    message: error instanceof Error && error.message ? error.message : 'action failed',
    retryable: false,
  };
}

export function throwIfProtocolError(envelope) {
  if (envelope.payload === 'protocolError') {
    throw new HostError(envelope.protocolError);
  }
}

export function abortReason(signal, fallback) {
  return signal?.reason instanceof Error ? signal.reason : new Error(fallback);
}

export function throwIfAborted(signal, fallback) {
  if (signal?.aborted) throw abortReason(signal, fallback);
}

export function raceWithSignal(promise, signal, fallback) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(abortReason(signal, fallback));
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortReason(signal, fallback));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(
      (value) => {
        signal.removeEventListener('abort', abort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', abort);
        reject(error);
      },
    );
  });
}
