// Original file: proto/oll/plugin.proto

import type { PluginArtifactId as _oll_protocol_PluginArtifactId, PluginArtifactId__Output as _oll_protocol_PluginArtifactId__Output } from '../../oll/protocol/PluginArtifactId.js';
import type { Long } from '@grpc/proto-loader';

export interface ArtifactDescriptor {
  'artifactId'?: (_oll_protocol_PluginArtifactId | null);
  'fileName'?: (string);
  'mediaType'?: (string);
  'sizeBytes'?: (number | string | Long);
  'sha256'?: (Buffer | Uint8Array | string);
}

export interface ArtifactDescriptor__Output {
  'artifactId'?: (_oll_protocol_PluginArtifactId__Output);
  'fileName'?: (string);
  'mediaType'?: (string);
  'sizeBytes'?: (string);
  'sha256'?: (Buffer);
}
