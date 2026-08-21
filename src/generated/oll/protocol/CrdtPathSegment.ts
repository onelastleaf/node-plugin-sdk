// Original file: proto/oll/document.proto

import type { Long } from '@grpc/proto-loader';

export interface CrdtPathSegment {
  'mapKey'?: (string);
  'listIndex'?: (number | string | Long);
  'treeNodeId'?: (string);
  'kind'?: "mapKey"|"listIndex"|"treeNodeId";
}

export interface CrdtPathSegment__Output {
  'mapKey'?: (string);
  'listIndex'?: (string);
  'treeNodeId'?: (string);
  'kind'?: "mapKey"|"listIndex"|"treeNodeId";
}
