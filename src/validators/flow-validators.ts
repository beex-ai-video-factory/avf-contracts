import { createSchemaValidator, ValidationResult } from './ajv-instance';
import { FlowCommand, FlowExecutionResult, FlowCommandType } from '../types/flow';

const BROWSER_COMMAND_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/browser-command.schema.json';
const FLOW_RESULT_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/flow-execution-result.schema.json';

const browserCommandVal = createSchemaValidator<FlowCommand>(BROWSER_COMMAND_SCHEMA_ID, 'BrowserCommand');
const flowResultVal = createSchemaValidator<FlowExecutionResult>(FLOW_RESULT_SCHEMA_ID, 'FlowExecutionResult');

export function validateBrowserCommand(data: unknown): ValidationResult<FlowCommand> {
  return browserCommandVal.validate(data);
}

export function assertValidBrowserCommand(data: unknown): asserts data is FlowCommand {
  browserCommandVal.assert(data);
}

export const BrowserCommandValidator = {
  validate: validateBrowserCommand,
  assert: assertValidBrowserCommand,
};

export function validateFlowExecutionResult<TType extends FlowCommandType = FlowCommandType>(
  data: unknown
): ValidationResult<FlowExecutionResult<TType>> {
  return flowResultVal.validate(data) as ValidationResult<FlowExecutionResult<TType>>;
}

export function assertValidFlowExecutionResult<TType extends FlowCommandType = FlowCommandType>(
  data: unknown
): asserts data is FlowExecutionResult<TType> {
  flowResultVal.assert(data);
}

export const FlowExecutionResultValidator = {
  validate: validateFlowExecutionResult,
  assert: assertValidFlowExecutionResult,
};
