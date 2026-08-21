// Original file: proto/oll/plugin.proto

import type { PluginJobId as _oll_protocol_PluginJobId, PluginJobId__Output as _oll_protocol_PluginJobId__Output } from '../../oll/protocol/PluginJobId.js';
import type { ArtifactDescriptor as _oll_protocol_ArtifactDescriptor, ArtifactDescriptor__Output as _oll_protocol_ArtifactDescriptor__Output } from '../../oll/protocol/ArtifactDescriptor.js';

export interface ArtifactTransferStart {
  'jobId'?: (_oll_protocol_PluginJobId | null);
  'artifact'?: (_oll_protocol_ArtifactDescriptor | null);
  'chunkCount'?: (number);
}

export interface ArtifactTransferStart__Output {
  'jobId'?: (_oll_protocol_PluginJobId__Output);
  'artifact'?: (_oll_protocol_ArtifactDescriptor__Output);
  'chunkCount'?: (number);
}
