// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';

export interface ReadCrdtRequest {
  'document'?: (_oll_protocol_DocumentPath | null);
  'object'?: (_oll_protocol_CrdtObjectPath | null);
}

export interface ReadCrdtRequest__Output {
  'document'?: (_oll_protocol_DocumentPath__Output);
  'object'?: (_oll_protocol_CrdtObjectPath__Output);
}
