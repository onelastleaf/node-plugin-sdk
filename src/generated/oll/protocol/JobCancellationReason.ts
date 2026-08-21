// Original file: proto/oll/plugin.proto

export const JobCancellationReason = {
  JOB_CANCELLATION_REASON_UNSPECIFIED: 'JOB_CANCELLATION_REASON_UNSPECIFIED',
  JOB_CANCELLATION_REASON_USER_REQUEST: 'JOB_CANCELLATION_REASON_USER_REQUEST',
  JOB_CANCELLATION_REASON_DEADLINE: 'JOB_CANCELLATION_REASON_DEADLINE',
} as const;

export type JobCancellationReason =
  | 'JOB_CANCELLATION_REASON_UNSPECIFIED'
  | 0
  | 'JOB_CANCELLATION_REASON_USER_REQUEST'
  | 1
  | 'JOB_CANCELLATION_REASON_DEADLINE'
  | 2

export type JobCancellationReason__Output = typeof JobCancellationReason[keyof typeof JobCancellationReason]
