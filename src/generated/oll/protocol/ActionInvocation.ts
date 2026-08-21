// Original file: proto/oll/plugin.proto


export interface ActionInvocation {
  'action'?: (string);
  /**
   * Generic action calls use shell-style UTF-8 argv semantics. oll preserves
   * order, duplicates, empty strings, and values beginning with '-'.
   */
  'arguments'?: (string)[];
}

export interface ActionInvocation__Output {
  'action'?: (string);
  /**
   * Generic action calls use shell-style UTF-8 argv semantics. oll preserves
   * order, duplicates, empty strings, and values beginning with '-'.
   */
  'arguments'?: (string)[];
}
