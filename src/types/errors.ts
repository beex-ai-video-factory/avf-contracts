/**
 * Canonical 9 Standard AVF Error Codes
 */
export enum ErrorCode {
  PROVIDER_RATE_LIMIT = 'PROVIDER_RATE_LIMIT',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  SECURITY_CHALLENGE = 'SECURITY_CHALLENGE',
  UI_CHANGED = 'UI_CHANGED',
  BUDGET_EXHAUSTED = 'BUDGET_EXHAUSTED',
  UNSUPPORTED_CAPABILITY = 'UNSUPPORTED_CAPABILITY',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  BAD_REQUEST = 'BAD_REQUEST',
  PROVIDER_INTERNAL_ERROR = 'PROVIDER_INTERNAL_ERROR',
}

/**
 * Standard AVF Retry Classifications
 */
export enum RetryCategory {
  TRANSIENT = 'TRANSIENT',
  PERMANENT = 'PERMANENT',
  POLICY_BLOCKED = 'POLICY_BLOCKED',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
}

/**
 * Normalized error structure across all AVF adapters and workers
 */
export interface NormalizedError {
  code: ErrorCode | keyof typeof ErrorCode;
  message: string;
  retry_category: RetryCategory | keyof typeof RetryCategory;
  suggested_backoff_ms?: number;
  raw_provider_error?: Record<string, unknown>;
  raw_details?: Record<string, unknown>;
}
