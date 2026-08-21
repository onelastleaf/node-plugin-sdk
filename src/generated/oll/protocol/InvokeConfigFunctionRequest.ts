// Original file: proto/oll/config.proto

import type { ConfigFunctionRef as _oll_protocol_ConfigFunctionRef, ConfigFunctionRef__Output as _oll_protocol_ConfigFunctionRef__Output } from '../../oll/protocol/ConfigFunctionRef.js';
import type { ConfigValue as _oll_protocol_ConfigValue, ConfigValue__Output as _oll_protocol_ConfigValue__Output } from '../../oll/protocol/ConfigValue.js';

export interface InvokeConfigFunctionRequest {
  'function'?: (_oll_protocol_ConfigFunctionRef | null);
  'arguments'?: (_oll_protocol_ConfigValue)[];
}

export interface InvokeConfigFunctionRequest__Output {
  'function'?: (_oll_protocol_ConfigFunctionRef__Output);
  'arguments'?: (_oll_protocol_ConfigValue__Output)[];
}
