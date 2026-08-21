// Original file: proto/oll/config.proto

import type { Long } from '@grpc/proto-loader';

export interface ConfigPathSegment {
  'key'?: (string);
  'index'?: (number | string | Long);
  'kind'?: "key"|"index";
}

export interface ConfigPathSegment__Output {
  'key'?: (string);
  'index'?: (string);
  'kind'?: "key"|"index";
}
