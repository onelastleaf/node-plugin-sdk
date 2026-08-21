// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { Long } from '@grpc/proto-loader';

export interface ListDelete {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'index'?: (number | string | Long);
  'count'?: (number | string | Long);
}

export interface ListDelete__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'index'?: (string);
  'count'?: (string);
}
