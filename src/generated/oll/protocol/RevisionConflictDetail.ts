// Original file: proto/oll/document.proto

import type { CatalogRevisionConflict as _oll_protocol_CatalogRevisionConflict, CatalogRevisionConflict__Output as _oll_protocol_CatalogRevisionConflict__Output } from '../../oll/protocol/CatalogRevisionConflict.js';
import type { DocumentRevisionConflict as _oll_protocol_DocumentRevisionConflict, DocumentRevisionConflict__Output as _oll_protocol_DocumentRevisionConflict__Output } from '../../oll/protocol/DocumentRevisionConflict.js';

export interface RevisionConflictDetail {
  'catalog'?: (_oll_protocol_CatalogRevisionConflict | null);
  'document'?: (_oll_protocol_DocumentRevisionConflict | null);
  'conflict'?: "catalog"|"document";
}

export interface RevisionConflictDetail__Output {
  'catalog'?: (_oll_protocol_CatalogRevisionConflict__Output);
  'document'?: (_oll_protocol_DocumentRevisionConflict__Output);
  'conflict'?: "catalog"|"document";
}
