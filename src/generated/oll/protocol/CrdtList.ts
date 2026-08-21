// Original file: proto/oll/document.proto

import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from '../../oll/protocol/CrdtValue.js';

export interface CrdtList {
  'values'?: (_oll_protocol_CrdtValue)[];
  /**
   * Move is valid only for a movable list. Plain lists support insert/delete.
   */
  'movable'?: (boolean);
}

export interface CrdtList__Output {
  'values'?: (_oll_protocol_CrdtValue__Output)[];
  /**
   * Move is valid only for a movable list. Plain lists support insert/delete.
   */
  'movable'?: (boolean);
}
