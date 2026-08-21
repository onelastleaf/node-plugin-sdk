import path from 'node:path';
import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const definition = protoLoader.loadSync(path.join(root, 'proto/oll/plugin.proto'), {
  includeDirs: [path.join(root, 'proto')],
  longs: String,
  enums: String,
  defaults: false,
  oneofs: true,
});

const loaded = grpc.loadPackageDefinition(definition);
// proto-loader constructs this namespace dynamically from the canonical schema.
// The runtime shape cannot be expressed by grpc-js's generic GrpcObject type.
export const protocol = /** @type {any} */ (loaded).oll.protocol;
export const PROTOCOL_ERROR_CODES = enumNames('ErrorCode');
export const LOG_LEVELS = Object.freeze(enumNames('LogLevel').filter(
  (name) => name !== 'LOG_LEVEL_UNSPECIFIED',
));
export const JOB_CANCELLATION_REASONS = Object.freeze(enumNames('JobCancellationReason').filter(
  (name) => name !== 'JOB_CANCELLATION_REASON_UNSPECIFIED',
));
export const HOST_CALL_KINDS = messageFieldNames('HostCallRequest');
export { grpc };

function enumNames(name) {
  const values = protocol[name]?.type?.value;
  if (!Array.isArray(values)) throw new Error(`protobuf enum ${name} is unavailable`);
  return Object.freeze(values.map((value) => value.name));
}

function messageFieldNames(name) {
  const fields = protocol[name]?.type?.field;
  if (!Array.isArray(fields)) throw new Error(`protobuf message ${name} is unavailable`);
  return Object.freeze(fields.map((field) => field.name));
}
