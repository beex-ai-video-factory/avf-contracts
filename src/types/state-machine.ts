/**
 * Tier 1: Canonical DB Lifecycle Status (Durable in PostgreSQL)
 */
export enum CanonicalLifecycleStatus {
  QUEUED = 'QUEUED',
  RESERVED = 'RESERVED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RECONCILED = 'RECONCILED',
}

/**
 * Tier 2: Execution Stage (Granular Orchestrator & Telemetry Stage - 17 Normative Stages)
 */
export enum ExecutionStage {
  // Under QUEUED
  WAITING_FOR_ASSETS = 'WAITING_FOR_ASSETS',
  PROMPT_READY = 'PROMPT_READY',

  // Under RESERVED
  BUDGET_RESERVED = 'BUDGET_RESERVED',

  // Under RUNNING
  SUBMITTING = 'SUBMITTING',
  SUBMITTED = 'SUBMITTED',
  GENERATING = 'GENERATING',
  DOWNLOADING = 'DOWNLOADING',
  DOWNLOADED = 'DOWNLOADED',
  QC_RUNNING = 'QC_RUNNING',

  // Under COMPLETED
  APPROVED = 'APPROVED',

  // Under FAILED
  EXECUTION_FAILED = 'EXECUTION_FAILED',
  QC_REJECTED = 'QC_REJECTED',
  TIMEOUT = 'TIMEOUT',

  // Under CANCELLED
  ABORTED_BY_USER = 'ABORTED_BY_USER',
  ABORTED_BY_SYSTEM = 'ABORTED_BY_SYSTEM',

  // Under RECONCILED
  RECONCILED_SUCCESS = 'RECONCILED_SUCCESS',
  RECONCILED_TERMINAL = 'RECONCILED_TERMINAL',
}

/**
 * Stage mapping for each parent lifecycle status
 */
export const STATUS_STAGE_MAP: Record<CanonicalLifecycleStatus, readonly ExecutionStage[]> = {
  [CanonicalLifecycleStatus.QUEUED]: [
    ExecutionStage.WAITING_FOR_ASSETS,
    ExecutionStage.PROMPT_READY,
  ],
  [CanonicalLifecycleStatus.RESERVED]: [
    ExecutionStage.BUDGET_RESERVED,
  ],
  [CanonicalLifecycleStatus.RUNNING]: [
    ExecutionStage.SUBMITTING,
    ExecutionStage.SUBMITTED,
    ExecutionStage.GENERATING,
    ExecutionStage.DOWNLOADING,
    ExecutionStage.DOWNLOADED,
    ExecutionStage.QC_RUNNING,
  ],
  [CanonicalLifecycleStatus.COMPLETED]: [
    ExecutionStage.APPROVED,
  ],
  [CanonicalLifecycleStatus.FAILED]: [
    ExecutionStage.EXECUTION_FAILED,
    ExecutionStage.QC_REJECTED,
    ExecutionStage.TIMEOUT,
  ],
  [CanonicalLifecycleStatus.CANCELLED]: [
    ExecutionStage.ABORTED_BY_USER,
    ExecutionStage.ABORTED_BY_SYSTEM,
  ],
  [CanonicalLifecycleStatus.RECONCILED]: [
    ExecutionStage.RECONCILED_SUCCESS,
    ExecutionStage.RECONCILED_TERMINAL,
  ],
} as const;

/**
 * Valid parent status transitions
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<CanonicalLifecycleStatus, readonly CanonicalLifecycleStatus[]> = {
  [CanonicalLifecycleStatus.QUEUED]: [
    CanonicalLifecycleStatus.RESERVED,
    CanonicalLifecycleStatus.CANCELLED,
    CanonicalLifecycleStatus.FAILED,
  ],
  [CanonicalLifecycleStatus.RESERVED]: [
    CanonicalLifecycleStatus.RUNNING,
    CanonicalLifecycleStatus.CANCELLED,
    CanonicalLifecycleStatus.FAILED,
  ],
  [CanonicalLifecycleStatus.RUNNING]: [
    CanonicalLifecycleStatus.COMPLETED,
    CanonicalLifecycleStatus.FAILED,
    CanonicalLifecycleStatus.CANCELLED,
    CanonicalLifecycleStatus.RECONCILED,
  ],
  [CanonicalLifecycleStatus.COMPLETED]: [],
  [CanonicalLifecycleStatus.FAILED]: [],
  [CanonicalLifecycleStatus.CANCELLED]: [],
  [CanonicalLifecycleStatus.RECONCILED]: [],
} as const;

export const TERMINAL_STATUSES: readonly CanonicalLifecycleStatus[] = [
  CanonicalLifecycleStatus.COMPLETED,
  CanonicalLifecycleStatus.FAILED,
  CanonicalLifecycleStatus.CANCELLED,
  CanonicalLifecycleStatus.RECONCILED,
] as const;
