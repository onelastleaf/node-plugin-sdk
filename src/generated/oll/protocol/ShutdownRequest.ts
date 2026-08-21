// Original file: proto/oll/plugin.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp.js';

export interface ShutdownRequest {
  'reason'?: (string);
  /**
   * The plugin should acknowledge and exit before this deadline. Host signal
   * escalation after the deadline is enforcement of this same graceful request,
   * not another public operation.
   */
  'gracePeriodDeadline'?: (_google_protobuf_Timestamp | null);
}

export interface ShutdownRequest__Output {
  'reason'?: (string);
  /**
   * The plugin should acknowledge and exit before this deadline. Host signal
   * escalation after the deadline is enforcement of this same graceful request,
   * not another public operation.
   */
  'gracePeriodDeadline'?: (_google_protobuf_Timestamp__Output);
}
