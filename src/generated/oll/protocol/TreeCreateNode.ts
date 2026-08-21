// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from '../../oll/protocol/CrdtScalar.js';
import type { Long } from '@grpc/proto-loader';

export interface TreeCreateNode {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'nodeId'?: (string);
  'parentId'?: (string);
  'index'?: (number | string | Long);
  'metadata'?: ({[key: string]: _oll_protocol_CrdtScalar});
  '_parentId'?: "parentId";
}

export interface TreeCreateNode__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'nodeId'?: (string);
  'parentId'?: (string);
  'index'?: (string);
  'metadata'?: ({[key: string]: _oll_protocol_CrdtScalar__Output});
  '_parentId'?: "parentId";
}
