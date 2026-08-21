// Original file: proto/oll/document.proto

import type { NullValue as _google_protobuf_NullValue, NullValue__Output as _google_protobuf_NullValue__Output } from '../../google/protobuf/NullValue.js';
import type { Long } from '@grpc/proto-loader';

export interface CrdtScalar {
  'boolValue'?: (boolean);
  'integerValue'?: (number | string | Long);
  'numberValue'?: (number | string);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer | Uint8Array | string);
  'nullValue'?: (_google_protobuf_NullValue);
  'kind'?: "boolValue"|"integerValue"|"numberValue"|"stringValue"|"bytesValue"|"nullValue";
}

export interface CrdtScalar__Output {
  'boolValue'?: (boolean);
  'integerValue'?: (string);
  'numberValue'?: (number);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer);
  'nullValue'?: (_google_protobuf_NullValue__Output);
  'kind'?: "boolValue"|"integerValue"|"numberValue"|"stringValue"|"bytesValue"|"nullValue";
}
