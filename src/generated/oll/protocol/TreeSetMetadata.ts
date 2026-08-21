// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from '../../oll/protocol/CrdtScalar.js';

export interface TreeSetMetadata {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'nodeId'?: (string);
  'key'?: (string);
  'value'?: (_oll_protocol_CrdtScalar | null);
  '_value'?: "value";
}

export interface TreeSetMetadata__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'nodeId'?: (string);
  'key'?: (string);
  'value'?: (_oll_protocol_CrdtScalar__Output);
  '_value'?: "value";
}
