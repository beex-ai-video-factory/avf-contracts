import { defaultAjv } from '../src/validators/ajv-instance';
import { SCHEMAS, SCHEMA_IDS } from '../src/schemas';

describe('JSON Schema Compilation & Meta-Validation', () => {
  it('should compile domain-entities.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.DOMAIN_ENTITIES);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should compile event-envelope.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.EVENT_ENVELOPE);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should compile provider-request.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.PROVIDER_REQUEST);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should compile provider-result.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.PROVIDER_RESULT);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should compile browser-command.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.BROWSER_COMMAND);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should compile flow-execution-result.schema.json without errors', () => {
    const validate = defaultAjv.getSchema(SCHEMA_IDS.FLOW_EXECUTION_RESULT);
    expect(validate).toBeDefined();
    expect(typeof validate).toBe('function');
  });

  it('should verify all schema IDs are strictly valid URIs', () => {
    Object.values(SCHEMA_IDS).forEach(schemaId => {
      expect(schemaId).toMatch(/^https:\/\/schemas\.aivideofactory\.com\/v1\/[a-z0-9_-]+\.schema\.json$/);
    });
  });

  it('should verify domain-entities contains all 10 core entity definitions in $defs', () => {
    const defs = (SCHEMAS.DOMAIN_ENTITIES as unknown as { $defs: Record<string, unknown> }).$defs;
    expect(defs).toBeDefined();
    expect(defs.UUID).toBeDefined();
    expect(defs.Timestamp).toBeDefined();
    expect(defs.CanonicalLifecycleStatus).toBeDefined();
    expect(defs.ExecutionStage).toBeDefined();
    expect(defs.NormalizedError).toBeDefined();
    expect(defs.Project).toBeDefined();
    expect(defs.Shot).toBeDefined();
    expect(defs.ShotVersion).toBeDefined();
    expect(defs.PromptVersion).toBeDefined();
    expect(defs.GenerationJob).toBeDefined();
    expect(defs.Take).toBeDefined();
    expect(defs.AssetVersion).toBeDefined();
    expect(defs.CharacterVersion).toBeDefined();
    expect(defs.StyleVersion).toBeDefined();
  });
});
