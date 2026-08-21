// Original file: proto/oll/common.proto

/**
 * Shared structured-log severity used by host and plugin records.
 */
export const LogLevel = {
  LOG_LEVEL_UNSPECIFIED: 'LOG_LEVEL_UNSPECIFIED',
  LOG_LEVEL_TRACE: 'LOG_LEVEL_TRACE',
  LOG_LEVEL_DEBUG: 'LOG_LEVEL_DEBUG',
  LOG_LEVEL_INFO: 'LOG_LEVEL_INFO',
  LOG_LEVEL_WARN: 'LOG_LEVEL_WARN',
  LOG_LEVEL_ERROR: 'LOG_LEVEL_ERROR',
} as const;

/**
 * Shared structured-log severity used by host and plugin records.
 */
export type LogLevel =
  | 'LOG_LEVEL_UNSPECIFIED'
  | 0
  | 'LOG_LEVEL_TRACE'
  | 1
  | 'LOG_LEVEL_DEBUG'
  | 2
  | 'LOG_LEVEL_INFO'
  | 3
  | 'LOG_LEVEL_WARN'
  | 4
  | 'LOG_LEVEL_ERROR'
  | 5

/**
 * Shared structured-log severity used by host and plugin records.
 */
export type LogLevel__Output = typeof LogLevel[keyof typeof LogLevel]
