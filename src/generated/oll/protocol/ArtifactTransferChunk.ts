// Original file: proto/oll/plugin.proto

import type { PluginArtifactId as _oll_protocol_PluginArtifactId, PluginArtifactId__Output as _oll_protocol_PluginArtifactId__Output } from '../../oll/protocol/PluginArtifactId.js';

export interface ArtifactTransferChunk {
  'artifactId'?: (_oll_protocol_PluginArtifactId | null);
  'chunkIndex'?: (number);
  'data'?: (Buffer | Uint8Array | string);
}

export interface ArtifactTransferChunk__Output {
  'artifactId'?: (_oll_protocol_PluginArtifactId__Output);
  'chunkIndex'?: (number);
  'data'?: (Buffer);
}
