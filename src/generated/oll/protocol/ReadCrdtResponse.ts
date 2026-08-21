// Original file: proto/oll/document.proto

import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from '../../oll/protocol/DocumentRevision.js';
import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from '../../oll/protocol/CrdtValue.js';

export interface ReadCrdtResponse {
  'revision'?: (_oll_protocol_DocumentRevision | null);
  'value'?: (_oll_protocol_CrdtValue | null);
}

export interface ReadCrdtResponse__Output {
  'revision'?: (_oll_protocol_DocumentRevision__Output);
  'value'?: (_oll_protocol_CrdtValue__Output);
}
