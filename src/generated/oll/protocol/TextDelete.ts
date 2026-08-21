// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { Long } from '@grpc/proto-loader';

export interface TextDelete {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'scalarIndex'?: (number | string | Long);
  'scalarCount'?: (number | string | Long);
}

export interface TextDelete__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'scalarIndex'?: (string);
  'scalarCount'?: (string);
}
