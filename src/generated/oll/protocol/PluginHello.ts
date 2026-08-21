// Original file: proto/oll/plugin.proto

import type { PluginId as _oll_protocol_PluginId, PluginId__Output as _oll_protocol_PluginId__Output } from '../../oll/protocol/PluginId.js';
import type { PluginName as _oll_protocol_PluginName, PluginName__Output as _oll_protocol_PluginName__Output } from '../../oll/protocol/PluginName.js';
import type { ActionDescriptor as _oll_protocol_ActionDescriptor, ActionDescriptor__Output as _oll_protocol_ActionDescriptor__Output } from '../../oll/protocol/ActionDescriptor.js';

export interface PluginHello {
  'pluginId'?: (_oll_protocol_PluginId | null);
  'pluginName'?: (_oll_protocol_PluginName | null);
  'actions'?: (_oll_protocol_ActionDescriptor)[];
  /**
   * Informational build string only; package/release selection never parses it.
   */
  'pluginVersion'?: (string);
}

export interface PluginHello__Output {
  'pluginId'?: (_oll_protocol_PluginId__Output);
  'pluginName'?: (_oll_protocol_PluginName__Output);
  'actions'?: (_oll_protocol_ActionDescriptor__Output)[];
  /**
   * Informational build string only; package/release selection never parses it.
   */
  'pluginVersion'?: (string);
}
