// Original file: proto/oll/document.proto

import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from '../../oll/protocol/CrdtScalar.js';
import type { CrdtText as _oll_protocol_CrdtText, CrdtText__Output as _oll_protocol_CrdtText__Output } from '../../oll/protocol/CrdtText.js';
import type { CrdtList as _oll_protocol_CrdtList, CrdtList__Output as _oll_protocol_CrdtList__Output } from '../../oll/protocol/CrdtList.js';
import type { CrdtMap as _oll_protocol_CrdtMap, CrdtMap__Output as _oll_protocol_CrdtMap__Output } from '../../oll/protocol/CrdtMap.js';
import type { CrdtTree as _oll_protocol_CrdtTree, CrdtTree__Output as _oll_protocol_CrdtTree__Output } from '../../oll/protocol/CrdtTree.js';
import type { CrdtCounter as _oll_protocol_CrdtCounter, CrdtCounter__Output as _oll_protocol_CrdtCounter__Output } from '../../oll/protocol/CrdtCounter.js';

/**
 * This is oll's stable CRDT data model. It is deliberately not a serialized
 * Loro object and does not expose Loro container IDs or methods.
 */
export interface CrdtValue {
  'scalar'?: (_oll_protocol_CrdtScalar | null);
  'text'?: (_oll_protocol_CrdtText | null);
  'list'?: (_oll_protocol_CrdtList | null);
  'map'?: (_oll_protocol_CrdtMap | null);
  'tree'?: (_oll_protocol_CrdtTree | null);
  'counter'?: (_oll_protocol_CrdtCounter | null);
  'kind'?: "scalar"|"text"|"list"|"map"|"tree"|"counter";
}

/**
 * This is oll's stable CRDT data model. It is deliberately not a serialized
 * Loro object and does not expose Loro container IDs or methods.
 */
export interface CrdtValue__Output {
  'scalar'?: (_oll_protocol_CrdtScalar__Output);
  'text'?: (_oll_protocol_CrdtText__Output);
  'list'?: (_oll_protocol_CrdtList__Output);
  'map'?: (_oll_protocol_CrdtMap__Output);
  'tree'?: (_oll_protocol_CrdtTree__Output);
  'counter'?: (_oll_protocol_CrdtCounter__Output);
  'kind'?: "scalar"|"text"|"list"|"map"|"tree"|"counter";
}
