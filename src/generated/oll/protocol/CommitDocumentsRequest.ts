// Original file: proto/oll/document.proto

import type { CommitPrecondition as _oll_protocol_CommitPrecondition, CommitPrecondition__Output as _oll_protocol_CommitPrecondition__Output } from '../../oll/protocol/CommitPrecondition.js';
import type { DocumentMutation as _oll_protocol_DocumentMutation, DocumentMutation__Output as _oll_protocol_DocumentMutation__Output } from '../../oll/protocol/DocumentMutation.js';

/**
 * All preconditions are checked immediately before one host-level commit. A
 * mismatch returns REVISION_CONFLICT and applies none of the mutations. Because
 * the catalog and documents are separate LoroDocs, the host uses its replica
 * write coordinator and crash-recovery journal rather than one Loro
 * transaction.
 */
export interface CommitDocumentsRequest {
  'operationId'?: (string);
  'preconditions'?: (_oll_protocol_CommitPrecondition)[];
  'mutations'?: (_oll_protocol_DocumentMutation)[];
}

/**
 * All preconditions are checked immediately before one host-level commit. A
 * mismatch returns REVISION_CONFLICT and applies none of the mutations. Because
 * the catalog and documents are separate LoroDocs, the host uses its replica
 * write coordinator and crash-recovery journal rather than one Loro
 * transaction.
 */
export interface CommitDocumentsRequest__Output {
  'operationId'?: (string);
  'preconditions'?: (_oll_protocol_CommitPrecondition__Output)[];
  'mutations'?: (_oll_protocol_DocumentMutation__Output)[];
}
