// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { Long } from '@grpc/proto-loader';

export interface TextInsert {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'scalarIndex'?: (number | string | Long);
  'text'?: (string);
}

export interface TextInsert__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'scalarIndex'?: (string);
  'text'?: (string);
}
