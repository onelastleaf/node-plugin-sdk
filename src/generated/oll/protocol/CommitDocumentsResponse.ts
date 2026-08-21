// Original file: proto/oll/document.proto

import type { UpdatedNode as _oll_protocol_UpdatedNode, UpdatedNode__Output as _oll_protocol_UpdatedNode__Output } from '../../oll/protocol/UpdatedNode.js';

export interface CommitDocumentsResponse {
  'operationId'?: (string);
  'updatedNodes'?: (_oll_protocol_UpdatedNode)[];
}

export interface CommitDocumentsResponse__Output {
  'operationId'?: (string);
  'updatedNodes'?: (_oll_protocol_UpdatedNode__Output)[];
}
