// Original file: proto/oll/document.proto

import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from '../../oll/protocol/DocumentPath.js';
import type { CrdtOperation as _oll_protocol_CrdtOperation, CrdtOperation__Output as _oll_protocol_CrdtOperation__Output } from '../../oll/protocol/CrdtOperation.js';

export interface ApplyCrdtOperations {
  'document'?: (_oll_protocol_DocumentPath | null);
  'operations'?: (_oll_protocol_CrdtOperation)[];
}

export interface ApplyCrdtOperations__Output {
  'document'?: (_oll_protocol_DocumentPath__Output);
  'operations'?: (_oll_protocol_CrdtOperation__Output)[];
}
