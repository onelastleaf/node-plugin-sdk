import net from 'node:net';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DNS_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const DECIMAL_INTEGER_PATTERN = /^(?:0|[1-9][0-9]*)$/;
const CONFIG_KINDS = Object.freeze([
  'nullValue',
  'boolValue',
  'integerValue',
  'numberValue',
  'stringValue',
  'bytesValue',
  'listValue',
  'mapValue',
  'functionValue',
  'timestampValue',
  'durationValue',
]);

const MAXIMUM_PLUGIN_ID_BYTES = 191;
const MAXIMUM_ARTIFACT_FILE_NAME_BYTES = 191;
const MAXIMUM_CONFIG_DEPTH = 33;
const MINIMUM_TIMESTAMP_SECONDS = -62_135_596_800n;
const MAXIMUM_TIMESTAMP_SECONDS = 253_402_300_799n;
const MAXIMUM_DURATION_SECONDS = 315_576_000_000n;
const MAXIMUM_UINT32 = 0xffff_ffff;
const MAXIMUM_UINT64 = 0xffff_ffff_ffff_ffffn;
const MINIMUM_INT64 = -0x8000_0000_0000_0000n;
const MAXIMUM_INT64 = 0x7fff_ffff_ffff_ffffn;

function isCanonicalUuidV4(value) {
  return typeof value === 'string' && UUID_V4_PATTERN.test(value);
}

export function assertCanonicalUuidV4(value, label) {
  if (!isCanonicalUuidV4(value)) {
    throw new TypeError(`${label} must be a canonical lower-case UUID v4`);
  }
  return value;
}

export function validatePluginId(value) {
  if (typeof value !== 'string') {
    throw new TypeError('plugin ID must be a string');
  }
  const labels = value.split('.');
  if (Buffer.byteLength(value) > MAXIMUM_PLUGIN_ID_BYTES
      || labels.length < 2
      || labels.some((label) => !DNS_LABEL_PATTERN.test(label))) {
    throw new TypeError('plugin ID must be a lower-case ASCII dotted DNS name');
  }
  return value;
}

export function validatePluginName(value) {
  if (typeof value !== 'string' || !DNS_LABEL_PATTERN.test(value)) {
    throw new TypeError('plugin name must be one lower-case ASCII DNS label');
  }
  return value;
}

export function validateNonemptyString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a nonempty string`);
  }
  return value;
}

export function validateEndpoint(value) {
  let endpoint;
  try {
    endpoint = new URL(value);
  } catch {
    throw new TypeError('OLL_PLUGIN_ENDPOINT must be a URL');
  }
  if (endpoint.protocol !== 'http:'
      || endpoint.username
      || endpoint.password
      || endpoint.pathname !== '/'
      || endpoint.search
      || endpoint.hash
      || !endpoint.port
      || !(endpoint.hostname === 'localhost' || isLoopbackAddress(endpoint.hostname))) {
    throw new TypeError('OLL_PLUGIN_ENDPOINT must be an http loopback URL with an explicit port');
  }
  return endpoint.host;
}

export function parseUnsigned64(value, label) {
  const parsed = parseInteger(value, label);
  if (parsed < 0n || parsed > MAXIMUM_UINT64) {
    throw new RangeError(`${label} must be an unsigned 64-bit integer`);
  }
  return parsed;
}

function parseSigned64(value, label) {
  const parsed = parseInteger(value, label, true);
  if (parsed < MINIMUM_INT64 || parsed > MAXIMUM_INT64) {
    throw new RangeError(`${label} must be a signed 64-bit integer`);
  }
  return parsed;
}

export function validateUint32(value, label, { nonzero = false } = {}) {
  if (!Number.isInteger(value)
      || value < (nonzero ? 1 : 0)
      || value > MAXIMUM_UINT32) {
    const qualifier = nonzero ? 'nonzero ' : '';
    throw new RangeError(`${label} must be a ${qualifier}unsigned 32-bit integer`);
  }
  return value;
}

export function validateTimestamp(value, label = 'timestamp') {
  assertRecord(value, label);
  const seconds = parseSigned64(value.seconds ?? '0', `${label}.seconds`);
  if (seconds < MINIMUM_TIMESTAMP_SECONDS || seconds > MAXIMUM_TIMESTAMP_SECONDS) {
    throw new RangeError(`${label}.seconds is outside the protobuf Timestamp range`);
  }
  if (!Number.isInteger(value.nanos ?? 0) || value.nanos < 0 || value.nanos > 999_999_999) {
    throw new RangeError(`${label}.nanos is outside the protobuf Timestamp range`);
  }
  return value;
}

export function validateTrace(trace, limits) {
  assertRecord(trace, 'trace context');
  validateNonemptyString(trace.correlationId, 'trace correlation ID');
  const callDepth = validateUint32(trace.callDepth ?? 0, 'trace call depth');
  const causalDepth = validateUint32(trace.causalDepth ?? 0, 'trace causal depth');
  if (callDepth > limits.maximumCallDepth) {
    throw new RangeError('host envelope exceeds the negotiated call-depth limit');
  }
  if (causalDepth > limits.maximumCausalDepth) {
    throw new RangeError('host envelope exceeds the negotiated causal-depth limit');
  }
  if (trace.parentCallId !== undefined) {
    parseUnsigned64(trace.parentCallId, 'trace parent call ID');
  }
  if (trace.taskId !== undefined) validateNonemptyString(trace.taskId, 'trace task ID');
  if (trace.taskGroupId !== undefined) {
    validateNonemptyString(trace.taskGroupId, 'trace task-group ID');
  }
  return trace;
}

export function tracesEqual(left, right) {
  return left?.correlationId === right?.correlationId
    && left?.parentCallId === right?.parentCallId
    && Number(left?.callDepth ?? 0) === Number(right?.callDepth ?? 0)
    && Number(left?.causalDepth ?? 0) === Number(right?.causalDepth ?? 0)
    && left?.taskId === right?.taskId
    && left?.taskGroupId === right?.taskGroupId;
}

/**
 * @param {any} value
 * @param {{ allowFunction?: boolean, functionSession?: string, label?: string }} [options]
 */
export function validateConfigValue(value, {
  allowFunction = false,
  functionSession,
  label = 'ConfigValue',
} = {}) {
  validateConfigValueAtDepth(value, 0, allowFunction, functionSession, label);
  return value;
}

export function validateConfigPath(path) {
  assertRecord(path, 'configuration path');
  const segments = path.segments ?? [];
  if (!Array.isArray(segments)) {
    throw new TypeError('configuration path segments must be an array');
  }
  segments.forEach((segment, index) => {
    assertRecord(segment, `configuration path segment ${index}`);
    const hasKey = segment.key !== undefined;
    const hasIndex = segment.index !== undefined;
    if (hasKey === hasIndex) {
      throw new TypeError(`configuration path segment ${index} must set exactly one kind`);
    }
    if (hasKey && typeof segment.key !== 'string') {
      throw new TypeError(`configuration path segment ${index} key must be a string`);
    }
    if (hasIndex) parseUnsigned64(segment.index, `configuration path segment ${index} index`);
  });
  return path;
}

export function validateArtifactDescriptor(descriptor) {
  assertRecord(descriptor, 'artifact descriptor');
  assertRecord(descriptor.artifactId, 'artifact descriptor ID');
  assertCanonicalUuidV4(descriptor.artifactId.value, 'artifact descriptor ID');
  validateArtifactFileName(descriptor.fileName);
  validateNonemptyString(descriptor.mediaType, 'artifact media type');
  parseUnsigned64(descriptor.sizeBytes, 'artifact size');
  if (!(descriptor.sha256 instanceof Uint8Array) || descriptor.sha256.byteLength !== 32) {
    throw new TypeError('artifact SHA-256 must be exactly 32 bytes');
  }
  return descriptor;
}

export function snapshotArtifactDescriptor(descriptor) {
  validateArtifactDescriptor(descriptor);
  return Object.freeze({
    artifactId: Object.freeze({ value: descriptor.artifactId.value }),
    fileName: descriptor.fileName,
    mediaType: descriptor.mediaType,
    sizeBytes: parseUnsigned64(descriptor.sizeBytes, 'artifact size').toString(),
    sha256: Buffer.from(descriptor.sha256),
  });
}

export function validateArtifactChunkPlan(sizeBytes, chunkCount, maximumChunkBytes) {
  const size = parseUnsigned64(sizeBytes, 'artifact size');
  const count = validateUint32(chunkCount, 'artifact chunk count');
  const maximum = parseUnsigned64(maximumChunkBytes, 'maximum artifact chunk size');
  if (maximum === 0n) throw new RangeError('maximum artifact chunk size must be nonzero');
  if (size === 0n) {
    if (count !== 0) throw new RangeError('an empty artifact must declare zero chunks');
    return;
  }
  if (count === 0
      || BigInt(count) > size
      || size > BigInt(count) * maximum) {
    throw new RangeError('artifact chunk count cannot represent the declared size');
  }
}

export function assertRecord(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function validateConfigValueAtDepth(value, depth, allowFunction, functionSession, label) {
  if (depth > MAXIMUM_CONFIG_DEPTH) {
    throw new RangeError(`${label} exceeds the maximum configuration depth`);
  }
  assertRecord(value, label);
  const present = CONFIG_KINDS.filter((kind) => value[kind] !== undefined);
  if (present.length !== 1) {
    throw new TypeError(`${label} must set exactly one ConfigValue kind`);
  }
  const kind = present[0];
  const item = value[kind];
  switch (kind) {
    case 'nullValue':
      if (item !== 0 && item !== 'NULL_VALUE') {
        throw new TypeError(`${label}.nullValue must be NULL_VALUE`);
      }
      break;
    case 'boolValue':
      if (typeof item !== 'boolean') throw new TypeError(`${label}.boolValue must be boolean`);
      break;
    case 'integerValue':
      parseSigned64(item, `${label}.integerValue`);
      break;
    case 'numberValue':
      if (typeof item !== 'number' || !Number.isFinite(item)) {
        throw new TypeError(`${label}.numberValue must be finite`);
      }
      break;
    case 'stringValue':
      if (typeof item !== 'string') throw new TypeError(`${label}.stringValue must be a string`);
      break;
    case 'bytesValue':
      if (!(item instanceof Uint8Array)) {
        throw new TypeError(`${label}.bytesValue must be a Uint8Array`);
      }
      break;
    case 'listValue': {
      assertRecord(item, `${label}.listValue`);
      const values = item.values ?? [];
      if (!Array.isArray(values)) throw new TypeError(`${label}.listValue.values must be an array`);
      values.forEach((entry, index) => {
        validateConfigValueAtDepth(
          entry,
          depth + 1,
          allowFunction,
          functionSession,
          `${label}[${index}]`,
        );
      });
      break;
    }
    case 'mapValue': {
      assertRecord(item, `${label}.mapValue`);
      const entries = item.entries ?? {};
      assertRecord(entries, `${label}.mapValue.entries`);
      for (const [key, entry] of Object.entries(entries)) {
        validateConfigValueAtDepth(
          entry,
          depth + 1,
          allowFunction,
          functionSession,
          `${label}.${key}`,
        );
      }
      break;
    }
    case 'functionValue':
      if (!allowFunction) throw new TypeError(`${label} cannot contain a configuration function`);
      assertRecord(item, `${label}.functionValue`);
      validateNonemptyString(item.sessionId, `${label}.functionValue.sessionId`);
      validateNonemptyString(item.functionId, `${label}.functionValue.functionId`);
      if (functionSession !== undefined && item.sessionId !== functionSession) {
        throw new TypeError(`${label} contains a function from another plugin session`);
      }
      break;
    case 'timestampValue':
      validateTimestamp(item, `${label}.timestampValue`);
      break;
    case 'durationValue':
      validateDuration(item, `${label}.durationValue`);
      break;
    default:
      throw new TypeError(`${label} contains an unsupported kind`);
  }
}

function validateDuration(value, label) {
  assertRecord(value, label);
  const seconds = parseSigned64(value.seconds ?? '0', `${label}.seconds`);
  const nanos = value.nanos ?? 0;
  if (seconds < -MAXIMUM_DURATION_SECONDS || seconds > MAXIMUM_DURATION_SECONDS) {
    throw new RangeError(`${label}.seconds is outside the protobuf Duration range`);
  }
  if (!Number.isInteger(nanos) || nanos < -999_999_999 || nanos > 999_999_999) {
    throw new RangeError(`${label}.nanos is outside the protobuf Duration range`);
  }
  if ((seconds < 0n && nanos > 0) || (seconds > 0n && nanos < 0)) {
    throw new RangeError(`${label} seconds and nanos must have the same sign`);
  }
}

function validateArtifactFileName(value) {
  validateNonemptyString(value, 'artifact file name');
  if (Buffer.byteLength(value) > MAXIMUM_ARTIFACT_FILE_NAME_BYTES
      || value === '.'
      || value === '..'
      || value.includes('\0')
      || value.includes('/')
      || value.includes('\\')) {
    throw new TypeError('artifact file name must be one safe UTF-8 basename of at most 191 bytes');
  }
}

function parseInteger(value, label, signed = false) {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError(`${label} must be a safe integer or decimal string`);
    }
    return BigInt(value);
  }
  let text;
  if (typeof value === 'string') {
    text = value;
  } else if (value !== null && typeof value === 'object' && typeof value.toString === 'function') {
    text = value.toString();
  }
  const pattern = signed ? /^-?(?:0|[1-9][0-9]*)$/ : DECIMAL_INTEGER_PATTERN;
  if (typeof text !== 'string' || !pattern.test(text)) {
    throw new TypeError(`${label} must be a decimal integer`);
  }
  return BigInt(text);
}

function isLoopbackAddress(host) {
  const normalized = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  if (net.isIP(normalized) === 4) return normalized.startsWith('127.');
  return normalized === '::1';
}
