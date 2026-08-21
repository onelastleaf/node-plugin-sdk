// Original file: proto/oll/document.proto

import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from '../../oll/protocol/CrdtObjectPath.js';
import type { Long } from '@grpc/proto-loader';

export interface TextUnmark {
  'target'?: (_oll_protocol_CrdtObjectPath | null);
  'startScalar'?: (number | string | Long);
  'endScalar'?: (number | string | Long);
  'name'?: (string);
}

export interface TextUnmark__Output {
  'target'?: (_oll_protocol_CrdtObjectPath__Output);
  'startScalar'?: (string);
  'endScalar'?: (string);
  'name'?: (string);
}
