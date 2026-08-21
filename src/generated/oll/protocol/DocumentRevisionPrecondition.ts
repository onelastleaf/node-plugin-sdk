// Original file: proto/oll/document.proto

import type { DocumentId as _oll_protocol_DocumentId, DocumentId__Output as _oll_protocol_DocumentId__Output } from '../../oll/protocol/DocumentId.js';
import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from '../../oll/protocol/DocumentRevision.js';

export interface DocumentRevisionPrecondition {
  'documentId'?: (_oll_protocol_DocumentId | null);
  'unchangedSince'?: (_oll_protocol_DocumentRevision | null);
}

export interface DocumentRevisionPrecondition__Output {
  'documentId'?: (_oll_protocol_DocumentId__Output);
  'unchangedSince'?: (_oll_protocol_DocumentRevision__Output);
}
