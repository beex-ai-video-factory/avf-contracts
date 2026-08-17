import domainEntitiesSchema from '../../schemas/domain-entities.schema.json';
import eventEnvelopeSchema from '../../schemas/event-envelope.schema.json';
import providerRequestSchema from '../../schemas/provider-request.schema.json';
import providerResultSchema from '../../schemas/provider-result.schema.json';
import browserCommandSchema from '../../schemas/browser-command.schema.json';
import flowExecutionResultSchema from '../../schemas/flow-execution-result.schema.json';

export {
  domainEntitiesSchema,
  eventEnvelopeSchema,
  providerRequestSchema,
  providerResultSchema,
  browserCommandSchema,
  flowExecutionResultSchema,
};

export const SCHEMAS = {
  DOMAIN_ENTITIES: domainEntitiesSchema,
  EVENT_ENVELOPE: eventEnvelopeSchema,
  PROVIDER_REQUEST: providerRequestSchema,
  PROVIDER_RESULT: providerResultSchema,
  BROWSER_COMMAND: browserCommandSchema,
  FLOW_EXECUTION_RESULT: flowExecutionResultSchema,
} as const;

export const SCHEMA_IDS = {
  DOMAIN_ENTITIES: 'https://schemas.aivideofactory.com/v1/domain-entities.schema.json',
  EVENT_ENVELOPE: 'https://schemas.aivideofactory.com/v1/event-envelope.schema.json',
  PROVIDER_REQUEST: 'https://schemas.aivideofactory.com/v1/provider-request.schema.json',
  PROVIDER_RESULT: 'https://schemas.aivideofactory.com/v1/provider-result.schema.json',
  BROWSER_COMMAND: 'https://schemas.aivideofactory.com/v1/browser-command.schema.json',
  FLOW_EXECUTION_RESULT: 'https://schemas.aivideofactory.com/v1/flow-execution-result.schema.json',
} as const;
