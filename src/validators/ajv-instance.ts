import Ajv2020, { ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import domainEntitiesSchema from '../../schemas/domain-entities.schema.json';
import eventEnvelopeSchema from '../../schemas/event-envelope.schema.json';
import providerRequestSchema from '../../schemas/provider-request.schema.json';
import providerResultSchema from '../../schemas/provider-result.schema.json';
import browserCommandSchema from '../../schemas/browser-command.schema.json';
import flowExecutionResultSchema from '../../schemas/flow-execution-result.schema.json';

export interface ValidationErrorDetail {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message?: string;
  params: Record<string, unknown>;
}

export interface ValidationResult<T = unknown> {
  valid: boolean;
  data?: T;
  errors?: ValidationErrorDetail[];
  errorMessage?: string;
}

export class SchemaValidationError extends Error {
  public readonly errors: ValidationErrorDetail[];

  constructor(schemaName: string, errors: ValidationErrorDetail[]) {
    const errorDetails = errors.map(e => `  - ${e.instancePath || '/'}: ${e.message} (${e.keyword})`).join('\n');
    super(`Validation failed for schema '${schemaName}':\n${errorDetails}`);
    this.name = 'SchemaValidationError';
    this.errors = errors;
  }
}

/**
 * Creates and configures an Ajv 2020 instance loaded with all AVF canonical schemas.
 */
export function createAjvInstance(): Ajv2020 {
  const ajv = new Ajv2020({
    allErrors: true,
    verbose: true,
    strict: false,
    validateFormats: true,
  });

  addFormats(ajv);

  // Register all canonical schemas
  ajv.addSchema(domainEntitiesSchema, domainEntitiesSchema.$id);
  ajv.addSchema(eventEnvelopeSchema, eventEnvelopeSchema.$id);
  ajv.addSchema(providerRequestSchema, providerRequestSchema.$id);
  ajv.addSchema(providerResultSchema, providerResultSchema.$id);
  ajv.addSchema(browserCommandSchema, browserCommandSchema.$id);
  ajv.addSchema(flowExecutionResultSchema, flowExecutionResultSchema.$id);

  return ajv;
}

export const defaultAjv = createAjvInstance();

export function mapAjvErrors(errors?: ErrorObject[] | null): ValidationErrorDetail[] {
  if (!errors || errors.length === 0) {
    return [];
  }
  return errors.map(err => ({
    instancePath: err.instancePath,
    schemaPath: err.schemaPath,
    keyword: err.keyword,
    message: err.message,
    params: err.params as Record<string, unknown>,
  }));
}

export interface InternalValidator<T> {
  validate(data: unknown): ValidationResult<T>;
  assert(data: unknown): void;
}

export function createSchemaValidator<T>(schemaRef: string, entityLabel: string): InternalValidator<T> {
  return {
    validate(data: unknown): ValidationResult<T> {
      const validateFn = defaultAjv.getSchema(schemaRef);
      if (!validateFn) {
        throw new Error(`Schema definition '${schemaRef}' not found in Ajv instance.`);
      }
      const valid = validateFn(data) as boolean;
      if (valid) {
        return { valid: true, data: data as T };
      }
      const errors = mapAjvErrors(validateFn.errors);
      return {
        valid: false,
        errors,
        errorMessage: errors.map(e => `${e.instancePath || '/'}: ${e.message}`).join('; '),
      };
    },
    assert(data: unknown): void {
      const validateFn = defaultAjv.getSchema(schemaRef);
      if (!validateFn) {
        throw new Error(`Schema definition '${schemaRef}' not found in Ajv instance.`);
      }
      const valid = validateFn(data) as boolean;
      if (!valid) {
        const errors = mapAjvErrors(validateFn.errors);
        throw new SchemaValidationError(entityLabel, errors);
      }
    },
  };
}
