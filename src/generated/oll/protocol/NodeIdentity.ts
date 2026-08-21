// Original file: proto/oll/common.proto

import type { NodeId as _oll_protocol_NodeId, NodeId__Output as _oll_protocol_NodeId__Output } from '../../oll/protocol/NodeId.js';
import type { NodeName as _oll_protocol_NodeName, NodeName__Output as _oll_protocol_NodeName__Output } from '../../oll/protocol/NodeName.js';

/**
 * NodeId and NodeName are both required and have a durable one-to-one
 * relationship. A node presents this same pair at every local and remote
 * protocol boundary.
 */
export interface NodeIdentity {
  'nodeId'?: (_oll_protocol_NodeId | null);
  'nodeName'?: (_oll_protocol_NodeName | null);
}

/**
 * NodeId and NodeName are both required and have a durable one-to-one
 * relationship. A node presents this same pair at every local and remote
 * protocol boundary.
 */
export interface NodeIdentity__Output {
  'nodeId'?: (_oll_protocol_NodeId__Output);
  'nodeName'?: (_oll_protocol_NodeName__Output);
}
