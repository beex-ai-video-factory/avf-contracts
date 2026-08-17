import * as fs from 'fs';
import * as path from 'path';
import {
  validateProject,
  validateShot,
  validateShotVersion,
  validatePromptVersion,
  validateGenerationJob,
  validateTake,
  validateAssetVersion,
  validateCharacterVersion,
  validateStyleVersion,
  validateEventEnvelope,
  validateProviderRequest,
  validateProviderResult,
  validateBrowserCommand,
  validateFlowExecutionResult,
} from '../src';

function runFixtureValidation() {
  const fixturesDir = path.resolve(__dirname, '../tests/fixtures');
  let totalFixtures = 0;
  let passed = 0;
  let failed = 0;

  console.log('Validating all JSON fixtures against AVF contract validators...');

  function checkDir(dirPath: string, isPositive: boolean, validatorFn: (data: unknown) => { valid: boolean; errorMessage?: string }) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    for (const file of files) {
      totalFixtures++;
      const fullPath = path.join(dirPath, file);
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const result = validatorFn(content);

      if (isPositive) {
        if (result.valid) {
          passed++;
          console.log(`  ✓ [POS] ${path.relative(fixturesDir, fullPath)} passed validation`);
        } else {
          failed++;
          console.error(`  ✗ [POS] ${path.relative(fixturesDir, fullPath)} FAILED validation: ${result.errorMessage}`);
        }
      } else {
        if (!result.valid) {
          passed++;
          console.log(`  ✓ [NEG] ${path.relative(fixturesDir, fullPath)} correctly rejected: ${result.errorMessage}`);
        } else {
          failed++;
          console.error(`  ✗ [NEG] ${path.relative(fixturesDir, fullPath)} was unexpectedly accepted!`);
        }
      }
    }
  }

  function validateDomainEntity(d: any) {
    if (d.take_id !== undefined) return validateTake(d);
    if (d.job_id !== undefined) return validateGenerationJob(d);
    if (d.prompt_version_id !== undefined) return validatePromptVersion(d);
    if (d.shot_version_id !== undefined) return validateShotVersion(d);
    if (d.shot_id !== undefined) return validateShot(d);
    if (d.asset_version_id !== undefined) return validateAssetVersion(d);
    if (d.character_version_id !== undefined) return validateCharacterVersion(d);
    if (d.style_version_id !== undefined) return validateStyleVersion(d);
    if (d.project_id !== undefined) return validateProject(d);
    return { valid: false, errorMessage: 'Unknown entity type' };
  }

  // Domain entities
  checkDir(path.join(fixturesDir, 'domain-entities/positive'), true, validateDomainEntity);
  checkDir(path.join(fixturesDir, 'domain-entities/negative'), false, validateDomainEntity);

  // Event envelope
  checkDir(path.join(fixturesDir, 'event-envelope/positive'), true, validateEventEnvelope);
  checkDir(path.join(fixturesDir, 'event-envelope/negative'), false, validateEventEnvelope);

  // Provider request
  checkDir(path.join(fixturesDir, 'provider-request/positive'), true, validateProviderRequest);
  checkDir(path.join(fixturesDir, 'provider-request/negative'), false, validateProviderRequest);

  // Provider result
  checkDir(path.join(fixturesDir, 'provider-result/positive'), true, validateProviderResult);
  checkDir(path.join(fixturesDir, 'provider-result/negative'), false, validateProviderResult);

  // Browser command
  checkDir(path.join(fixturesDir, 'browser-command/positive'), true, validateBrowserCommand);
  checkDir(path.join(fixturesDir, 'browser-command/negative'), false, validateBrowserCommand);

  // Flow execution result
  checkDir(path.join(fixturesDir, 'flow-execution-result/positive'), true, validateFlowExecutionResult);
  checkDir(path.join(fixturesDir, 'flow-execution-result/negative'), false, validateFlowExecutionResult);

  console.log(`\nValidation Summary: ${passed}/${totalFixtures} fixtures passed. (${failed} failures)`);
  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runFixtureValidation();
}
