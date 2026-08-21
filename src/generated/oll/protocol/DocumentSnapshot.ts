// Original file: proto/oll/document.proto

import type { NodeMetadata as _oll_protocol_NodeMetadata, NodeMetadata__Output as _oll_protocol_NodeMetadata__Output } from '../../oll/protocol/NodeMetadata.js';
import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from '../../oll/protocol/CrdtValue.js';

export interface DocumentSnapshot {
  'metadata'?: (_oll_protocol_NodeMetadata | null);
  'content'?: (string);
  'crdt'?: (_oll_protocol_CrdtValue | null);
  'representation'?: "content"|"crdt";
}

export interface DocumentSnapshot__Output {
  'metadata'?: (_oll_protocol_NodeMetadata__Output);
  'content'?: (string);
  'crdt'?: (_oll_protocol_CrdtValue__Output);
  'representation'?: "content"|"crdt";
}
