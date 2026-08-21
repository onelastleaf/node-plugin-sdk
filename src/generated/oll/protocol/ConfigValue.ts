// Original file: proto/oll/config.proto

import type { NullValue as _google_protobuf_NullValue, NullValue__Output as _google_protobuf_NullValue__Output } from '../../google/protobuf/NullValue.js';
import type { ConfigList as _oll_protocol_ConfigList, ConfigList__Output as _oll_protocol_ConfigList__Output } from '../../oll/protocol/ConfigList.js';
import type { ConfigMap as _oll_protocol_ConfigMap, ConfigMap__Output as _oll_protocol_ConfigMap__Output } from '../../oll/protocol/ConfigMap.js';
import type { ConfigFunctionRef as _oll_protocol_ConfigFunctionRef, ConfigFunctionRef__Output as _oll_protocol_ConfigFunctionRef__Output } from '../../oll/protocol/ConfigFunctionRef.js';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp.js';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration.js';
import type { Long } from '@grpc/proto-loader';

/**
 * The structured value format crossing the configuration boundary and used by
 * Lua, structured results, and log fields. Generic plugin actions use
 * shell-style string argv instead. Lua adapters must reject cyclic tables and
 * values that cannot be represented here. A root value has depth zero and the
 * deepest accepted value has depth 33. Numbers must be finite; Timestamp and
 * Duration values must be inside their protobuf domains. Function handles are
 * accepted only by configuration-function calls for the exact active session
 * and an existing registry entry; durable values and log fields reject them.
 */
export interface ConfigValue {
  'nullValue'?: (_google_protobuf_NullValue);
  'boolValue'?: (boolean);
  'integerValue'?: (number | string | Long);
  'numberValue'?: (number | string);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer | Uint8Array | string);
  'listValue'?: (_oll_protocol_ConfigList | null);
  'mapValue'?: (_oll_protocol_ConfigMap | null);
  'functionValue'?: (_oll_protocol_ConfigFunctionRef | null);
  'timestampValue'?: (_google_protobuf_Timestamp | null);
  'durationValue'?: (_google_protobuf_Duration | null);
  'kind'?: "nullValue"|"boolValue"|"integerValue"|"numberValue"|"stringValue"|"bytesValue"|"listValue"|"mapValue"|"functionValue"|"timestampValue"|"durationValue";
}

/**
 * The structured value format crossing the configuration boundary and used by
 * Lua, structured results, and log fields. Generic plugin actions use
 * shell-style string argv instead. Lua adapters must reject cyclic tables and
 * values that cannot be represented here. A root value has depth zero and the
 * deepest accepted value has depth 33. Numbers must be finite; Timestamp and
 * Duration values must be inside their protobuf domains. Function handles are
 * accepted only by configuration-function calls for the exact active session
 * and an existing registry entry; durable values and log fields reject them.
 */
export interface ConfigValue__Output {
  'nullValue'?: (_google_protobuf_NullValue__Output);
  'boolValue'?: (boolean);
  'integerValue'?: (string);
  'numberValue'?: (number);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer);
  'listValue'?: (_oll_protocol_ConfigList__Output);
  'mapValue'?: (_oll_protocol_ConfigMap__Output);
  'functionValue'?: (_oll_protocol_ConfigFunctionRef__Output);
  'timestampValue'?: (_google_protobuf_Timestamp__Output);
  'durationValue'?: (_google_protobuf_Duration__Output);
  'kind'?: "nullValue"|"boolValue"|"integerValue"|"numberValue"|"stringValue"|"bytesValue"|"listValue"|"mapValue"|"functionValue"|"timestampValue"|"durationValue";
}
