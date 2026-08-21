// Original file: proto/oll/document.proto

import type { CrdtTextMark as _oll_protocol_CrdtTextMark, CrdtTextMark__Output as _oll_protocol_CrdtTextMark__Output } from '../../oll/protocol/CrdtTextMark.js';

export interface CrdtText {
  'text'?: (string);
  'marks'?: (_oll_protocol_CrdtTextMark)[];
}

export interface CrdtText__Output {
  'text'?: (string);
  'marks'?: (_oll_protocol_CrdtTextMark__Output)[];
}
