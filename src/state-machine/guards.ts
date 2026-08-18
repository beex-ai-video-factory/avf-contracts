import {
  CanonicalLifecycleStatus,
  ExecutionStage,
  STATUS_STAGE_MAP,
  ALLOWED_STATUS_TRANSITIONS,
  TERMINAL_STATUSES,
} from '../types/state-machine';

/**
 * Checks whether a given execution stage is valid for the parent lifecycle status.
 */
export function isValidStageForStatus(
  status: CanonicalLifecycleStatus | string,
  stage: ExecutionStage | string
): boolean {
  const stages = STATUS_STAGE_MAP[status as CanonicalLifecycleStatus];
  if (!stages) {
    return false;
  }
  return stages.includes(stage as ExecutionStage);
}

/**
 * Checks whether a lifecycle status transition from -> to is valid according to the two-tier state machine.
 */
export function isValidStatusTransition(
  fromStatus: CanonicalLifecycleStatus | string,
  toStatus: CanonicalLifecycleStatus | string
): boolean {
  // Self transition is not allowed unless explicitly specified
  if (fromStatus === toStatus) {
    return false;
  }
  const allowed = ALLOWED_STATUS_TRANSITIONS[fromStatus as CanonicalLifecycleStatus];
  if (!allowed) {
    return false;
  }
  return allowed.includes(toStatus as CanonicalLifecycleStatus);
}

/**
 * Returns true if the lifecycle status is a terminal state.
 */
export function isTerminalStatus(status: CanonicalLifecycleStatus | string): boolean {
  return TERMINAL_STATUSES.includes(status as CanonicalLifecycleStatus);
}

/**
 * Returns the list of valid execution stages for a given lifecycle status.
 */
export function getValidStagesForStatus(
  status: CanonicalLifecycleStatus | string
): readonly ExecutionStage[] {
  return STATUS_STAGE_MAP[status as CanonicalLifecycleStatus] ?? [];
}
