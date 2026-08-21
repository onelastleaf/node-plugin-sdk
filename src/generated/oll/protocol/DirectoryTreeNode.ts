// Original file: proto/oll/document.proto

import type { NodeMetadata as _oll_protocol_NodeMetadata, NodeMetadata__Output as _oll_protocol_NodeMetadata__Output } from '../../oll/protocol/NodeMetadata.js';
import type { DirectoryTreeNode as _oll_protocol_DirectoryTreeNode, DirectoryTreeNode__Output as _oll_protocol_DirectoryTreeNode__Output } from '../../oll/protocol/DirectoryTreeNode.js';

export interface DirectoryTreeNode {
  'metadata'?: (_oll_protocol_NodeMetadata | null);
  'children'?: (_oll_protocol_DirectoryTreeNode)[];
}

export interface DirectoryTreeNode__Output {
  'metadata'?: (_oll_protocol_NodeMetadata__Output);
  'children'?: (_oll_protocol_DirectoryTreeNode__Output)[];
}
