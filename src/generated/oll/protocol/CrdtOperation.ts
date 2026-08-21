// Original file: proto/oll/document.proto

import type { MapSet as _oll_protocol_MapSet, MapSet__Output as _oll_protocol_MapSet__Output } from '../../oll/protocol/MapSet.js';
import type { MapDelete as _oll_protocol_MapDelete, MapDelete__Output as _oll_protocol_MapDelete__Output } from '../../oll/protocol/MapDelete.js';
import type { ListInsert as _oll_protocol_ListInsert, ListInsert__Output as _oll_protocol_ListInsert__Output } from '../../oll/protocol/ListInsert.js';
import type { ListDelete as _oll_protocol_ListDelete, ListDelete__Output as _oll_protocol_ListDelete__Output } from '../../oll/protocol/ListDelete.js';
import type { ListMove as _oll_protocol_ListMove, ListMove__Output as _oll_protocol_ListMove__Output } from '../../oll/protocol/ListMove.js';
import type { TextInsert as _oll_protocol_TextInsert, TextInsert__Output as _oll_protocol_TextInsert__Output } from '../../oll/protocol/TextInsert.js';
import type { TextDelete as _oll_protocol_TextDelete, TextDelete__Output as _oll_protocol_TextDelete__Output } from '../../oll/protocol/TextDelete.js';
import type { TextMark as _oll_protocol_TextMark, TextMark__Output as _oll_protocol_TextMark__Output } from '../../oll/protocol/TextMark.js';
import type { TextUnmark as _oll_protocol_TextUnmark, TextUnmark__Output as _oll_protocol_TextUnmark__Output } from '../../oll/protocol/TextUnmark.js';
import type { CounterIncrement as _oll_protocol_CounterIncrement, CounterIncrement__Output as _oll_protocol_CounterIncrement__Output } from '../../oll/protocol/CounterIncrement.js';
import type { TreeCreateNode as _oll_protocol_TreeCreateNode, TreeCreateNode__Output as _oll_protocol_TreeCreateNode__Output } from '../../oll/protocol/TreeCreateNode.js';
import type { TreeDeleteNode as _oll_protocol_TreeDeleteNode, TreeDeleteNode__Output as _oll_protocol_TreeDeleteNode__Output } from '../../oll/protocol/TreeDeleteNode.js';
import type { TreeMoveNode as _oll_protocol_TreeMoveNode, TreeMoveNode__Output as _oll_protocol_TreeMoveNode__Output } from '../../oll/protocol/TreeMoveNode.js';
import type { TreeSetMetadata as _oll_protocol_TreeSetMetadata, TreeSetMetadata__Output as _oll_protocol_TreeSetMetadata__Output } from '../../oll/protocol/TreeSetMetadata.js';

export interface CrdtOperation {
  'mapSet'?: (_oll_protocol_MapSet | null);
  'mapDelete'?: (_oll_protocol_MapDelete | null);
  'listInsert'?: (_oll_protocol_ListInsert | null);
  'listDelete'?: (_oll_protocol_ListDelete | null);
  'listMove'?: (_oll_protocol_ListMove | null);
  'textInsert'?: (_oll_protocol_TextInsert | null);
  'textDelete'?: (_oll_protocol_TextDelete | null);
  'textMark'?: (_oll_protocol_TextMark | null);
  'textUnmark'?: (_oll_protocol_TextUnmark | null);
  'counterIncrement'?: (_oll_protocol_CounterIncrement | null);
  'treeCreateNode'?: (_oll_protocol_TreeCreateNode | null);
  'treeDeleteNode'?: (_oll_protocol_TreeDeleteNode | null);
  'treeMoveNode'?: (_oll_protocol_TreeMoveNode | null);
  'treeSetMetadata'?: (_oll_protocol_TreeSetMetadata | null);
  'operation'?: "mapSet"|"mapDelete"|"listInsert"|"listDelete"|"listMove"|"textInsert"|"textDelete"|"textMark"|"textUnmark"|"counterIncrement"|"treeCreateNode"|"treeDeleteNode"|"treeMoveNode"|"treeSetMetadata";
}

export interface CrdtOperation__Output {
  'mapSet'?: (_oll_protocol_MapSet__Output);
  'mapDelete'?: (_oll_protocol_MapDelete__Output);
  'listInsert'?: (_oll_protocol_ListInsert__Output);
  'listDelete'?: (_oll_protocol_ListDelete__Output);
  'listMove'?: (_oll_protocol_ListMove__Output);
  'textInsert'?: (_oll_protocol_TextInsert__Output);
  'textDelete'?: (_oll_protocol_TextDelete__Output);
  'textMark'?: (_oll_protocol_TextMark__Output);
  'textUnmark'?: (_oll_protocol_TextUnmark__Output);
  'counterIncrement'?: (_oll_protocol_CounterIncrement__Output);
  'treeCreateNode'?: (_oll_protocol_TreeCreateNode__Output);
  'treeDeleteNode'?: (_oll_protocol_TreeDeleteNode__Output);
  'treeMoveNode'?: (_oll_protocol_TreeMoveNode__Output);
  'treeSetMetadata'?: (_oll_protocol_TreeSetMetadata__Output);
  'operation'?: "mapSet"|"mapDelete"|"listInsert"|"listDelete"|"listMove"|"textInsert"|"textDelete"|"textMark"|"textUnmark"|"counterIncrement"|"treeCreateNode"|"treeDeleteNode"|"treeMoveNode"|"treeSetMetadata";
}
