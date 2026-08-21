// Original file: proto/oll/plugin.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp.js';
import type { LogLevel as _oll_protocol_LogLevel, LogLevel__Output as _oll_protocol_LogLevel__Output } from '../../oll/protocol/LogLevel.js';
import type { ConfigValue as _oll_protocol_ConfigValue, ConfigValue__Output as _oll_protocol_ConfigValue__Output } from '../../oll/protocol/ConfigValue.js';

export interface LogRecord {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'level'?: (_oll_protocol_LogLevel);
  'target'?: (string);
  'message'?: (string);
  'fields'?: ({[key: string]: _oll_protocol_ConfigValue});
}

export interface LogRecord__Output {
  'timestamp'?: (_google_protobuf_Timestamp__Output);
  'level'?: (_oll_protocol_LogLevel__Output);
  'target'?: (string);
  'message'?: (string);
  'fields'?: ({[key: string]: _oll_protocol_ConfigValue__Output});
}
