// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from '../../oll/protocol/CrdtValue.js';

export interface MapSet {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'key'?: (string);
  'value'?: (_oll_protocol_CrdtValue | null);
}

export interface MapSet__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'key'?: (string);
  'value'?: (_oll_protocol_CrdtValue__Output);
}
