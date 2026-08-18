import {
  CanonicalLifecycleStatus,
  ExecutionStage,
  STATUS_STAGE_MAP,
  ALLOWED_STATUS_TRANSITIONS,
  TERMINAL_STATUSES,
  isValidStageForStatus,
  isValidStatusTransition,
  isTerminalStatus,
  getValidStagesForStatus,
  assertValidTransition,
  assertValidStage,
  InvalidStateTransitionError,
  InvalidExecutionStageError,
} from '../src';

describe('Two-Tier State Machine & Lifecycle Transitions', () => {
  describe('Authoritative 17 Execution Stages Count', () => {
    it('should contain exactly 17 execution stages across all lifecycle statuses', () => {
      const allStages = Object.values(ExecutionStage);
      expect(allStages).toHaveLength(17);

      const mappedStages = Object.values(STATUS_STAGE_MAP).flat();
      expect(mappedStages).toHaveLength(17);

      // Verify every enum value is present in STATUS_STAGE_MAP
      allStages.forEach(stage => {
        expect(mappedStages).toContain(stage);
      });
    });
  });

  describe('Parent-to-Child Stage Mappings', () => {
    it('should map QUEUED to WAITING_FOR_ASSETS and PROMPT_READY', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.QUEUED)).toEqual([
        ExecutionStage.WAITING_FOR_ASSETS,
        ExecutionStage.PROMPT_READY,
      ]);
      expect(isValidStageForStatus(CanonicalLifecycleStatus.QUEUED, ExecutionStage.WAITING_FOR_ASSETS)).toBe(true);
      expect(isValidStageForStatus(CanonicalLifecycleStatus.QUEUED, ExecutionStage.PROMPT_READY)).toBe(true);
      expect(isValidStageForStatus(CanonicalLifecycleStatus.QUEUED, ExecutionStage.GENERATING)).toBe(false);
    });

    it('should map RESERVED to BUDGET_RESERVED', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.RESERVED)).toEqual([
        ExecutionStage.BUDGET_RESERVED,
      ]);
      expect(isValidStageForStatus(CanonicalLifecycleStatus.RESERVED, ExecutionStage.BUDGET_RESERVED)).toBe(true);
    });

    it('should map RUNNING to 6 execution stages', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.RUNNING)).toEqual([
        ExecutionStage.SUBMITTING,
        ExecutionStage.SUBMITTED,
        ExecutionStage.GENERATING,
        ExecutionStage.DOWNLOADING,
        ExecutionStage.DOWNLOADED,
        ExecutionStage.QC_RUNNING,
      ]);
    });

    it('should map COMPLETED to APPROVED', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.COMPLETED)).toEqual([
        ExecutionStage.APPROVED,
      ]);
    });

    it('should map FAILED to EXECUTION_FAILED, QC_REJECTED, TIMEOUT', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.FAILED)).toEqual([
        ExecutionStage.EXECUTION_FAILED,
        ExecutionStage.QC_REJECTED,
        ExecutionStage.TIMEOUT,
      ]);
    });

    it('should map CANCELLED to ABORTED_BY_USER, ABORTED_BY_SYSTEM', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.CANCELLED)).toEqual([
        ExecutionStage.ABORTED_BY_USER,
        ExecutionStage.ABORTED_BY_SYSTEM,
      ]);
    });

    it('should map RECONCILED to RECONCILED_SUCCESS, RECONCILED_TERMINAL', () => {
      expect(getValidStagesForStatus(CanonicalLifecycleStatus.RECONCILED)).toEqual([
        ExecutionStage.RECONCILED_SUCCESS,
        ExecutionStage.RECONCILED_TERMINAL,
      ]);
    });

    it('should return empty array for unknown status in getValidStagesForStatus', () => {
      expect(getValidStagesForStatus('UNKNOWN_STATUS' as unknown as CanonicalLifecycleStatus)).toEqual([]);
      expect(isValidStageForStatus('UNKNOWN_STATUS' as unknown as CanonicalLifecycleStatus, ExecutionStage.APPROVED)).toBe(false);
    });
  });

  describe('Lifecycle Status Transitions', () => {
    it('should allow valid transitions from QUEUED', () => {
      expect(isValidStatusTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.RESERVED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.CANCELLED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.FAILED)).toBe(true);

      expect(isValidStatusTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.RUNNING)).toBe(false);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.COMPLETED)).toBe(false);
    });

    it('should allow valid transitions from RESERVED', () => {
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RESERVED, CanonicalLifecycleStatus.RUNNING)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RESERVED, CanonicalLifecycleStatus.CANCELLED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RESERVED, CanonicalLifecycleStatus.FAILED)).toBe(true);

      expect(isValidStatusTransition(CanonicalLifecycleStatus.RESERVED, CanonicalLifecycleStatus.COMPLETED)).toBe(false);
    });

    it('should allow valid transitions from RUNNING', () => {
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.COMPLETED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.FAILED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.CANCELLED)).toBe(true);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.RECONCILED)).toBe(true);

      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.QUEUED)).toBe(false);
      expect(isValidStatusTransition(CanonicalLifecycleStatus.RUNNING, CanonicalLifecycleStatus.RESERVED)).toBe(false);
    });

    it('should disallow transitions from terminal states', () => {
      TERMINAL_STATUSES.forEach(status => {
        expect(isTerminalStatus(status)).toBe(true);
        expect(ALLOWED_STATUS_TRANSITIONS[status]).toHaveLength(0);

        Object.values(CanonicalLifecycleStatus).forEach(target => {
          expect(isValidStatusTransition(status, target)).toBe(false);
        });
      });
    });

    it('should disallow self transitions', () => {
      Object.values(CanonicalLifecycleStatus).forEach(status => {
        expect(isValidStatusTransition(status, status)).toBe(false);
      });
    });

    it('should return false for unknown status in isValidStatusTransition', () => {
      expect(isValidStatusTransition('UNKNOWN' as unknown as CanonicalLifecycleStatus, CanonicalLifecycleStatus.RUNNING)).toBe(false);
    });
  });

  describe('Assertion Functions', () => {
    it('assertValidTransition should not throw for valid transitions and throw for invalid transitions', () => {
      expect(() => {
        assertValidTransition(CanonicalLifecycleStatus.QUEUED, CanonicalLifecycleStatus.RESERVED);
      }).not.toThrow();

      expect(() => {
        assertValidTransition(CanonicalLifecycleStatus.COMPLETED, CanonicalLifecycleStatus.RUNNING);
      }).toThrow(InvalidStateTransitionError);
    });

    it('assertValidStage should not throw for valid stages and throw for invalid stages', () => {
      expect(() => {
        assertValidStage(CanonicalLifecycleStatus.RUNNING, ExecutionStage.GENERATING);
      }).not.toThrow();

      expect(() => {
        assertValidStage(CanonicalLifecycleStatus.RUNNING, ExecutionStage.APPROVED);
      }).toThrow(InvalidExecutionStageError);
    });
  });
});
