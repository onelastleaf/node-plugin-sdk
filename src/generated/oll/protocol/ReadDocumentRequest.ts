// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { DocumentProjection as _oll_protocol_DocumentProjection, DocumentProjection__Output as _oll_protocol_DocumentProjection__Output } from '../../oll/protocol/DocumentProjection.js';

export interface ReadDocumentRequest {
  'path'?: (_oll_protocol_DocumentPath | null);
  'projection'?: (_oll_protocol_DocumentProjection);
}

export interface ReadDocumentRequest__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'projection'?: (_oll_protocol_DocumentProjection__Output);
}
