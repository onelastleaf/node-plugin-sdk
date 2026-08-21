// Original file: proto/oll/plugin.proto

import type { PluginJobId as _oll_protocol_PluginJobId, PluginJobId__Output as _oll_protocol_PluginJobId__Output } from '../../oll/protocol/PluginJobId.js';
import type { JobCancellationReason as _oll_protocol_JobCancellationReason, JobCancellationReason__Output as _oll_protocol_JobCancellationReason__Output } from '../../oll/protocol/JobCancellationReason.js';

export interface CancelJobRequest {
  'jobId'?: (_oll_protocol_PluginJobId | null);
  'reason'?: (_oll_protocol_JobCancellationReason);
}

export interface CancelJobRequest__Output {
  'jobId'?: (_oll_protocol_PluginJobId__Output);
  'reason'?: (_oll_protocol_JobCancellationReason__Output);
}
