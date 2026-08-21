// Original file: proto/oll/common.proto

import type { Long } from '@grpc/proto-loader';

export interface TraceContext {
  'correlationId'?: (string);
  'parentCallId'?: (number | string | Long);
  'callDepth'?: (number);
  'causalDepth'?: (number);
  'taskId'?: (string);
  'taskGroupId'?: (string);
  '_parentCallId'?: "parentCallId";
  '_taskId'?: "taskId";
  '_taskGroupId'?: "taskGroupId";
}

export interface TraceContext__Output {
  'correlationId'?: (string);
  'parentCallId'?: (string);
  'callDepth'?: (number);
  'causalDepth'?: (number);
  'taskId'?: (string);
  'taskGroupId'?: (string);
  '_parentCallId'?: "parentCallId";
  '_taskId'?: "taskId";
  '_taskGroupId'?: "taskGroupId";
}
