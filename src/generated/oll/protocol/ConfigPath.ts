// Original file: proto/oll/config.proto

import type { ConfigPathSegment as _oll_protocol_ConfigPathSegment, ConfigPathSegment__Output as _oll_protocol_ConfigPathSegment__Output } from '../../oll/protocol/ConfigPathSegment.js';

/**
 * Relative to the caller's own live per-plugin Lua result. List indexes are
 * zero-based at this language-neutral boundary.
 */
export interface ConfigPath {
  'segments'?: (_oll_protocol_ConfigPathSegment)[];
}

/**
 * Relative to the caller's own live per-plugin Lua result. List indexes are
 * zero-based at this language-neutral boundary.
 */
export interface ConfigPath__Output {
  'segments'?: (_oll_protocol_ConfigPathSegment__Output)[];
}
