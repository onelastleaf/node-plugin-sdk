// Original file: proto/oll/document.proto

import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from '../../oll/protocol/CrdtScalar.js';
import type { Long } from '@grpc/proto-loader';

export interface CrdtTreeNode {
  'nodeId'?: (string);
  'parentId'?: (string);
  'indexInParent'?: (number | string | Long);
  'metadata'?: ({[key: string]: _oll_protocol_CrdtScalar});
  '_parentId'?: "parentId";
  '_indexInParent'?: "indexInParent";
}

export interface CrdtTreeNode__Output {
  'nodeId'?: (string);
  'parentId'?: (string);
  'indexInParent'?: (string);
  'metadata'?: ({[key: string]: _oll_protocol_CrdtScalar__Output});
  '_parentId'?: "parentId";
  '_indexInParent'?: "indexInParent";
}
