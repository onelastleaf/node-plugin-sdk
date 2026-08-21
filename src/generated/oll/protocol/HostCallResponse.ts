// Original file: proto/oll/plugin.proto

import type { ReadDocumentResponse as _oll_protocol_ReadDocumentResponse, ReadDocumentResponse__Output as _oll_protocol_ReadDocumentResponse__Output } from '../../oll/protocol/ReadDocumentResponse.js';
import type { ListDirectoryResponse as _oll_protocol_ListDirectoryResponse, ListDirectoryResponse__Output as _oll_protocol_ListDirectoryResponse__Output } from '../../oll/protocol/ListDirectoryResponse.js';
import type { GetDirectoryTreeResponse as _oll_protocol_GetDirectoryTreeResponse, GetDirectoryTreeResponse__Output as _oll_protocol_GetDirectoryTreeResponse__Output } from '../../oll/protocol/GetDirectoryTreeResponse.js';
import type { ReadCrdtResponse as _oll_protocol_ReadCrdtResponse, ReadCrdtResponse__Output as _oll_protocol_ReadCrdtResponse__Output } from '../../oll/protocol/ReadCrdtResponse.js';
import type { CommitDocumentsResponse as _oll_protocol_CommitDocumentsResponse, CommitDocumentsResponse__Output as _oll_protocol_CommitDocumentsResponse__Output } from '../../oll/protocol/CommitDocumentsResponse.js';
import type { GetConfigResponse as _oll_protocol_GetConfigResponse, GetConfigResponse__Output as _oll_protocol_GetConfigResponse__Output } from '../../oll/protocol/GetConfigResponse.js';
import type { InvokeConfigFunctionResponse as _oll_protocol_InvokeConfigFunctionResponse, InvokeConfigFunctionResponse__Output as _oll_protocol_InvokeConfigFunctionResponse__Output } from '../../oll/protocol/InvokeConfigFunctionResponse.js';
import type { ProtocolError as _oll_protocol_ProtocolError, ProtocolError__Output as _oll_protocol_ProtocolError__Output } from '../../oll/protocol/ProtocolError.js';

export interface HostCallResponse {
  'readDocument'?: (_oll_protocol_ReadDocumentResponse | null);
  'listDirectory'?: (_oll_protocol_ListDirectoryResponse | null);
  'getDirectoryTree'?: (_oll_protocol_GetDirectoryTreeResponse | null);
  'readCrdt'?: (_oll_protocol_ReadCrdtResponse | null);
  'commitDocuments'?: (_oll_protocol_CommitDocumentsResponse | null);
  'getConfig'?: (_oll_protocol_GetConfigResponse | null);
  'invokeConfigFunction'?: (_oll_protocol_InvokeConfigFunctionResponse | null);
  'error'?: (_oll_protocol_ProtocolError | null);
  'result'?: "readDocument"|"listDirectory"|"getDirectoryTree"|"readCrdt"|"commitDocuments"|"getConfig"|"invokeConfigFunction"|"error";
}

export interface HostCallResponse__Output {
  'readDocument'?: (_oll_protocol_ReadDocumentResponse__Output);
  'listDirectory'?: (_oll_protocol_ListDirectoryResponse__Output);
  'getDirectoryTree'?: (_oll_protocol_GetDirectoryTreeResponse__Output);
  'readCrdt'?: (_oll_protocol_ReadCrdtResponse__Output);
  'commitDocuments'?: (_oll_protocol_CommitDocumentsResponse__Output);
  'getConfig'?: (_oll_protocol_GetConfigResponse__Output);
  'invokeConfigFunction'?: (_oll_protocol_InvokeConfigFunctionResponse__Output);
  'error'?: (_oll_protocol_ProtocolError__Output);
  'result'?: "readDocument"|"listDirectory"|"getDirectoryTree"|"readCrdt"|"commitDocuments"|"getConfig"|"invokeConfigFunction"|"error";
}
