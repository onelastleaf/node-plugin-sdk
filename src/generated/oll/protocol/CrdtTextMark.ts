// Original file: proto/oll/document.proto

import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from '../../oll/protocol/CrdtScalar.js';
import type { Long } from '@grpc/proto-loader';

export interface CrdtTextMark {
  'startScalar'?: (number | string | Long);
  'endScalar'?: (number | string | Long);
  'name'?: (string);
  'value'?: (_oll_protocol_CrdtScalar | null);
}

export interface CrdtTextMark__Output {
  'startScalar'?: (string);
  'endScalar'?: (string);
  'name'?: (string);
  'value'?: (_oll_protocol_CrdtScalar__Output);
}
