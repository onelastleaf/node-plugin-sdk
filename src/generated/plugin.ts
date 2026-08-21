import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any.js';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration.js';
import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue.js';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct.js';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp.js';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value.js';
import type { ActionDescriptor as _oll_protocol_ActionDescriptor, ActionDescriptor__Output as _oll_protocol_ActionDescriptor__Output } from './oll/protocol/ActionDescriptor.js';
import type { ActionInvocation as _oll_protocol_ActionInvocation, ActionInvocation__Output as _oll_protocol_ActionInvocation__Output } from './oll/protocol/ActionInvocation.js';
import type { ApplyCrdtOperations as _oll_protocol_ApplyCrdtOperations, ApplyCrdtOperations__Output as _oll_protocol_ApplyCrdtOperations__Output } from './oll/protocol/ApplyCrdtOperations.js';
import type { ArtifactDescriptor as _oll_protocol_ArtifactDescriptor, ArtifactDescriptor__Output as _oll_protocol_ArtifactDescriptor__Output } from './oll/protocol/ArtifactDescriptor.js';
import type { ArtifactStored as _oll_protocol_ArtifactStored, ArtifactStored__Output as _oll_protocol_ArtifactStored__Output } from './oll/protocol/ArtifactStored.js';
import type { ArtifactTransferAccepted as _oll_protocol_ArtifactTransferAccepted, ArtifactTransferAccepted__Output as _oll_protocol_ArtifactTransferAccepted__Output } from './oll/protocol/ArtifactTransferAccepted.js';
import type { ArtifactTransferChunk as _oll_protocol_ArtifactTransferChunk, ArtifactTransferChunk__Output as _oll_protocol_ArtifactTransferChunk__Output } from './oll/protocol/ArtifactTransferChunk.js';
import type { ArtifactTransferComplete as _oll_protocol_ArtifactTransferComplete, ArtifactTransferComplete__Output as _oll_protocol_ArtifactTransferComplete__Output } from './oll/protocol/ArtifactTransferComplete.js';
import type { ArtifactTransferStart as _oll_protocol_ArtifactTransferStart, ArtifactTransferStart__Output as _oll_protocol_ArtifactTransferStart__Output } from './oll/protocol/ArtifactTransferStart.js';
import type { BinaryId as _oll_protocol_BinaryId, BinaryId__Output as _oll_protocol_BinaryId__Output } from './oll/protocol/BinaryId.js';
import type { CancelJobAcknowledged as _oll_protocol_CancelJobAcknowledged, CancelJobAcknowledged__Output as _oll_protocol_CancelJobAcknowledged__Output } from './oll/protocol/CancelJobAcknowledged.js';
import type { CancelJobRequest as _oll_protocol_CancelJobRequest, CancelJobRequest__Output as _oll_protocol_CancelJobRequest__Output } from './oll/protocol/CancelJobRequest.js';
import type { CatalogNodeId as _oll_protocol_CatalogNodeId, CatalogNodeId__Output as _oll_protocol_CatalogNodeId__Output } from './oll/protocol/CatalogNodeId.js';
import type { CatalogRevision as _oll_protocol_CatalogRevision, CatalogRevision__Output as _oll_protocol_CatalogRevision__Output } from './oll/protocol/CatalogRevision.js';
import type { CatalogRevisionConflict as _oll_protocol_CatalogRevisionConflict, CatalogRevisionConflict__Output as _oll_protocol_CatalogRevisionConflict__Output } from './oll/protocol/CatalogRevisionConflict.js';
import type { CatalogRevisionPrecondition as _oll_protocol_CatalogRevisionPrecondition, CatalogRevisionPrecondition__Output as _oll_protocol_CatalogRevisionPrecondition__Output } from './oll/protocol/CatalogRevisionPrecondition.js';
import type { CommitDocumentsRequest as _oll_protocol_CommitDocumentsRequest, CommitDocumentsRequest__Output as _oll_protocol_CommitDocumentsRequest__Output } from './oll/protocol/CommitDocumentsRequest.js';
import type { CommitDocumentsResponse as _oll_protocol_CommitDocumentsResponse, CommitDocumentsResponse__Output as _oll_protocol_CommitDocumentsResponse__Output } from './oll/protocol/CommitDocumentsResponse.js';
import type { CommitPrecondition as _oll_protocol_CommitPrecondition, CommitPrecondition__Output as _oll_protocol_CommitPrecondition__Output } from './oll/protocol/CommitPrecondition.js';
import type { ConfigFunctionRef as _oll_protocol_ConfigFunctionRef, ConfigFunctionRef__Output as _oll_protocol_ConfigFunctionRef__Output } from './oll/protocol/ConfigFunctionRef.js';
import type { ConfigList as _oll_protocol_ConfigList, ConfigList__Output as _oll_protocol_ConfigList__Output } from './oll/protocol/ConfigList.js';
import type { ConfigMap as _oll_protocol_ConfigMap, ConfigMap__Output as _oll_protocol_ConfigMap__Output } from './oll/protocol/ConfigMap.js';
import type { ConfigPath as _oll_protocol_ConfigPath, ConfigPath__Output as _oll_protocol_ConfigPath__Output } from './oll/protocol/ConfigPath.js';
import type { ConfigPathSegment as _oll_protocol_ConfigPathSegment, ConfigPathSegment__Output as _oll_protocol_ConfigPathSegment__Output } from './oll/protocol/ConfigPathSegment.js';
import type { ConfigValue as _oll_protocol_ConfigValue, ConfigValue__Output as _oll_protocol_ConfigValue__Output } from './oll/protocol/ConfigValue.js';
import type { CounterIncrement as _oll_protocol_CounterIncrement, CounterIncrement__Output as _oll_protocol_CounterIncrement__Output } from './oll/protocol/CounterIncrement.js';
import type { CrdtCounter as _oll_protocol_CrdtCounter, CrdtCounter__Output as _oll_protocol_CrdtCounter__Output } from './oll/protocol/CrdtCounter.js';
import type { CrdtList as _oll_protocol_CrdtList, CrdtList__Output as _oll_protocol_CrdtList__Output } from './oll/protocol/CrdtList.js';
import type { CrdtMap as _oll_protocol_CrdtMap, CrdtMap__Output as _oll_protocol_CrdtMap__Output } from './oll/protocol/CrdtMap.js';
import type { CrdtObjectPath as _oll_protocol_CrdtObjectPath, CrdtObjectPath__Output as _oll_protocol_CrdtObjectPath__Output } from './oll/protocol/CrdtObjectPath.js';
import type { CrdtOperation as _oll_protocol_CrdtOperation, CrdtOperation__Output as _oll_protocol_CrdtOperation__Output } from './oll/protocol/CrdtOperation.js';
import type { CrdtPathSegment as _oll_protocol_CrdtPathSegment, CrdtPathSegment__Output as _oll_protocol_CrdtPathSegment__Output } from './oll/protocol/CrdtPathSegment.js';
import type { CrdtScalar as _oll_protocol_CrdtScalar, CrdtScalar__Output as _oll_protocol_CrdtScalar__Output } from './oll/protocol/CrdtScalar.js';
import type { CrdtText as _oll_protocol_CrdtText, CrdtText__Output as _oll_protocol_CrdtText__Output } from './oll/protocol/CrdtText.js';
import type { CrdtTextMark as _oll_protocol_CrdtTextMark, CrdtTextMark__Output as _oll_protocol_CrdtTextMark__Output } from './oll/protocol/CrdtTextMark.js';
import type { CrdtTree as _oll_protocol_CrdtTree, CrdtTree__Output as _oll_protocol_CrdtTree__Output } from './oll/protocol/CrdtTree.js';
import type { CrdtTreeNode as _oll_protocol_CrdtTreeNode, CrdtTreeNode__Output as _oll_protocol_CrdtTreeNode__Output } from './oll/protocol/CrdtTreeNode.js';
import type { CrdtValue as _oll_protocol_CrdtValue, CrdtValue__Output as _oll_protocol_CrdtValue__Output } from './oll/protocol/CrdtValue.js';
import type { CreateDirectory as _oll_protocol_CreateDirectory, CreateDirectory__Output as _oll_protocol_CreateDirectory__Output } from './oll/protocol/CreateDirectory.js';
import type { CreateDocument as _oll_protocol_CreateDocument, CreateDocument__Output as _oll_protocol_CreateDocument__Output } from './oll/protocol/CreateDocument.js';
import type { DeleteNode as _oll_protocol_DeleteNode, DeleteNode__Output as _oll_protocol_DeleteNode__Output } from './oll/protocol/DeleteNode.js';
import type { DirectoryTreeNode as _oll_protocol_DirectoryTreeNode, DirectoryTreeNode__Output as _oll_protocol_DirectoryTreeNode__Output } from './oll/protocol/DirectoryTreeNode.js';
import type { DocumentId as _oll_protocol_DocumentId, DocumentId__Output as _oll_protocol_DocumentId__Output } from './oll/protocol/DocumentId.js';
import type { DocumentMutation as _oll_protocol_DocumentMutation, DocumentMutation__Output as _oll_protocol_DocumentMutation__Output } from './oll/protocol/DocumentMutation.js';
import type { DocumentPath as _oll_protocol_DocumentPath, DocumentPath__Output as _oll_protocol_DocumentPath__Output } from './oll/protocol/DocumentPath.js';
import type { DocumentRevision as _oll_protocol_DocumentRevision, DocumentRevision__Output as _oll_protocol_DocumentRevision__Output } from './oll/protocol/DocumentRevision.js';
import type { DocumentRevisionConflict as _oll_protocol_DocumentRevisionConflict, DocumentRevisionConflict__Output as _oll_protocol_DocumentRevisionConflict__Output } from './oll/protocol/DocumentRevisionConflict.js';
import type { DocumentRevisionPrecondition as _oll_protocol_DocumentRevisionPrecondition, DocumentRevisionPrecondition__Output as _oll_protocol_DocumentRevisionPrecondition__Output } from './oll/protocol/DocumentRevisionPrecondition.js';
import type { DocumentSnapshot as _oll_protocol_DocumentSnapshot, DocumentSnapshot__Output as _oll_protocol_DocumentSnapshot__Output } from './oll/protocol/DocumentSnapshot.js';
import type { GetConfigRequest as _oll_protocol_GetConfigRequest, GetConfigRequest__Output as _oll_protocol_GetConfigRequest__Output } from './oll/protocol/GetConfigRequest.js';
import type { GetConfigResponse as _oll_protocol_GetConfigResponse, GetConfigResponse__Output as _oll_protocol_GetConfigResponse__Output } from './oll/protocol/GetConfigResponse.js';
import type { GetDirectoryTreeRequest as _oll_protocol_GetDirectoryTreeRequest, GetDirectoryTreeRequest__Output as _oll_protocol_GetDirectoryTreeRequest__Output } from './oll/protocol/GetDirectoryTreeRequest.js';
import type { GetDirectoryTreeResponse as _oll_protocol_GetDirectoryTreeResponse, GetDirectoryTreeResponse__Output as _oll_protocol_GetDirectoryTreeResponse__Output } from './oll/protocol/GetDirectoryTreeResponse.js';
import type { Heartbeat as _oll_protocol_Heartbeat, Heartbeat__Output as _oll_protocol_Heartbeat__Output } from './oll/protocol/Heartbeat.js';
import type { HostCallRequest as _oll_protocol_HostCallRequest, HostCallRequest__Output as _oll_protocol_HostCallRequest__Output } from './oll/protocol/HostCallRequest.js';
import type { HostCallResponse as _oll_protocol_HostCallResponse, HostCallResponse__Output as _oll_protocol_HostCallResponse__Output } from './oll/protocol/HostCallResponse.js';
import type { HostHello as _oll_protocol_HostHello, HostHello__Output as _oll_protocol_HostHello__Output } from './oll/protocol/HostHello.js';
import type { InvokeConfigFunctionRequest as _oll_protocol_InvokeConfigFunctionRequest, InvokeConfigFunctionRequest__Output as _oll_protocol_InvokeConfigFunctionRequest__Output } from './oll/protocol/InvokeConfigFunctionRequest.js';
import type { InvokeConfigFunctionResponse as _oll_protocol_InvokeConfigFunctionResponse, InvokeConfigFunctionResponse__Output as _oll_protocol_InvokeConfigFunctionResponse__Output } from './oll/protocol/InvokeConfigFunctionResponse.js';
import type { JobAccepted as _oll_protocol_JobAccepted, JobAccepted__Output as _oll_protocol_JobAccepted__Output } from './oll/protocol/JobAccepted.js';
import type { JobUpdate as _oll_protocol_JobUpdate, JobUpdate__Output as _oll_protocol_JobUpdate__Output } from './oll/protocol/JobUpdate.js';
import type { ListDelete as _oll_protocol_ListDelete, ListDelete__Output as _oll_protocol_ListDelete__Output } from './oll/protocol/ListDelete.js';
import type { ListDirectoryRequest as _oll_protocol_ListDirectoryRequest, ListDirectoryRequest__Output as _oll_protocol_ListDirectoryRequest__Output } from './oll/protocol/ListDirectoryRequest.js';
import type { ListDirectoryResponse as _oll_protocol_ListDirectoryResponse, ListDirectoryResponse__Output as _oll_protocol_ListDirectoryResponse__Output } from './oll/protocol/ListDirectoryResponse.js';
import type { ListInsert as _oll_protocol_ListInsert, ListInsert__Output as _oll_protocol_ListInsert__Output } from './oll/protocol/ListInsert.js';
import type { ListMove as _oll_protocol_ListMove, ListMove__Output as _oll_protocol_ListMove__Output } from './oll/protocol/ListMove.js';
import type { LogRecord as _oll_protocol_LogRecord, LogRecord__Output as _oll_protocol_LogRecord__Output } from './oll/protocol/LogRecord.js';
import type { MapDelete as _oll_protocol_MapDelete, MapDelete__Output as _oll_protocol_MapDelete__Output } from './oll/protocol/MapDelete.js';
import type { MapSet as _oll_protocol_MapSet, MapSet__Output as _oll_protocol_MapSet__Output } from './oll/protocol/MapSet.js';
import type { MoveNode as _oll_protocol_MoveNode, MoveNode__Output as _oll_protocol_MoveNode__Output } from './oll/protocol/MoveNode.js';
import type { NodeId as _oll_protocol_NodeId, NodeId__Output as _oll_protocol_NodeId__Output } from './oll/protocol/NodeId.js';
import type { NodeIdentity as _oll_protocol_NodeIdentity, NodeIdentity__Output as _oll_protocol_NodeIdentity__Output } from './oll/protocol/NodeIdentity.js';
import type { NodeMetadata as _oll_protocol_NodeMetadata, NodeMetadata__Output as _oll_protocol_NodeMetadata__Output } from './oll/protocol/NodeMetadata.js';
import type { NodeName as _oll_protocol_NodeName, NodeName__Output as _oll_protocol_NodeName__Output } from './oll/protocol/NodeName.js';
import type { PluginArtifactId as _oll_protocol_PluginArtifactId, PluginArtifactId__Output as _oll_protocol_PluginArtifactId__Output } from './oll/protocol/PluginArtifactId.js';
import type { PluginEnvelope as _oll_protocol_PluginEnvelope, PluginEnvelope__Output as _oll_protocol_PluginEnvelope__Output } from './oll/protocol/PluginEnvelope.js';
import type { PluginHello as _oll_protocol_PluginHello, PluginHello__Output as _oll_protocol_PluginHello__Output } from './oll/protocol/PluginHello.js';
import type { PluginId as _oll_protocol_PluginId, PluginId__Output as _oll_protocol_PluginId__Output } from './oll/protocol/PluginId.js';
import type { PluginJobId as _oll_protocol_PluginJobId, PluginJobId__Output as _oll_protocol_PluginJobId__Output } from './oll/protocol/PluginJobId.js';
import type { PluginName as _oll_protocol_PluginName, PluginName__Output as _oll_protocol_PluginName__Output } from './oll/protocol/PluginName.js';
import type { PluginRuntimeClient as _oll_protocol_PluginRuntimeClient, PluginRuntimeDefinition as _oll_protocol_PluginRuntimeDefinition } from './oll/protocol/PluginRuntime.js';
import type { ProtocolError as _oll_protocol_ProtocolError, ProtocolError__Output as _oll_protocol_ProtocolError__Output } from './oll/protocol/ProtocolError.js';
import type { ReadCrdtRequest as _oll_protocol_ReadCrdtRequest, ReadCrdtRequest__Output as _oll_protocol_ReadCrdtRequest__Output } from './oll/protocol/ReadCrdtRequest.js';
import type { ReadCrdtResponse as _oll_protocol_ReadCrdtResponse, ReadCrdtResponse__Output as _oll_protocol_ReadCrdtResponse__Output } from './oll/protocol/ReadCrdtResponse.js';
import type { ReadDocumentRequest as _oll_protocol_ReadDocumentRequest, ReadDocumentRequest__Output as _oll_protocol_ReadDocumentRequest__Output } from './oll/protocol/ReadDocumentRequest.js';
import type { ReadDocumentResponse as _oll_protocol_ReadDocumentResponse, ReadDocumentResponse__Output as _oll_protocol_ReadDocumentResponse__Output } from './oll/protocol/ReadDocumentResponse.js';
import type { ReplaceDocument as _oll_protocol_ReplaceDocument, ReplaceDocument__Output as _oll_protocol_ReplaceDocument__Output } from './oll/protocol/ReplaceDocument.js';
import type { ReplicaId as _oll_protocol_ReplicaId, ReplicaId__Output as _oll_protocol_ReplicaId__Output } from './oll/protocol/ReplicaId.js';
import type { RevisionConflictDetail as _oll_protocol_RevisionConflictDetail, RevisionConflictDetail__Output as _oll_protocol_RevisionConflictDetail__Output } from './oll/protocol/RevisionConflictDetail.js';
import type { SessionReady as _oll_protocol_SessionReady, SessionReady__Output as _oll_protocol_SessionReady__Output } from './oll/protocol/SessionReady.js';
import type { ShutdownAcknowledged as _oll_protocol_ShutdownAcknowledged, ShutdownAcknowledged__Output as _oll_protocol_ShutdownAcknowledged__Output } from './oll/protocol/ShutdownAcknowledged.js';
import type { ShutdownRequest as _oll_protocol_ShutdownRequest, ShutdownRequest__Output as _oll_protocol_ShutdownRequest__Output } from './oll/protocol/ShutdownRequest.js';
import type { SpliceDocumentText as _oll_protocol_SpliceDocumentText, SpliceDocumentText__Output as _oll_protocol_SpliceDocumentText__Output } from './oll/protocol/SpliceDocumentText.js';
import type { StartJobRequest as _oll_protocol_StartJobRequest, StartJobRequest__Output as _oll_protocol_StartJobRequest__Output } from './oll/protocol/StartJobRequest.js';
import type { TextDelete as _oll_protocol_TextDelete, TextDelete__Output as _oll_protocol_TextDelete__Output } from './oll/protocol/TextDelete.js';
import type { TextInsert as _oll_protocol_TextInsert, TextInsert__Output as _oll_protocol_TextInsert__Output } from './oll/protocol/TextInsert.js';
import type { TextMark as _oll_protocol_TextMark, TextMark__Output as _oll_protocol_TextMark__Output } from './oll/protocol/TextMark.js';
import type { TextUnmark as _oll_protocol_TextUnmark, TextUnmark__Output as _oll_protocol_TextUnmark__Output } from './oll/protocol/TextUnmark.js';
import type { TraceContext as _oll_protocol_TraceContext, TraceContext__Output as _oll_protocol_TraceContext__Output } from './oll/protocol/TraceContext.js';
import type { TreeCreateNode as _oll_protocol_TreeCreateNode, TreeCreateNode__Output as _oll_protocol_TreeCreateNode__Output } from './oll/protocol/TreeCreateNode.js';
import type { TreeDeleteNode as _oll_protocol_TreeDeleteNode, TreeDeleteNode__Output as _oll_protocol_TreeDeleteNode__Output } from './oll/protocol/TreeDeleteNode.js';
import type { TreeMoveNode as _oll_protocol_TreeMoveNode, TreeMoveNode__Output as _oll_protocol_TreeMoveNode__Output } from './oll/protocol/TreeMoveNode.js';
import type { TreeSetMetadata as _oll_protocol_TreeSetMetadata, TreeSetMetadata__Output as _oll_protocol_TreeSetMetadata__Output } from './oll/protocol/TreeSetMetadata.js';
import type { UpdatedNode as _oll_protocol_UpdatedNode, UpdatedNode__Output as _oll_protocol_UpdatedNode__Output } from './oll/protocol/UpdatedNode.js';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Any: MessageTypeDefinition<_google_protobuf_Any, _google_protobuf_Any__Output>
      Duration: MessageTypeDefinition<_google_protobuf_Duration, _google_protobuf_Duration__Output>
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
  oll: {
    protocol: {
      ActionDescriptor: MessageTypeDefinition<_oll_protocol_ActionDescriptor, _oll_protocol_ActionDescriptor__Output>
      ActionInvocation: MessageTypeDefinition<_oll_protocol_ActionInvocation, _oll_protocol_ActionInvocation__Output>
      ApplyCrdtOperations: MessageTypeDefinition<_oll_protocol_ApplyCrdtOperations, _oll_protocol_ApplyCrdtOperations__Output>
      ArtifactDescriptor: MessageTypeDefinition<_oll_protocol_ArtifactDescriptor, _oll_protocol_ArtifactDescriptor__Output>
      ArtifactStored: MessageTypeDefinition<_oll_protocol_ArtifactStored, _oll_protocol_ArtifactStored__Output>
      ArtifactTransferAccepted: MessageTypeDefinition<_oll_protocol_ArtifactTransferAccepted, _oll_protocol_ArtifactTransferAccepted__Output>
      ArtifactTransferChunk: MessageTypeDefinition<_oll_protocol_ArtifactTransferChunk, _oll_protocol_ArtifactTransferChunk__Output>
      ArtifactTransferComplete: MessageTypeDefinition<_oll_protocol_ArtifactTransferComplete, _oll_protocol_ArtifactTransferComplete__Output>
      ArtifactTransferStart: MessageTypeDefinition<_oll_protocol_ArtifactTransferStart, _oll_protocol_ArtifactTransferStart__Output>
      BinaryId: MessageTypeDefinition<_oll_protocol_BinaryId, _oll_protocol_BinaryId__Output>
      CancelJobAcknowledged: MessageTypeDefinition<_oll_protocol_CancelJobAcknowledged, _oll_protocol_CancelJobAcknowledged__Output>
      CancelJobRequest: MessageTypeDefinition<_oll_protocol_CancelJobRequest, _oll_protocol_CancelJobRequest__Output>
      CatalogNodeId: MessageTypeDefinition<_oll_protocol_CatalogNodeId, _oll_protocol_CatalogNodeId__Output>
      CatalogRevision: MessageTypeDefinition<_oll_protocol_CatalogRevision, _oll_protocol_CatalogRevision__Output>
      CatalogRevisionConflict: MessageTypeDefinition<_oll_protocol_CatalogRevisionConflict, _oll_protocol_CatalogRevisionConflict__Output>
      CatalogRevisionPrecondition: MessageTypeDefinition<_oll_protocol_CatalogRevisionPrecondition, _oll_protocol_CatalogRevisionPrecondition__Output>
      CommitDocumentsRequest: MessageTypeDefinition<_oll_protocol_CommitDocumentsRequest, _oll_protocol_CommitDocumentsRequest__Output>
      CommitDocumentsResponse: MessageTypeDefinition<_oll_protocol_CommitDocumentsResponse, _oll_protocol_CommitDocumentsResponse__Output>
      CommitPrecondition: MessageTypeDefinition<_oll_protocol_CommitPrecondition, _oll_protocol_CommitPrecondition__Output>
      ConfigFunctionRef: MessageTypeDefinition<_oll_protocol_ConfigFunctionRef, _oll_protocol_ConfigFunctionRef__Output>
      ConfigList: MessageTypeDefinition<_oll_protocol_ConfigList, _oll_protocol_ConfigList__Output>
      ConfigMap: MessageTypeDefinition<_oll_protocol_ConfigMap, _oll_protocol_ConfigMap__Output>
      ConfigPath: MessageTypeDefinition<_oll_protocol_ConfigPath, _oll_protocol_ConfigPath__Output>
      ConfigPathSegment: MessageTypeDefinition<_oll_protocol_ConfigPathSegment, _oll_protocol_ConfigPathSegment__Output>
      ConfigValue: MessageTypeDefinition<_oll_protocol_ConfigValue, _oll_protocol_ConfigValue__Output>
      CounterIncrement: MessageTypeDefinition<_oll_protocol_CounterIncrement, _oll_protocol_CounterIncrement__Output>
      CrdtCounter: MessageTypeDefinition<_oll_protocol_CrdtCounter, _oll_protocol_CrdtCounter__Output>
      CrdtList: MessageTypeDefinition<_oll_protocol_CrdtList, _oll_protocol_CrdtList__Output>
      CrdtMap: MessageTypeDefinition<_oll_protocol_CrdtMap, _oll_protocol_CrdtMap__Output>
      CrdtObjectPath: MessageTypeDefinition<_oll_protocol_CrdtObjectPath, _oll_protocol_CrdtObjectPath__Output>
      CrdtOperation: MessageTypeDefinition<_oll_protocol_CrdtOperation, _oll_protocol_CrdtOperation__Output>
      CrdtPathSegment: MessageTypeDefinition<_oll_protocol_CrdtPathSegment, _oll_protocol_CrdtPathSegment__Output>
      CrdtScalar: MessageTypeDefinition<_oll_protocol_CrdtScalar, _oll_protocol_CrdtScalar__Output>
      CrdtText: MessageTypeDefinition<_oll_protocol_CrdtText, _oll_protocol_CrdtText__Output>
      CrdtTextMark: MessageTypeDefinition<_oll_protocol_CrdtTextMark, _oll_protocol_CrdtTextMark__Output>
      CrdtTree: MessageTypeDefinition<_oll_protocol_CrdtTree, _oll_protocol_CrdtTree__Output>
      CrdtTreeNode: MessageTypeDefinition<_oll_protocol_CrdtTreeNode, _oll_protocol_CrdtTreeNode__Output>
      CrdtValue: MessageTypeDefinition<_oll_protocol_CrdtValue, _oll_protocol_CrdtValue__Output>
      CreateDirectory: MessageTypeDefinition<_oll_protocol_CreateDirectory, _oll_protocol_CreateDirectory__Output>
      CreateDocument: MessageTypeDefinition<_oll_protocol_CreateDocument, _oll_protocol_CreateDocument__Output>
      DeleteNode: MessageTypeDefinition<_oll_protocol_DeleteNode, _oll_protocol_DeleteNode__Output>
      DirectoryTreeNode: MessageTypeDefinition<_oll_protocol_DirectoryTreeNode, _oll_protocol_DirectoryTreeNode__Output>
      DocumentId: MessageTypeDefinition<_oll_protocol_DocumentId, _oll_protocol_DocumentId__Output>
      DocumentMutation: MessageTypeDefinition<_oll_protocol_DocumentMutation, _oll_protocol_DocumentMutation__Output>
      DocumentPath: MessageTypeDefinition<_oll_protocol_DocumentPath, _oll_protocol_DocumentPath__Output>
      DocumentProjection: EnumTypeDefinition
      DocumentRevision: MessageTypeDefinition<_oll_protocol_DocumentRevision, _oll_protocol_DocumentRevision__Output>
      DocumentRevisionConflict: MessageTypeDefinition<_oll_protocol_DocumentRevisionConflict, _oll_protocol_DocumentRevisionConflict__Output>
      DocumentRevisionPrecondition: MessageTypeDefinition<_oll_protocol_DocumentRevisionPrecondition, _oll_protocol_DocumentRevisionPrecondition__Output>
      DocumentSnapshot: MessageTypeDefinition<_oll_protocol_DocumentSnapshot, _oll_protocol_DocumentSnapshot__Output>
      ErrorCode: EnumTypeDefinition
      GetConfigRequest: MessageTypeDefinition<_oll_protocol_GetConfigRequest, _oll_protocol_GetConfigRequest__Output>
      GetConfigResponse: MessageTypeDefinition<_oll_protocol_GetConfigResponse, _oll_protocol_GetConfigResponse__Output>
      GetDirectoryTreeRequest: MessageTypeDefinition<_oll_protocol_GetDirectoryTreeRequest, _oll_protocol_GetDirectoryTreeRequest__Output>
      GetDirectoryTreeResponse: MessageTypeDefinition<_oll_protocol_GetDirectoryTreeResponse, _oll_protocol_GetDirectoryTreeResponse__Output>
      Heartbeat: MessageTypeDefinition<_oll_protocol_Heartbeat, _oll_protocol_Heartbeat__Output>
      HostCallRequest: MessageTypeDefinition<_oll_protocol_HostCallRequest, _oll_protocol_HostCallRequest__Output>
      HostCallResponse: MessageTypeDefinition<_oll_protocol_HostCallResponse, _oll_protocol_HostCallResponse__Output>
      HostHello: MessageTypeDefinition<_oll_protocol_HostHello, _oll_protocol_HostHello__Output>
      InvokeConfigFunctionRequest: MessageTypeDefinition<_oll_protocol_InvokeConfigFunctionRequest, _oll_protocol_InvokeConfigFunctionRequest__Output>
      InvokeConfigFunctionResponse: MessageTypeDefinition<_oll_protocol_InvokeConfigFunctionResponse, _oll_protocol_InvokeConfigFunctionResponse__Output>
      JobAccepted: MessageTypeDefinition<_oll_protocol_JobAccepted, _oll_protocol_JobAccepted__Output>
      JobCancellationReason: EnumTypeDefinition
      JobState: EnumTypeDefinition
      JobUpdate: MessageTypeDefinition<_oll_protocol_JobUpdate, _oll_protocol_JobUpdate__Output>
      ListDelete: MessageTypeDefinition<_oll_protocol_ListDelete, _oll_protocol_ListDelete__Output>
      ListDirectoryRequest: MessageTypeDefinition<_oll_protocol_ListDirectoryRequest, _oll_protocol_ListDirectoryRequest__Output>
      ListDirectoryResponse: MessageTypeDefinition<_oll_protocol_ListDirectoryResponse, _oll_protocol_ListDirectoryResponse__Output>
      ListInsert: MessageTypeDefinition<_oll_protocol_ListInsert, _oll_protocol_ListInsert__Output>
      ListMove: MessageTypeDefinition<_oll_protocol_ListMove, _oll_protocol_ListMove__Output>
      LogLevel: EnumTypeDefinition
      LogRecord: MessageTypeDefinition<_oll_protocol_LogRecord, _oll_protocol_LogRecord__Output>
      MapDelete: MessageTypeDefinition<_oll_protocol_MapDelete, _oll_protocol_MapDelete__Output>
      MapSet: MessageTypeDefinition<_oll_protocol_MapSet, _oll_protocol_MapSet__Output>
      MoveNode: MessageTypeDefinition<_oll_protocol_MoveNode, _oll_protocol_MoveNode__Output>
      NodeId: MessageTypeDefinition<_oll_protocol_NodeId, _oll_protocol_NodeId__Output>
      NodeIdentity: MessageTypeDefinition<_oll_protocol_NodeIdentity, _oll_protocol_NodeIdentity__Output>
      NodeKind: EnumTypeDefinition
      NodeMetadata: MessageTypeDefinition<_oll_protocol_NodeMetadata, _oll_protocol_NodeMetadata__Output>
      NodeName: MessageTypeDefinition<_oll_protocol_NodeName, _oll_protocol_NodeName__Output>
      PluginArtifactId: MessageTypeDefinition<_oll_protocol_PluginArtifactId, _oll_protocol_PluginArtifactId__Output>
      PluginEnvelope: MessageTypeDefinition<_oll_protocol_PluginEnvelope, _oll_protocol_PluginEnvelope__Output>
      PluginHello: MessageTypeDefinition<_oll_protocol_PluginHello, _oll_protocol_PluginHello__Output>
      PluginId: MessageTypeDefinition<_oll_protocol_PluginId, _oll_protocol_PluginId__Output>
      PluginJobId: MessageTypeDefinition<_oll_protocol_PluginJobId, _oll_protocol_PluginJobId__Output>
      PluginName: MessageTypeDefinition<_oll_protocol_PluginName, _oll_protocol_PluginName__Output>
      /**
       * oll hosts this service on an instance-owned loopback listener. The spawned
       * plugin receives OLL_PLUGIN_ENDPOINT, connects as the gRPC client, and all
       * calls in either direction share this one stream.
       */
      PluginRuntime: SubtypeConstructor<typeof grpc.Client, _oll_protocol_PluginRuntimeClient> & { service: _oll_protocol_PluginRuntimeDefinition }
      ProtocolError: MessageTypeDefinition<_oll_protocol_ProtocolError, _oll_protocol_ProtocolError__Output>
      ReadCrdtRequest: MessageTypeDefinition<_oll_protocol_ReadCrdtRequest, _oll_protocol_ReadCrdtRequest__Output>
      ReadCrdtResponse: MessageTypeDefinition<_oll_protocol_ReadCrdtResponse, _oll_protocol_ReadCrdtResponse__Output>
      ReadDocumentRequest: MessageTypeDefinition<_oll_protocol_ReadDocumentRequest, _oll_protocol_ReadDocumentRequest__Output>
      ReadDocumentResponse: MessageTypeDefinition<_oll_protocol_ReadDocumentResponse, _oll_protocol_ReadDocumentResponse__Output>
      ReplaceDocument: MessageTypeDefinition<_oll_protocol_ReplaceDocument, _oll_protocol_ReplaceDocument__Output>
      ReplicaId: MessageTypeDefinition<_oll_protocol_ReplicaId, _oll_protocol_ReplicaId__Output>
      RevisionConflictDetail: MessageTypeDefinition<_oll_protocol_RevisionConflictDetail, _oll_protocol_RevisionConflictDetail__Output>
      SessionReady: MessageTypeDefinition<_oll_protocol_SessionReady, _oll_protocol_SessionReady__Output>
      ShutdownAcknowledged: MessageTypeDefinition<_oll_protocol_ShutdownAcknowledged, _oll_protocol_ShutdownAcknowledged__Output>
      ShutdownRequest: MessageTypeDefinition<_oll_protocol_ShutdownRequest, _oll_protocol_ShutdownRequest__Output>
      SpliceDocumentText: MessageTypeDefinition<_oll_protocol_SpliceDocumentText, _oll_protocol_SpliceDocumentText__Output>
      StartJobRequest: MessageTypeDefinition<_oll_protocol_StartJobRequest, _oll_protocol_StartJobRequest__Output>
      TextDelete: MessageTypeDefinition<_oll_protocol_TextDelete, _oll_protocol_TextDelete__Output>
      TextInsert: MessageTypeDefinition<_oll_protocol_TextInsert, _oll_protocol_TextInsert__Output>
      TextMark: MessageTypeDefinition<_oll_protocol_TextMark, _oll_protocol_TextMark__Output>
      TextUnmark: MessageTypeDefinition<_oll_protocol_TextUnmark, _oll_protocol_TextUnmark__Output>
      TraceContext: MessageTypeDefinition<_oll_protocol_TraceContext, _oll_protocol_TraceContext__Output>
      TreeCreateNode: MessageTypeDefinition<_oll_protocol_TreeCreateNode, _oll_protocol_TreeCreateNode__Output>
      TreeDeleteNode: MessageTypeDefinition<_oll_protocol_TreeDeleteNode, _oll_protocol_TreeDeleteNode__Output>
      TreeMoveNode: MessageTypeDefinition<_oll_protocol_TreeMoveNode, _oll_protocol_TreeMoveNode__Output>
      TreeSetMetadata: MessageTypeDefinition<_oll_protocol_TreeSetMetadata, _oll_protocol_TreeSetMetadata__Output>
      UpdatedNode: MessageTypeDefinition<_oll_protocol_UpdatedNode, _oll_protocol_UpdatedNode__Output>
    }
  }
}

