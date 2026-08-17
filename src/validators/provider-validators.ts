import { createSchemaValidator, ValidationResult } from './ajv-instance';
import { ProviderRequest, ProviderResult } from '../types/provider';

const REQUEST_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/provider-request.schema.json';
const RESULT_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/provider-result.schema.json';

const providerRequestVal = createSchemaValidator<ProviderRequest>(REQUEST_SCHEMA_ID, 'ProviderRequest');
const providerResultVal = createSchemaValidator<ProviderResult>(RESULT_SCHEMA_ID, 'ProviderResult');

export function validateProviderRequest(data: unknown): ValidationResult<ProviderRequest> {
  return providerRequestVal.validate(data);
}

export function assertValidProviderRequest(data: unknown): asserts data is ProviderRequest {
  providerRequestVal.assert(data);
}

export const ProviderRequestValidator = {
  validate: validateProviderRequest,
  assert: assertValidProviderRequest,
};

export function validateProviderResult(data: unknown): ValidationResult<ProviderResult> {
  return providerResultVal.validate(data);
}

export function assertValidProviderResult(data: unknown): asserts data is ProviderResult {
  providerResultVal.assert(data);
}

export const ProviderResultValidator = {
  validate: validateProviderResult,
  assert: assertValidProviderResult,
};
