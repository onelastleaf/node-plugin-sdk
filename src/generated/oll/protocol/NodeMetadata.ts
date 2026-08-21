// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { NodeKind as _oll_protocol_NodeKind, NodeKind__Output as _oll_protocol_NodeKind__Output } from '../../oll/protocol/NodeKind.js';
import type { CatalogRevision as _oll_protocol_CatalogRevision, CatalogRevision__Output as _oll_protocol_CatalogRevision__Output } from '../../oll/protocol/CatalogRevision.js';
import type { CatalogNodeId as _oll_protocol_CatalogNodeId, CatalogNodeId__Output as _oll_protocol_CatalogNodeId__Output } from '../../oll/protocol/CatalogNodeId.js';
import type { DocumentId as _oll_protocol_DocumentId, DocumentId__Output as _oll_protocol_DocumentId__Output } from '../../oll/protocol/DocumentId.js';
import type { BinaryId as _oll_protocol_BinaryId, BinaryId__Output as _oll_protocol_BinaryId__Output } from '../../oll/protocol/BinaryId.js';
import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from '../../oll/protocol/DocumentRevision.js';
import type { Long } from '@grpc/proto-loader';

export interface NodeMetadata {
  'path'?: (_oll_protocol_DocumentPath | null);
  'kind'?: (_oll_protocol_NodeKind);
  'catalogRevision'?: (_oll_protocol_CatalogRevision | null);
  'mediaType'?: (string);
  'sizeBytes'?: (number | string | Long);
  'nodeId'?: (_oll_protocol_CatalogNodeId | null);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'documentId'?: (_oll_protocol_DocumentId | null);
  /**
   * Present only when kind is NODE_KIND_BINARY.
   */
  'binaryId'?: (_oll_protocol_BinaryId | null);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'documentRevision'?: (_oll_protocol_DocumentRevision | null);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'encoding'?: (string);
  /**
   * Meaningful only when kind is NODE_KIND_DOCUMENT.
   */
  'hasByteOrderMark'?: (boolean);
  '_mediaType'?: "mediaType";
  '_documentId'?: "documentId";
  '_binaryId'?: "binaryId";
  '_documentRevision'?: "documentRevision";
  '_encoding'?: "encoding";
}

export interface NodeMetadata__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'kind'?: (_oll_protocol_NodeKind__Output);
  'catalogRevision'?: (_oll_protocol_CatalogRevision__Output);
  'mediaType'?: (string);
  'sizeBytes'?: (string);
  'nodeId'?: (_oll_protocol_CatalogNodeId__Output);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'documentId'?: (_oll_protocol_DocumentId__Output);
  /**
   * Present only when kind is NODE_KIND_BINARY.
   */
  'binaryId'?: (_oll_protocol_BinaryId__Output);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'documentRevision'?: (_oll_protocol_DocumentRevision__Output);
  /**
   * Present only when kind is NODE_KIND_DOCUMENT.
   */
  'encoding'?: (string);
  /**
   * Meaningful only when kind is NODE_KIND_DOCUMENT.
   */
  'hasByteOrderMark'?: (boolean);
  '_mediaType'?: "mediaType";
  '_documentId'?: "documentId";
  '_binaryId'?: "binaryId";
  '_documentRevision'?: "documentRevision";
  '_encoding'?: "encoding";
}
