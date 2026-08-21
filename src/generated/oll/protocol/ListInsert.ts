// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from '../../oll/protocol/CrdtValue.js';
import type { Long } from '@grpc/proto-loader';

export interface ListInsert {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'index'?: (number | string | Long);
  'values'?: (_oll_protocol_CrdtValue)[];
}

export interface ListInsert__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'index'?: (string);
  'values'?: (_oll_protocol_CrdtValue__Output)[];
}
