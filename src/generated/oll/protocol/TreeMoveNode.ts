// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { Long } from '@grpc/proto-loader';

export interface TreeMoveNode {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'nodeId'?: (string);
  'parentId'?: (string);
  'index'?: (number | string | Long);
  '_parentId'?: "parentId";
}

export interface TreeMoveNode__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'nodeId'?: (string);
  'parentId'?: (string);
  'index'?: (string);
  '_parentId'?: "parentId";
}
