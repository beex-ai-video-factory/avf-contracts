import { CanonicalLifecycleStatus, ExecutionStage } from '../types/state-machine';
import { isValidStageForStatus, isValidStatusTransition } from './guards';

export class InvalidStateTransitionError extends Error {
  constructor(
    public readonly fromStatus: string,
    public readonly toStatus: string,
    message?: string
  ) {
    super(message || `Invalid lifecycle status transition from '${fromStatus}' to '${toStatus}'.`);
    this.name = 'InvalidStateTransitionError';
  }
}

export class InvalidExecutionStageError extends Error {
  constructor(
    public readonly status: string,
    public readonly stage: string,
    message?: string
  ) {
    super(message || `Execution stage '${stage}' is not valid for lifecycle status '${status}'.`);
    this.name = 'InvalidExecutionStageError';
  }
}

/**
 * Asserts that a status transition is valid, throwing InvalidStateTransitionError if invalid.
 */
export function assertValidTransition(
  fromStatus: CanonicalLifecycleStatus | string,
  toStatus: CanonicalLifecycleStatus | string
): void {
  if (!isValidStatusTransition(fromStatus, toStatus)) {
    throw new InvalidStateTransitionError(fromStatus, toStatus);
  }
}

/**
 * Asserts that an execution stage belongs to the status, throwing InvalidExecutionStageError if invalid.
 */
export function assertValidStage(
  status: CanonicalLifecycleStatus | string,
  stage: ExecutionStage | string
): void {
  if (!isValidStageForStatus(status, stage)) {
    throw new InvalidExecutionStageError(status, stage);
  }
}
