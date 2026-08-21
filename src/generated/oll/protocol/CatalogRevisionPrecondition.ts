// Original file: proto/oll/document.proto

import type { CatalogNodeId as _oll_protocol_CatalogNodeId, CatalogNodeId__Output as _oll_protocol_CatalogNodeId__Output } from '../../oll/protocol/CatalogNodeId.js';
import type { CatalogRevision as _oll_protocol_CatalogRevision, CatalogRevision__Output as _oll_protocol_CatalogRevision__Output } from '../../oll/protocol/CatalogRevision.js';

export interface CatalogRevisionPrecondition {
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId | null);
  'unchangedSince'?: (_oll_protocol_CatalogRevision | null);
}

export interface CatalogRevisionPrecondition__Output {
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId__Output);
  'unchangedSince'?: (_oll_protocol_CatalogRevision__Output);
}
