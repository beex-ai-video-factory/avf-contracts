import { createSchemaValidator, ValidationResult } from './ajv-instance';
import {
  Project,
  Shot,
  ShotVersion,
  PromptVersion,
  GenerationJob,
  Take,
  AssetVersion,
  CharacterVersion,
  StyleVersion,
} from '../types/domain';
import { NormalizedError } from '../types/errors';

const DOMAIN_SCHEMA_ID = 'https://schemas.aivideofactory.com/v1/domain-entities.schema.json';

const projectVal = createSchemaValidator<Project>(`${DOMAIN_SCHEMA_ID}#/$defs/Project`, 'Project');
const shotVal = createSchemaValidator<Shot>(`${DOMAIN_SCHEMA_ID}#/$defs/Shot`, 'Shot');
const shotVersionVal = createSchemaValidator<ShotVersion>(`${DOMAIN_SCHEMA_ID}#/$defs/ShotVersion`, 'ShotVersion');
const promptVersionVal = createSchemaValidator<PromptVersion>(`${DOMAIN_SCHEMA_ID}#/$defs/PromptVersion`, 'PromptVersion');
const generationJobVal = createSchemaValidator<GenerationJob>(`${DOMAIN_SCHEMA_ID}#/$defs/GenerationJob`, 'GenerationJob');
const takeVal = createSchemaValidator<Take>(`${DOMAIN_SCHEMA_ID}#/$defs/Take`, 'Take');
const assetVersionVal = createSchemaValidator<AssetVersion>(`${DOMAIN_SCHEMA_ID}#/$defs/AssetVersion`, 'AssetVersion');
const characterVersionVal = createSchemaValidator<CharacterVersion>(`${DOMAIN_SCHEMA_ID}#/$defs/CharacterVersion`, 'CharacterVersion');
const styleVersionVal = createSchemaValidator<StyleVersion>(`${DOMAIN_SCHEMA_ID}#/$defs/StyleVersion`, 'StyleVersion');
const normalizedErrorVal = createSchemaValidator<NormalizedError>(`${DOMAIN_SCHEMA_ID}#/$defs/NormalizedError`, 'NormalizedError');

// Project
export function validateProject(data: unknown): ValidationResult<Project> {
  return projectVal.validate(data);
}
export function assertValidProject(data: unknown): asserts data is Project {
  projectVal.assert(data);
}
export const ProjectValidator = {
  validate: validateProject,
  assert: assertValidProject,
};

// Shot
export function validateShot(data: unknown): ValidationResult<Shot> {
  return shotVal.validate(data);
}
export function assertValidShot(data: unknown): asserts data is Shot {
  shotVal.assert(data);
}
export const ShotValidator = {
  validate: validateShot,
  assert: assertValidShot,
};

// ShotVersion
export function validateShotVersion(data: unknown): ValidationResult<ShotVersion> {
  return shotVersionVal.validate(data);
}
export function assertValidShotVersion(data: unknown): asserts data is ShotVersion {
  shotVersionVal.assert(data);
}
export const ShotVersionValidator = {
  validate: validateShotVersion,
  assert: assertValidShotVersion,
};

// PromptVersion
export function validatePromptVersion(data: unknown): ValidationResult<PromptVersion> {
  return promptVersionVal.validate(data);
}
export function assertValidPromptVersion(data: unknown): asserts data is PromptVersion {
  promptVersionVal.assert(data);
}
export const PromptVersionValidator = {
  validate: validatePromptVersion,
  assert: assertValidPromptVersion,
};

// GenerationJob
export function validateGenerationJob(data: unknown): ValidationResult<GenerationJob> {
  return generationJobVal.validate(data);
}
export function assertValidGenerationJob(data: unknown): asserts data is GenerationJob {
  generationJobVal.assert(data);
}
export const GenerationJobValidator = {
  validate: validateGenerationJob,
  assert: assertValidGenerationJob,
};

// Take
export function validateTake(data: unknown): ValidationResult<Take> {
  return takeVal.validate(data);
}
export function assertValidTake(data: unknown): asserts data is Take {
  takeVal.assert(data);
}
export const TakeValidator = {
  validate: validateTake,
  assert: assertValidTake,
};

// AssetVersion
export function validateAssetVersion(data: unknown): ValidationResult<AssetVersion> {
  return assetVersionVal.validate(data);
}
export function assertValidAssetVersion(data: unknown): asserts data is AssetVersion {
  assetVersionVal.assert(data);
}
export const AssetVersionValidator = {
  validate: validateAssetVersion,
  assert: assertValidAssetVersion,
};

// CharacterVersion
export function validateCharacterVersion(data: unknown): ValidationResult<CharacterVersion> {
  return characterVersionVal.validate(data);
}
export function assertValidCharacterVersion(data: unknown): asserts data is CharacterVersion {
  characterVersionVal.assert(data);
}
export const CharacterVersionValidator = {
  validate: validateCharacterVersion,
  assert: assertValidCharacterVersion,
};

// StyleVersion
export function validateStyleVersion(data: unknown): ValidationResult<StyleVersion> {
  return styleVersionVal.validate(data);
}
export function assertValidStyleVersion(data: unknown): asserts data is StyleVersion {
  styleVersionVal.assert(data);
}
export const StyleVersionValidator = {
  validate: validateStyleVersion,
  assert: assertValidStyleVersion,
};

// NormalizedError
export function validateNormalizedError(data: unknown): ValidationResult<NormalizedError> {
  return normalizedErrorVal.validate(data);
}
export function assertValidNormalizedError(data: unknown): asserts data is NormalizedError {
  normalizedErrorVal.assert(data);
}
export const NormalizedErrorValidator = {
  validate: validateNormalizedError,
  assert: assertValidNormalizedError,
};
