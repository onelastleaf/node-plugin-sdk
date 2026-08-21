// Original file: proto/oll/document.proto

import type { CatalogRevisionPrecondition as _oll_protocol_CatalogRevisionPrecondition, CatalogRevisionPrecondition__Output as _oll_protocol_CatalogRevisionPrecondition__Output } from '../../oll/protocol/CatalogRevisionPrecondition.js';
import type { DocumentRevisionPrecondition as _oll_protocol_DocumentRevisionPrecondition, DocumentRevisionPrecondition__Output as _oll_protocol_DocumentRevisionPrecondition__Output } from '../../oll/protocol/DocumentRevisionPrecondition.js';
import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';

export interface CommitPrecondition {
  'catalogUnchanged'?: (_oll_protocol_CatalogRevisionPrecondition | null);
  'documentUnchanged'?: (_oll_protocol_DocumentRevisionPrecondition | null);
  'mustExist'?: (_oll_protocol_DocumentPath | null);
  'mustNotExist'?: (_oll_protocol_DocumentPath | null);
  /**
   * Revision checks name their stable target IDs explicitly. Existence checks
   * remain path-based because the entry being checked may not have an ID.
   */
  'condition'?: "catalogUnchanged"|"documentUnchanged"|"mustExist"|"mustNotExist";
}

export interface CommitPrecondition__Output {
  'catalogUnchanged'?: (_oll_protocol_CatalogRevisionPrecondition__Output);
  'documentUnchanged'?: (_oll_protocol_DocumentRevisionPrecondition__Output);
  'mustExist'?: (_oll_protocol_DocumentPath__Output);
  'mustNotExist'?: (_oll_protocol_DocumentPath__Output);
  /**
   * Revision checks name their stable target IDs explicitly. Existence checks
   * remain path-based because the entry being checked may not have an ID.
   */
  'condition'?: "catalogUnchanged"|"documentUnchanged"|"mustExist"|"mustNotExist";
}
