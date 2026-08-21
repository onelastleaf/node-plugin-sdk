// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { CatalogNodeId as _oll_protocol_CatalogNodeId, CatalogNodeId__Output as _oll_protocol_CatalogNodeId__Output } from '../../oll/protocol/CatalogNodeId.js';
import type { CatalogRevision as _oll_protocol_CatalogRevision, CatalogRevision__Output as _oll_protocol_CatalogRevision__Output } from '../../oll/protocol/CatalogRevision.js';
import type { DocumentId as _oll_protocol_DocumentId, DocumentId__Output as _oll_protocol_DocumentId__Output } from '../../oll/protocol/DocumentId.js';
import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from '../../oll/protocol/DocumentRevision.js';
import type { BinaryId as _oll_protocol_BinaryId, BinaryId__Output as _oll_protocol_BinaryId__Output } from '../../oll/protocol/BinaryId.js';

export interface UpdatedNode {
  'path'?: (_oll_protocol_DocumentPath | null);
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId | null);
  'catalogRevision'?: (_oll_protocol_CatalogRevision | null);
  'documentId'?: (_oll_protocol_DocumentId | null);
  'documentRevision'?: (_oll_protocol_DocumentRevision | null);
  'binaryId'?: (_oll_protocol_BinaryId | null);
  'deleted'?: (boolean);
  '_catalogRevision'?: "catalogRevision";
  '_documentId'?: "documentId";
  '_documentRevision'?: "documentRevision";
  '_binaryId'?: "binaryId";
}

export interface UpdatedNode__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'catalogNodeId'?: (_oll_protocol_CatalogNodeId__Output);
  'catalogRevision'?: (_oll_protocol_CatalogRevision__Output);
  'documentId'?: (_oll_protocol_DocumentId__Output);
  'documentRevision'?: (_oll_protocol_DocumentRevision__Output);
  'binaryId'?: (_oll_protocol_BinaryId__Output);
  'deleted'?: (boolean);
  '_catalogRevision'?: "catalogRevision";
  '_documentId'?: "documentId";
  '_documentRevision'?: "documentRevision";
  '_binaryId'?: "binaryId";
}
