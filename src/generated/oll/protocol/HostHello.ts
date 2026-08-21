// Original file: proto/oll/plugin.proto

import type { NodeIdentity as _oll_protocol_NodeIdentity, NodeIdentity__Output as _oll_protocol_NodeIdentity__Output } from '../../oll/protocol/NodeIdentity.js';
import type { PluginId as _oll_protocol_PluginId, PluginId__Output as _oll_protocol_PluginId__Output } from '../../oll/protocol/PluginId.js';
import type { PluginName as _oll_protocol_PluginName, PluginName__Output as _oll_protocol_PluginName__Output } from '../../oll/protocol/PluginName.js';
import type { Long } from '@grpc/proto-loader';

export interface HostHello {
  'node'?: (_oll_protocol_NodeIdentity | null);
  'maximumCallDepth'?: (number);
  'maximumCausalDepth'?: (number);
  'maximumArtifactChunkBytes'?: (number | string | Long);
  'pluginId'?: (_oll_protocol_PluginId | null);
  'pluginName'?: (_oll_protocol_PluginName | null);
}

export interface HostHello__Output {
  'node'?: (_oll_protocol_NodeIdentity__Output);
  'maximumCallDepth'?: (number);
  'maximumCausalDepth'?: (number);
  'maximumArtifactChunkBytes'?: (string);
  'pluginId'?: (_oll_protocol_PluginId__Output);
  'pluginName'?: (_oll_protocol_PluginName__Output);
}
