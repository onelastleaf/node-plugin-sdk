// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';

export interface CounterIncrement {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'delta'?: (number | string);
}

export interface CounterIncrement__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'delta'?: (number);
}
