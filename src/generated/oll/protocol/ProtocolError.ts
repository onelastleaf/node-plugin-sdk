// Original file: proto/oll/common.proto

import type { ErrorCode as _oll_protocol_ErrorCode, ErrorCode__Output as _oll_protocol_ErrorCode__Output } from '../../oll/protocol/ErrorCode.js';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../google/protobuf/Any.js';

export interface ProtocolError {
  'code'?: (_oll_protocol_ErrorCode);
  'message'?: (string);
  'retryable'?: (boolean);
  'metadata'?: ({[key: string]: string});
  'details'?: (_google_protobuf_Any)[];
}

export interface ProtocolError__Output {
  'code'?: (_oll_protocol_ErrorCode__Output);
  'message'?: (string);
  'retryable'?: (boolean);
  'metadata'?: ({[key: string]: string});
  'details'?: (_google_protobuf_Any__Output)[];
}
