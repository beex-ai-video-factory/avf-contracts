import {
  validateProject,
  assertValidProject,
  ProjectValidator,
  validateShot,
  assertValidShot,
  ShotValidator,
  validateShotVersion,
  assertValidShotVersion,
  ShotVersionValidator,
  validatePromptVersion,
  assertValidPromptVersion,
  PromptVersionValidator,
  validateGenerationJob,
  assertValidGenerationJob,
  GenerationJobValidator,
  validateTake,
  assertValidTake,
  TakeValidator,
  validateAssetVersion,
  assertValidAssetVersion,
  AssetVersionValidator,
  validateCharacterVersion,
  assertValidCharacterVersion,
  CharacterVersionValidator,
  validateStyleVersion,
  assertValidStyleVersion,
  StyleVersionValidator,
  validateNormalizedError,
  assertValidNormalizedError,
  NormalizedErrorValidator,
  validateEventEnvelope,
  assertValidEventEnvelope,
  EventEnvelopeValidator,
  validateProviderRequest,
  assertValidProviderRequest,
  ProviderRequestValidator,
  validateProviderResult,
  assertValidProviderResult,
  ProviderResultValidator,
  validateBrowserCommand,
  assertValidBrowserCommand,
  BrowserCommandValidator,
  validateFlowExecutionResult,
  assertValidFlowExecutionResult,
  FlowExecutionResultValidator,
  SchemaValidationError,
  mapAjvErrors,
  createSchemaValidator,
} from '../src';

describe('Runtime Validator Functions & Assertion Helpers', () => {
  const validUUID = '11111111-1111-4111-8111-111111111111';
  const validTimestamp = '2026-08-16T12:00:00Z';
  const invalidData = { invalid_property: 'not_allowed' };

  describe('Utility & Error Mapping Functions', () => {
    it('handles mapAjvErrors with null and empty inputs', () => {
      expect(mapAjvErrors(null)).toEqual([]);
      expect(mapAjvErrors(undefined)).toEqual([]);
      expect(mapAjvErrors([])).toEqual([]);
    });

    it('throws when schemaRef is not found in Ajv instance', () => {
      const validator = createSchemaValidator('https://schemas.aivideofactory.com/v1/non-existent.json', 'NonExistent');
      expect(() => validator.validate({})).toThrow(/not found in Ajv instance/);
      expect(() => validator.assert({})).toThrow(/not found in Ajv instance/);
    });
  });

  describe('Project Validator', () => {
    it('validates and asserts valid Project', () => {
      const proj = {
        project_id: validUUID,
        title: 'Project Title',
        created_at: validTimestamp,
        entity_version: 1,
      };
      expect(validateProject(proj).valid).toBe(true);
      expect(ProjectValidator.validate(proj).valid).toBe(true);
      expect(() => assertValidProject(proj)).not.toThrow();
      expect(() => ProjectValidator.assert(proj)).not.toThrow();
    });

    it('throws SchemaValidationError on invalid Project', () => {
      expect(validateProject(invalidData).valid).toBe(false);
      expect(() => assertValidProject(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('Shot & ShotVersion Validators', () => {
    it('validates and asserts valid Shot', () => {
      const shot = {
        shot_id: validUUID,
        project_id: validUUID,
        shot_number: 1,
        created_at: validTimestamp,
        entity_version: 1,
      };
      expect(validateShot(shot).valid).toBe(true);
      expect(ShotValidator.validate(shot).valid).toBe(true);
      expect(() => assertValidShot(shot)).not.toThrow();
      expect(() => ShotValidator.assert(shot)).not.toThrow();
    });

    it('throws on invalid Shot', () => {
      expect(validateShot(invalidData).valid).toBe(false);
      expect(() => assertValidShot(invalidData)).toThrow(SchemaValidationError);
    });

    it('validates and asserts valid ShotVersion', () => {
      const shotVer = {
        shot_version_id: validUUID,
        shot_id: validUUID,
        version_number: 1,
        duration_ms: 3000,
        action_description: 'Valid action',
        created_at: validTimestamp,
      };
      expect(validateShotVersion(shotVer).valid).toBe(true);
      expect(ShotVersionValidator.validate(shotVer).valid).toBe(true);
      expect(() => assertValidShotVersion(shotVer)).not.toThrow();
      expect(() => ShotVersionValidator.assert(shotVer)).not.toThrow();
    });

    it('throws on invalid ShotVersion', () => {
      expect(validateShotVersion(invalidData).valid).toBe(false);
      expect(() => assertValidShotVersion(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('PromptVersion Validator', () => {
    it('validates and asserts valid PromptVersion', () => {
      const pv = {
        prompt_version_id: validUUID,
        shot_id: validUUID,
        shot_version_id: validUUID,
        version_number: 1,
        target_provider: 'google-flow-pro',
        positive_prompt: 'Cyberpunk landscape',
        created_at: validTimestamp,
      };
      expect(validatePromptVersion(pv).valid).toBe(true);
      expect(PromptVersionValidator.validate(pv).valid).toBe(true);
      expect(() => assertValidPromptVersion(pv)).not.toThrow();
      expect(() => PromptVersionValidator.assert(pv)).not.toThrow();
    });

    it('throws on invalid PromptVersion', () => {
      expect(validatePromptVersion(invalidData).valid).toBe(false);
      expect(() => assertValidPromptVersion(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('GenerationJob Validator', () => {
    it('validates and asserts valid GenerationJob', () => {
      const job = {
        job_id: validUUID,
        project_id: validUUID,
        shot_id: validUUID,
        shot_version_id: validUUID,
        prompt_version_id: validUUID,
        provider_id: 'google-flow-pro',
        idempotency_key: 'idemp-1234567890123456',
        status: 'QUEUED',
        attempt_index: 1,
        requested_at: validTimestamp,
        entity_version: 1,
      };
      expect(validateGenerationJob(job).valid).toBe(true);
      expect(GenerationJobValidator.validate(job).valid).toBe(true);
      expect(() => assertValidGenerationJob(job)).not.toThrow();
      expect(() => GenerationJobValidator.assert(job)).not.toThrow();
    });

    it('throws on invalid GenerationJob', () => {
      expect(validateGenerationJob(invalidData).valid).toBe(false);
      expect(() => assertValidGenerationJob(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('Take Validator', () => {
    it('validates and asserts valid Take', () => {
      const take = {
        take_id: validUUID,
        shot_id: validUUID,
        shot_version_id: validUUID,
        prompt_version_id: validUUID,
        job_id: validUUID,
        take_number: 1,
        storage_uri: 'https://storage.aivideofactory.com/take.mp4',
        mime_type: 'video/mp4',
        byte_size: 10240,
        checksum_sha256: 'a'.repeat(64),
        duration_ms: 2000,
        created_at: validTimestamp,
      };
      expect(validateTake(take).valid).toBe(true);
      expect(TakeValidator.validate(take).valid).toBe(true);
      expect(() => assertValidTake(take)).not.toThrow();
      expect(() => TakeValidator.assert(take)).not.toThrow();
    });

    it('throws on invalid Take', () => {
      expect(validateTake(invalidData).valid).toBe(false);
      expect(() => assertValidTake(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('AssetVersion, CharacterVersion, StyleVersion Validators', () => {
    it('validates AssetVersion', () => {
      const asset = {
        asset_version_id: validUUID,
        asset_id: validUUID,
        version_number: 1,
        storage_uri: 'https://storage.aivideofactory.com/asset.png',
        mime_type: 'image/png',
        byte_size: 2048,
        checksum_sha256: 'b'.repeat(64),
        created_at: validTimestamp,
      };
      expect(validateAssetVersion(asset).valid).toBe(true);
      expect(AssetVersionValidator.validate(asset).valid).toBe(true);
      expect(() => assertValidAssetVersion(asset)).not.toThrow();
      expect(() => AssetVersionValidator.assert(asset)).not.toThrow();
    });

    it('throws on invalid AssetVersion', () => {
      expect(validateAssetVersion(invalidData).valid).toBe(false);
      expect(() => assertValidAssetVersion(invalidData)).toThrow(SchemaValidationError);
    });

    it('validates CharacterVersion', () => {
      const char = {
        character_version_id: validUUID,
        character_id: validUUID,
        name: 'Neo',
        created_at: validTimestamp,
      };
      expect(validateCharacterVersion(char).valid).toBe(true);
      expect(CharacterVersionValidator.validate(char).valid).toBe(true);
      expect(() => assertValidCharacterVersion(char)).not.toThrow();
      expect(() => CharacterVersionValidator.assert(char)).not.toThrow();
    });

    it('throws on invalid CharacterVersion', () => {
      expect(validateCharacterVersion(invalidData).valid).toBe(false);
      expect(() => assertValidCharacterVersion(invalidData)).toThrow(SchemaValidationError);
    });

    it('validates StyleVersion', () => {
      const style = {
        style_version_id: validUUID,
        style_id: validUUID,
        name: 'Anime Cyberpunk',
        created_at: validTimestamp,
      };
      expect(validateStyleVersion(style).valid).toBe(true);
      expect(StyleVersionValidator.validate(style).valid).toBe(true);
      expect(() => assertValidStyleVersion(style)).not.toThrow();
      expect(() => StyleVersionValidator.assert(style)).not.toThrow();
    });

    it('throws on invalid StyleVersion', () => {
      expect(validateStyleVersion(invalidData).valid).toBe(false);
      expect(() => assertValidStyleVersion(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('NormalizedError Validator', () => {
    it('validates NormalizedError', () => {
      const err = {
        code: 'NETWORK_TIMEOUT',
        message: 'Socket timeout after 30000ms',
        retry_category: 'TRANSIENT',
        suggested_backoff_ms: 1000,
      };
      expect(validateNormalizedError(err).valid).toBe(true);
      expect(NormalizedErrorValidator.validate(err).valid).toBe(true);
      expect(() => assertValidNormalizedError(err)).not.toThrow();
      expect(() => NormalizedErrorValidator.assert(err)).not.toThrow();
    });

    it('throws on invalid NormalizedError', () => {
      expect(validateNormalizedError(invalidData).valid).toBe(false);
      expect(() => assertValidNormalizedError(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('EventEnvelope Validator', () => {
    it('validates EventEnvelope', () => {
      const event = {
        event_id: validUUID,
        event_type: 'avf.test.event_occurred',
        aggregate_id: 'agg-1',
        aggregate_version: 1,
        timestamp_utc: validTimestamp,
        correlation_id: validUUID,
        schema_version: '1.0.0',
        payload: { test: true },
      };
      expect(validateEventEnvelope(event).valid).toBe(true);
      expect(EventEnvelopeValidator.validate(event).valid).toBe(true);
      expect(() => assertValidEventEnvelope(event)).not.toThrow();
      expect(() => EventEnvelopeValidator.assert(event)).not.toThrow();
    });

    it('throws on invalid EventEnvelope', () => {
      expect(validateEventEnvelope(invalidData).valid).toBe(false);
      expect(() => assertValidEventEnvelope(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('ProviderRequest and ProviderResult Validators', () => {
    it('validates ProviderRequest', () => {
      const req = {
        request_id: validUUID,
        job_id: validUUID,
        prompt_version_id: validUUID,
        provider_id: 'google-flow-pro',
        positive_prompt: 'Test prompt',
        idempotency_key: 'idemp-1234567890123456',
        attempt_index: 1,
        timestamp_utc: validTimestamp,
      };
      expect(validateProviderRequest(req).valid).toBe(true);
      expect(ProviderRequestValidator.validate(req).valid).toBe(true);
      expect(() => assertValidProviderRequest(req)).not.toThrow();
      expect(() => ProviderRequestValidator.assert(req)).not.toThrow();
    });

    it('throws on invalid ProviderRequest', () => {
      expect(validateProviderRequest(invalidData).valid).toBe(false);
      expect(() => assertValidProviderRequest(invalidData)).toThrow(SchemaValidationError);
    });

    it('validates ProviderResult', () => {
      const res = {
        request_id: validUUID,
        job_id: validUUID,
        provider_id: 'google-flow-pro',
        status: 'SUCCESS',
        timestamp_utc: validTimestamp,
      };
      expect(validateProviderResult(res).valid).toBe(true);
      expect(ProviderResultValidator.validate(res).valid).toBe(true);
      expect(() => assertValidProviderResult(res)).not.toThrow();
      expect(() => ProviderResultValidator.assert(res)).not.toThrow();
    });

    it('throws on invalid ProviderResult', () => {
      expect(validateProviderResult(invalidData).valid).toBe(false);
      expect(() => assertValidProviderResult(invalidData)).toThrow(SchemaValidationError);
    });
  });

  describe('BrowserCommand and FlowExecutionResult Validators', () => {
    it('validates BrowserCommand', () => {
      const cmd = {
        command_id: validUUID,
        session_id: 'session-123',
        command_type: 'ENSURE_SESSION',
        timestamp_utc: validTimestamp,
        params: {
          account_alias: 'primary',
        },
      };
      expect(validateBrowserCommand(cmd).valid).toBe(true);
      expect(BrowserCommandValidator.validate(cmd).valid).toBe(true);
      expect(() => assertValidBrowserCommand(cmd)).not.toThrow();
      expect(() => BrowserCommandValidator.assert(cmd)).not.toThrow();
    });

    it('throws on invalid BrowserCommand', () => {
      expect(validateBrowserCommand(invalidData).valid).toBe(false);
      expect(() => assertValidBrowserCommand(invalidData)).toThrow(SchemaValidationError);
    });

    it('validates FlowExecutionResult', () => {
      const res = {
        command_id: validUUID,
        session_id: 'session-123',
        command_type: 'ENSURE_SESSION',
        status: 'SUCCESS',
        timestamp_utc: validTimestamp,
        result: {
          session_active: true,
          account_alias: 'primary',
          authenticated: true,
        },
      };
      expect(validateFlowExecutionResult(res).valid).toBe(true);
      expect(FlowExecutionResultValidator.validate(res).valid).toBe(true);
      expect(() => assertValidFlowExecutionResult(res)).not.toThrow();
      expect(() => FlowExecutionResultValidator.assert(res)).not.toThrow();
    });

    it('throws on invalid FlowExecutionResult', () => {
      expect(validateFlowExecutionResult(invalidData).valid).toBe(false);
      expect(() => assertValidFlowExecutionResult(invalidData)).toThrow(SchemaValidationError);
    });
  });
});
