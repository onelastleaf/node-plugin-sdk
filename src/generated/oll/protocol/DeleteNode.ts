// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';

export interface DeleteNode {
  'path'?: (_oll_protocol_DocumentPath | null);
  'recursive'?: (boolean);
}

export interface DeleteNode__Output {
  'path'?: (_oll_protocol_DocumentPath__Output);
  'recursive'?: (boolean);
}
