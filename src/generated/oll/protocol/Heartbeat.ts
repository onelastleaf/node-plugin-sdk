// Original file: proto/oll/plugin.proto

import type { Long } from '@grpc/proto-loader';

export interface Heartbeat {
  'nonce'?: (number | string | Long);
}

export interface Heartbeat__Output {
  'nonce'?: (string);
}
