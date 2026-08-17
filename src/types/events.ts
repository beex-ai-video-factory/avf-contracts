import { UUID, Timestamp } from './domain';

/**
 * Canonical distributed event envelope with OpenTelemetry tracing headers
 */
export interface EventEnvelope<T = Record<string, unknown>> {
  event_id: UUID;
  event_type: string;
  aggregate_id: string;
  aggregate_version: number;
  timestamp_utc: Timestamp;
  correlation_id: UUID;
  trace_id?: string;
  span_id?: string;
  workflow_run_id?: string;
  schema_version: string;
  payload: T;
}

/**
 * Standard AVF Domain Event Types catalog
 */
export const EventTypes = {
  // Generation Lifecycle
  GENERATION_JOB_CREATED: 'avf.generation.job_created',
  GENERATION_STAGE_CHANGED: 'avf.generation.stage_changed',
  GENERATION_JOB_SUBMITTED: 'avf.generation.job_submitted',
  GENERATION_JOB_COMPLETED: 'avf.generation.job_completed',
  GENERATION_JOB_FAILED: 'avf.generation.job_failed',
  GENERATION_JOB_CANCELLED: 'avf.generation.job_cancelled',
  GENERATION_JOB_RECONCILED: 'avf.generation.job_reconciled',

  // Take & Asset Lifecycle
  TAKE_GENERATED: 'avf.take.generated',
  TAKE_QC_STARTED: 'avf.take.qc_started',
  TAKE_QC_COMPLETED: 'avf.take.qc_completed',
  ASSET_REGISTERED: 'avf.asset.registered',

  // Worker & Infrastructure
  WORKER_LEASE_ACQUIRED: 'avf.worker.lease_acquired',
  WORKER_LEASE_RENEWED: 'avf.worker.lease_renewed',
  WORKER_LEASE_EXPIRED: 'avf.worker.lease_expired',
  DIAGNOSTIC_CAPTURED: 'avf.diagnostic.captured',
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes] | string;
