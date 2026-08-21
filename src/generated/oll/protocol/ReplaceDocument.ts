// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';

export interface ReplaceDocument {
  'path'?: (_oll_protocol_DocumentPath | null);
  'content'?: (string);
  'mediaType'?: (string);
  '_mediaType'?: "mediaType";
}

export interface ReplaceDocument__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'content'?: (string);
  'mediaType'?: (string);
  '_mediaType'?: "mediaType";
}
