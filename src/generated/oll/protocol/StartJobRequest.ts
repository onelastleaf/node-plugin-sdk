// Original file: proto/oll/plugin.proto

import type { PluginJobId as _oll_protocol_PluginJobId, PluginJobId__Output as _oll_protocol_PluginJobId__Output } from '../../oll/protocol/PluginJobId.js';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp.js';
import type { ActionInvocation as _oll_protocol_ActionInvocation, ActionInvocation__Output as _oll_protocol_ActionInvocation__Output } from '../../oll/protocol/ActionInvocation.js';

export interface StartJobRequest {
  'jobId'?: (_oll_protocol_PluginJobId | null);
  'deadline'?: (_google_protobuf_Timestamp | null);
  'action'?: (_oll_protocol_ActionInvocation | null);
  '_deadline'?: "deadline";
  'invocation'?: "action";
}

export interface StartJobRequest__Output {
  'jobId'?: (_oll_protocol_PluginJobId__Output);
  'deadline'?: (_google_protobuf_Timestamp__Output);
  'action'?: (_oll_protocol_ActionInvocation__Output);
  '_deadline'?: "deadline";
  'invocation'?: "action";
}
