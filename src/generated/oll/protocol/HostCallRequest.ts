// Original file: proto/oll/plugin.proto

import type { ReadDocumentRequest as _oll_protocol_ReadDocumentRequest, ReadDocumentRequest__Output as _oll_protocol_ReadDocumentRequest__Output } from '../../oll/protocol/ReadDocumentRequest.js';
import type { ListDirectoryRequest as _oll_protocol_ListDirectoryRequest, ListDirectoryRequest__Output as _oll_protocol_ListDirectoryRequest__Output } from '../../oll/protocol/ListDirectoryRequest.js';
import type { GetDirectoryTreeRequest as _oll_protocol_GetDirectoryTreeRequest, GetDirectoryTreeRequest__Output as _oll_protocol_GetDirectoryTreeRequest__Output } from '../../oll/protocol/GetDirectoryTreeRequest.js';
import type { ReadCrdtRequest as _oll_protocol_ReadCrdtRequest, ReadCrdtRequest__Output as _oll_protocol_ReadCrdtRequest__Output } from '../../oll/protocol/ReadCrdtRequest.js';
import type { CommitDocumentsRequest as _oll_protocol_CommitDocumentsRequest, CommitDocumentsRequest__Output as _oll_protocol_CommitDocumentsRequest__Output } from '../../oll/protocol/CommitDocumentsRequest.js';
import type { GetConfigRequest as _oll_protocol_GetConfigRequest, GetConfigRequest__Output as _oll_protocol_GetConfigRequest__Output } from '../../oll/protocol/GetConfigRequest.js';
import type { InvokeConfigFunctionRequest as _oll_protocol_InvokeConfigFunctionRequest, InvokeConfigFunctionRequest__Output as _oll_protocol_InvokeConfigFunctionRequest__Output } from '../../oll/protocol/InvokeConfigFunctionRequest.js';

export interface HostCallRequest {
  'readDocument'?: (_oll_protocol_ReadDocumentRequest | null);
  'listDirectory'?: (_oll_protocol_ListDirectoryRequest | null);
  'getDirectoryTree'?: (_oll_protocol_GetDirectoryTreeRequest | null);
  'readCrdt'?: (_oll_protocol_ReadCrdtRequest | null);
  'commitDocuments'?: (_oll_protocol_CommitDocumentsRequest | null);
  'getConfig'?: (_oll_protocol_GetConfigRequest | null);
  'invokeConfigFunction'?: (_oll_protocol_InvokeConfigFunctionRequest | null);
  'call'?: "readDocument"|"listDirectory"|"getDirectoryTree"|"readCrdt"|"commitDocuments"|"getConfig"|"invokeConfigFunction";
}

export interface HostCallRequest__Output {
  'readDocument'?: (_oll_protocol_ReadDocumentRequest__Output);
  'listDirectory'?: (_oll_protocol_ListDirectoryRequest__Output);
  'getDirectoryTree'?: (_oll_protocol_GetDirectoryTreeRequest__Output);
  'readCrdt'?: (_oll_protocol_ReadCrdtRequest__Output);
  'commitDocuments'?: (_oll_protocol_CommitDocumentsRequest__Output);
  'getConfig'?: (_oll_protocol_GetConfigRequest__Output);
  'invokeConfigFunction'?: (_oll_protocol_InvokeConfigFunctionRequest__Output);
  'call'?: "readDocument"|"listDirectory"|"getDirectoryTree"|"readCrdt"|"commitDocuments"|"getConfig"|"invokeConfigFunction";
}
