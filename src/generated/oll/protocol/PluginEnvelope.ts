// Original file: proto/oll/plugin.proto

import type { TraceContext as _oll_protocol_TraceContext, TraceContext__Output as _oll_protocol_TraceContext__Output } from '../../oll/protocol/TraceContext.js';
import type { HostHello as _oll_protocol_HostHello, HostHello__Output as _oll_protocol_HostHello__Output } from '../../oll/protocol/HostHello.js';
import type { PluginHello as _oll_protocol_PluginHello, PluginHello__Output as _oll_protocol_PluginHello__Output } from '../../oll/protocol/PluginHello.js';
import type { SessionReady as _oll_protocol_SessionReady, SessionReady__Output as _oll_protocol_SessionReady__Output } from '../../oll/protocol/SessionReady.js';
import type { StartJobRequest as _oll_protocol_StartJobRequest, StartJobRequest__Output as _oll_protocol_StartJobRequest__Output } from '../../oll/protocol/StartJobRequest.js';
import type { JobAccepted as _oll_protocol_JobAccepted, JobAccepted__Output as _oll_protocol_JobAccepted__Output } from '../../oll/protocol/JobAccepted.js';
import type { JobUpdate as _oll_protocol_JobUpdate, JobUpdate__Output as _oll_protocol_JobUpdate__Output } from '../../oll/protocol/JobUpdate.js';
import type { HostCallRequest as _oll_protocol_HostCallRequest, HostCallRequest__Output as _oll_protocol_HostCallRequest__Output } from '../../oll/protocol/HostCallRequest.js';
import type { HostCallResponse as _oll_protocol_HostCallResponse, HostCallResponse__Output as _oll_protocol_HostCallResponse__Output } from '../../oll/protocol/HostCallResponse.js';
import type { LogRecord as _oll_protocol_LogRecord, LogRecord__Output as _oll_protocol_LogRecord__Output } from '../../oll/protocol/LogRecord.js';
import type { Heartbeat as _oll_protocol_Heartbeat, Heartbeat__Output as _oll_protocol_Heartbeat__Output } from '../../oll/protocol/Heartbeat.js';
import type { ShutdownRequest as _oll_protocol_ShutdownRequest, ShutdownRequest__Output as _oll_protocol_ShutdownRequest__Output } from '../../oll/protocol/ShutdownRequest.js';
import type { ShutdownAcknowledged as _oll_protocol_ShutdownAcknowledged, ShutdownAcknowledged__Output as _oll_protocol_ShutdownAcknowledged__Output } from '../../oll/protocol/ShutdownAcknowledged.js';
import type { ProtocolError as _oll_protocol_ProtocolError, ProtocolError__Output as _oll_protocol_ProtocolError__Output } from '../../oll/protocol/ProtocolError.js';
import type { ArtifactTransferStart as _oll_protocol_ArtifactTransferStart, ArtifactTransferStart__Output as _oll_protocol_ArtifactTransferStart__Output } from '../../oll/protocol/ArtifactTransferStart.js';
import type { ArtifactTransferAccepted as _oll_protocol_ArtifactTransferAccepted, ArtifactTransferAccepted__Output as _oll_protocol_ArtifactTransferAccepted__Output } from '../../oll/protocol/ArtifactTransferAccepted.js';
import type { ArtifactTransferChunk as _oll_protocol_ArtifactTransferChunk, ArtifactTransferChunk__Output as _oll_protocol_ArtifactTransferChunk__Output } from '../../oll/protocol/ArtifactTransferChunk.js';
import type { ArtifactTransferComplete as _oll_protocol_ArtifactTransferComplete, ArtifactTransferComplete__Output as _oll_protocol_ArtifactTransferComplete__Output } from '../../oll/protocol/ArtifactTransferComplete.js';
import type { ArtifactStored as _oll_protocol_ArtifactStored, ArtifactStored__Output as _oll_protocol_ArtifactStored__Output } from '../../oll/protocol/ArtifactStored.js';
import type { CancelJobRequest as _oll_protocol_CancelJobRequest, CancelJobRequest__Output as _oll_protocol_CancelJobRequest__Output } from '../../oll/protocol/CancelJobRequest.js';
import type { CancelJobAcknowledged as _oll_protocol_CancelJobAcknowledged, CancelJobAcknowledged__Output as _oll_protocol_CancelJobAcknowledged__Output } from '../../oll/protocol/CancelJobAcknowledged.js';
import type { Long } from '@grpc/proto-loader';

/**
 * Each sender owns an independent sequence. IDs are nonzero and strictly
 * increase relative to that sender's preceding envelope; gaps are valid.
 * Direct responses set reply_to. New nested calls set parent_call_id and
 * increment call_depth.
 */
export interface PluginEnvelope {
  'messageId'?: (number | string | Long);
  'replyTo'?: (number | string | Long);
  'sessionId'?: (string);
  'pluginInstanceId'?: (string);
  'trace'?: (_oll_protocol_TraceContext | null);
  'hostHello'?: (_oll_protocol_HostHello | null);
  'pluginHello'?: (_oll_protocol_PluginHello | null);
  'ready'?: (_oll_protocol_SessionReady | null);
  'startJob'?: (_oll_protocol_StartJobRequest | null);
  'jobAccepted'?: (_oll_protocol_JobAccepted | null);
  'jobUpdate'?: (_oll_protocol_JobUpdate | null);
  'hostCall'?: (_oll_protocol_HostCallRequest | null);
  'hostResult'?: (_oll_protocol_HostCallResponse | null);
  'log'?: (_oll_protocol_LogRecord | null);
  'heartbeat'?: (_oll_protocol_Heartbeat | null);
  'shutdown'?: (_oll_protocol_ShutdownRequest | null);
  'shutdownAcknowledged'?: (_oll_protocol_ShutdownAcknowledged | null);
  'protocolError'?: (_oll_protocol_ProtocolError | null);
  'artifactStart'?: (_oll_protocol_ArtifactTransferStart | null);
  'artifactAccepted'?: (_oll_protocol_ArtifactTransferAccepted | null);
  'artifactChunk'?: (_oll_protocol_ArtifactTransferChunk | null);
  'artifactComplete'?: (_oll_protocol_ArtifactTransferComplete | null);
  'artifactStored'?: (_oll_protocol_ArtifactStored | null);
  'cancelJob'?: (_oll_protocol_CancelJobRequest | null);
  'cancelJobAcknowledged'?: (_oll_protocol_CancelJobAcknowledged | null);
  '_replyTo'?: "replyTo";
  'payload'?: "hostHello"|"pluginHello"|"ready"|"startJob"|"jobAccepted"|"jobUpdate"|"hostCall"|"hostResult"|"log"|"heartbeat"|"shutdown"|"shutdownAcknowledged"|"protocolError"|"artifactStart"|"artifactAccepted"|"artifactChunk"|"artifactComplete"|"artifactStored"|"cancelJob"|"cancelJobAcknowledged";
}

/**
 * Each sender owns an independent sequence. IDs are nonzero and strictly
 * increase relative to that sender's preceding envelope; gaps are valid.
 * Direct responses set reply_to. New nested calls set parent_call_id and
 * increment call_depth.
 */
export interface PluginEnvelope__Output {
  'messageId'?: (string);
  'replyTo'?: (string);
  'sessionId'?: (string);
  'pluginInstanceId'?: (string);
  'trace'?: (_oll_protocol_TraceContext__Output);
  'hostHello'?: (_oll_protocol_HostHello__Output);
  'pluginHello'?: (_oll_protocol_PluginHello__Output);
  'ready'?: (_oll_protocol_SessionReady__Output);
  'startJob'?: (_oll_protocol_StartJobRequest__Output);
  'jobAccepted'?: (_oll_protocol_JobAccepted__Output);
  'jobUpdate'?: (_oll_protocol_JobUpdate__Output);
  'hostCall'?: (_oll_protocol_HostCallRequest__Output);
  'hostResult'?: (_oll_protocol_HostCallResponse__Output);
  'log'?: (_oll_protocol_LogRecord__Output);
  'heartbeat'?: (_oll_protocol_Heartbeat__Output);
  'shutdown'?: (_oll_protocol_ShutdownRequest__Output);
  'shutdownAcknowledged'?: (_oll_protocol_ShutdownAcknowledged__Output);
  'protocolError'?: (_oll_protocol_ProtocolError__Output);
  'artifactStart'?: (_oll_protocol_ArtifactTransferStart__Output);
  'artifactAccepted'?: (_oll_protocol_ArtifactTransferAccepted__Output);
  'artifactChunk'?: (_oll_protocol_ArtifactTransferChunk__Output);
  'artifactComplete'?: (_oll_protocol_ArtifactTransferComplete__Output);
  'artifactStored'?: (_oll_protocol_ArtifactStored__Output);
  'cancelJob'?: (_oll_protocol_CancelJobRequest__Output);
  'cancelJobAcknowledged'?: (_oll_protocol_CancelJobAcknowledged__Output);
  '_replyTo'?: "replyTo";
  'payload'?: "hostHello"|"pluginHello"|"ready"|"startJob"|"jobAccepted"|"jobUpdate"|"hostCall"|"hostResult"|"log"|"heartbeat"|"shutdown"|"shutdownAcknowledged"|"protocolError"|"artifactStart"|"artifactAccepted"|"artifactChunk"|"artifactComplete"|"artifactStored"|"cancelJob"|"cancelJobAcknowledged";
}
