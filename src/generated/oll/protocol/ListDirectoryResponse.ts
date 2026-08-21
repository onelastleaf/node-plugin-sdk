// Original file: proto/oll/document.proto

import type { NodeMetadata as _oll_protocol_NodeMetadata, NodeMetadata__Output as _oll_protocol_NodeMetadata__Output } from '../../oll/protocol/NodeMetadata.js';

export interface ListDirectoryResponse {
  'directory'?: (_oll_protocol_NodeMetadata | null);
  'entries'?: (_oll_protocol_NodeMetadata)[];
}

export interface ListDirectoryResponse__Output {
  'directory'?: (_oll_protocol_NodeMetadata__Output);
  'entries'?: (_oll_protocol_NodeMetadata__Output)[];
}
