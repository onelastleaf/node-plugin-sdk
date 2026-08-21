// Original file: proto/oll/plugin.proto

export const JobState = {
  JOB_STATE_UNSPECIFIED: 'JOB_STATE_UNSPECIFIED',
  JOB_STATE_RUNNING: 'JOB_STATE_RUNNING',
  JOB_STATE_SUCCEEDED: 'JOB_STATE_SUCCEEDED',
  JOB_STATE_FAILED: 'JOB_STATE_FAILED',
} as const;

export type JobState =
  | 'JOB_STATE_UNSPECIFIED'
  | 0
  | 'JOB_STATE_RUNNING'
  | 1
  | 'JOB_STATE_SUCCEEDED'
  | 2
  | 'JOB_STATE_FAILED'
  | 3

export type JobState__Output = typeof JobState[keyof typeof JobState]
