// Original file: proto/oll/document.proto

import type { CatalogNodeId as _oll_protocol_CatalogNodeId, CatalogNodeId__Output as _oll_protocol_CatalogNodeId__Output } from '../../oll/protocol/CatalogNodeId.js';
import type { CatalogRevision as _oll_protocol_CatalogRevision, CatalogRevision__Output as _oll_protocol_CatalogRevision__Output } from '../../oll/protocol/CatalogRevision.js';

export interface CatalogRevisionConflict {
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId | null);
  'expected'?: (_oll_protocol_CatalogRevision | null);
  'actual'?: (_oll_protocol_CatalogRevision | null);
  'exists'?: (boolean);
  '_actual'?: "actual";
}

export interface CatalogRevisionConflict__Output {
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId__Output);
  'expected'?: (_oll_protocol_CatalogRevision__Output);
  'actual'?: (_oll_protocol_CatalogRevision__Output);
  'exists'?: (boolean);
  '_actual'?: "actual";
}
