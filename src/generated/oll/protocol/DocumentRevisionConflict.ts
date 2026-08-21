// Original file: proto/oll/document.proto

import type { DocumentId as _oll_protocol_DocumentId, DocumentId__Output as _oll_protocol_DocumentId__Output } from '../../oll/protocol/DocumentId.js';
import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from '../../oll/protocol/DocumentRevision.js';

export interface DocumentRevisionConflict {
  'documentId'?: (_oll_protocol_DocumentId | null);
  'expected'?: (_oll_protocol_DocumentRevision | null);
  'actual'?: (_oll_protocol_DocumentRevision | null);
  'exists'?: (boolean);
  '_actual'?: "actual";
}

export interface DocumentRevisionConflict__Output {
  'documentId'?: (_oll_protocol_DocumentId__Output);
  'expected'?: (_oll_protocol_DocumentRevision__Output);
  'actual'?: (_oll_protocol_DocumentRevision__Output);
  'exists'?: (boolean);
  '_actual'?: "actual";
}
