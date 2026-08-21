// Original file: proto/oll/plugin.proto

import type { PluginJobId as _oll_protocol_PluginJobId, PluginJobId__Output as _oll_protocol_PluginJobId__Output } from '../../oll/protocol/PluginJobId.js';
import type { JobState as _oll_protocol_JobState, JobState__Output as _oll_protocol_JobState__Output } from '../../oll/protocol/JobState.js';
import type { ConfigValue as _oll_protocol_ConfigValue, ConfigValue__Output as _oll_protocol_ConfigValue__Output } from '../../oll/protocol/ConfigValue.js';
import type { ProtocolError as _oll_protocol_ProtocolError, ProtocolError__Output as _oll_protocol_ProtocolError__Output } from '../../oll/protocol/ProtocolError.js';
import type { ArtifactDescriptor as _oll_protocol_ArtifactDescriptor, ArtifactDescriptor__Output as _oll_protocol_ArtifactDescriptor__Output } from '../../oll/protocol/ArtifactDescriptor.js';

export interface JobUpdate {
  'jobId'?: (_oll_protocol_PluginJobId | null);
  'state'?: (_oll_protocol_JobState);
  'progress'?: (number | string);
  'statusMessage'?: (string);
  'result'?: (_oll_protocol_ConfigValue | null);
  'error'?: (_oll_protocol_ProtocolError | null);
  /**
   * Terminal updates list only artifacts that oll has acknowledged as stored.
   */
  'artifacts'?: (_oll_protocol_ArtifactDescriptor)[];
  '_progress'?: "progress";
  '_statusMessage'?: "statusMessage";
  '_result'?: "result";
  '_error'?: "error";
}

export interface JobUpdate__Output {
  'jobId'?: (_oll_protocol_PluginJobId__Output);
  'state'?: (_oll_protocol_JobState__Output);
  'progress'?: (number);
  'statusMessage'?: (string);
  'result'?: (_oll_protocol_ConfigValue__Output);
  'error'?: (_oll_protocol_ProtocolError__Output);
  /**
   * Terminal updates list only artifacts that oll has acknowledged as stored.
   */
  'artifacts'?: (_oll_protocol_ArtifactDescriptor__Output)[];
  '_progress'?: "progress";
  '_statusMessage'?: "statusMessage";
  '_result'?: "result";
  '_error'?: "error";
}
