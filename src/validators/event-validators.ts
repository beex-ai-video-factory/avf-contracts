import { createSchemaValidator, ValidationResult } from './ajv-instance';
import { EventEnvelope } from '../types/events';

const EVENT_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/event-envelope.schema.json';

const eventEnvelopeVal = createSchemaValidator<EventEnvelope>(EVENT_SCHEMA_ID, 'EventEnvelope');

export function validateEventEnvelope<T = Record<string, unknown>>(data: unknown): ValidationResult<EventEnvelope<T>> {
  return eventEnvelopeVal.validate(data) as ValidationResult<EventEnvelope<T>>;
}

export function assertValidEventEnvelope<T = Record<string, unknown>>(data: unknown): asserts data is EventEnvelope<T> {
  eventEnvelopeVal.assert(data);
}

export const EventEnvelopeValidator = {
  validate: validateEventEnvelope,
  assert: assertValidEventEnvelope,
};
