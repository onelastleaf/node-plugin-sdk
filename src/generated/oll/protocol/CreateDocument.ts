// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';

export interface CreateDocument {
  'path'?: (_oll_protocol_DocumentPath | null);
  'mediaType'?: (string);
  'content'?: (string);
}

export interface CreateDocument__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'mediaType'?: (string);
  'content'?: (string);
}
