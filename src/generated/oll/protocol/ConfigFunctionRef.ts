// Original file: proto/oll/config.proto


/**
 * A closure is never serialized. This is a session-scoped host-owned handle
 * into oll's embedded configuration runtime; Lua does not call the plugin.
 */
export interface ConfigFunctionRef {
  'sessionId'?: (string);
  'functionId'?: (string);
}

/**
 * A closure is never serialized. This is a session-scoped host-owned handle
 * into oll's embedded configuration runtime; Lua does not call the plugin.
 */
export interface ConfigFunctionRef__Output {
  'sessionId'?: (string);
  'functionId'?: (string);
}
