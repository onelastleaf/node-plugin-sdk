// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { Long } from '@grpc/proto-loader';

export interface SpliceDocumentText {
  'path'?: (_oll_protocol_DocumentPath | null);
  'scalarIndex'?: (number | string | Long);
  'deleteScalarCount'?: (number | string | Long);
  'insertText'?: (string);
}

export interface SpliceDocumentText__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'scalarIndex'?: (string);
  'deleteScalarCount'?: (string);
  'insertText'?: (string);
}
