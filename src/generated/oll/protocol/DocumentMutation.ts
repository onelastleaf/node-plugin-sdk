// Original file: proto/oll/document.proto

import type { CreateDirectory as _oll_protocol_CreateDirectory, CreateDirectory__Output as _oll_protocol_CreateDirectory__Output } from '../../oll/protocol/CreateDirectory.js';
import type { CreateDocument as _oll_protocol_CreateDocument, CreateDocument__Output as _oll_protocol_CreateDocument__Output } from '../../oll/protocol/CreateDocument.js';
import type { ReplaceDocument as _oll_protocol_ReplaceDocument, ReplaceDocument__Output as _oll_protocol_ReplaceDocument__Output } from '../../oll/protocol/ReplaceDocument.js';
import type { SpliceDocumentText as _oll_protocol_SpliceDocumentText, SpliceDocumentText__Output as _oll_protocol_SpliceDocumentText__Output } from '../../oll/protocol/SpliceDocumentText.js';
import type { DeleteNode as _oll_protocol_DeleteNode, DeleteNode__Output as _oll_protocol_DeleteNode__Output } from '../../oll/protocol/DeleteNode.js';
import type { MoveNode as _oll_protocol_MoveNode, MoveNode__Output as _oll_protocol_MoveNode__Output } from '../../oll/protocol/MoveNode.js';
import type { ApplyCrdtOperations as _oll_protocol_ApplyCrdtOperations, ApplyCrdtOperations__Output as _oll_protocol_ApplyCrdtOperations__Output } from '../../oll/protocol/ApplyCrdtOperations.js';

export interface DocumentMutation {
  'createDirectory'?: (_oll_protocol_CreateDirectory | null);
  'createDocument'?: (_oll_protocol_CreateDocument | null);
  'replaceDocument'?: (_oll_protocol_ReplaceDocument | null);
  'spliceDocumentText'?: (_oll_protocol_SpliceDocumentText | null);
  'deleteNode'?: (_oll_protocol_DeleteNode | null);
  'moveNode'?: (_oll_protocol_MoveNode | null);
  'applyCrdtOperations'?: (_oll_protocol_ApplyCrdtOperations | null);
  'mutation'?: "createDirectory"|"createDocument"|"replaceDocument"|"spliceDocumentText"|"deleteNode"|"moveNode"|"applyCrdtOperations";
}

export interface DocumentMutation__Output {
  'createDirectory'?: (_oll_protocol_CreateDirectory__Output);
  'createDocument'?: (_oll_protocol_CreateDocument__Output);
  'replaceDocument'?: (_oll_protocol_ReplaceDocument__Output);
  'spliceDocumentText'?: (_oll_protocol_SpliceDocumentText__Output);
  'deleteNode'?: (_oll_protocol_DeleteNode__Output);
  'moveNode'?: (_oll_protocol_MoveNode__Output);
  'applyCrdtOperations'?: (_oll_protocol_ApplyCrdtOperations__Output);
  'mutation'?: "createDirectory"|"createDocument"|"replaceDocument"|"spliceDocumentText"|"deleteNode"|"moveNode"|"applyCrdtOperations";
}
