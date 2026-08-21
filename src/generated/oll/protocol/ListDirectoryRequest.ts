// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';

export interface ListDirectoryRequest {
  'path'?: (_oll_protocol_DocumentPath | null);
  'recursive'?: (boolean);
}

export interface ListDirectoryRequest__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'recursive'?: (boolean);
}
