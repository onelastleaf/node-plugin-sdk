// Original file: proto/oll/plugin.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { PluginEnvelope as _oll_protocol_PluginEnvelope, PluginEnvelope__Output as _oll_protocol_PluginEnvelope__Output } from '../../oll/protocol/PluginEnvelope.js';

/**
 * oll hosts this service on an instance-owned loopback listener. The spawned
 * plugin receives OLL_PLUGIN_ENDPOINT, connects as the gRPC client, and all
 * calls in either direction share this one stream.
 */
export interface PluginRuntimeClient extends grpc.Client {
  Connect(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output>;
  Connect(options?: grpc.CallOptions): grpc.ClientDuplexStream<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output>;
  connect(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output>;
  connect(options?: grpc.CallOptions): grpc.ClientDuplexStream<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output>;
  
}

/**
 * oll hosts this service on an instance-owned loopback listener. The spawned
 * plugin receives OLL_PLUGIN_ENDPOINT, connects as the gRPC client, and all
 * calls in either direction share this one stream.
 */
export interface PluginRuntimeHandlers extends grpc.UntypedServiceImplementation {
  Connect: grpc.handleBidiStreamingCall<_oll_protocol_PluginEnvelope__Output, _oll_protocol_PluginEnvelope>;
  
}

export interface PluginRuntimeDefinition extends grpc.ServiceDefinition {
  Connect: MethodDefinition<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output, _oll_protocol_PluginEnvelope__Output>
}
