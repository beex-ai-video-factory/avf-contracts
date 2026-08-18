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

describe('Comprehensive Positive & Negative Fixture Suite', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  function getFixtureFiles(category: string, subfolder: 'positive' | 'negative'): { name: string; fullPath: string; content: unknown }[] {
    const dir = path.join(fixturesDir, category, subfolder);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f,
        fullPath: path.join(dir, f),
        content: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')),
      }));
  }

  function validateDomainEntity(raw: unknown): { valid: boolean; errorMessage?: string } {
    if (!raw || typeof raw !== 'object') {
      return { valid: false, errorMessage: 'Expected object payload' };
    }
    const c = raw as Record<string, unknown>;
    if (c.take_id !== undefined) return validateTake(c);
    if (c.job_id !== undefined) return validateGenerationJob(c);
    if (c.prompt_version_id !== undefined) return validatePromptVersion(c);
    if (c.shot_version_id !== undefined) return validateShotVersion(c);
    if (c.shot_id !== undefined) return validateShot(c);
    if (c.asset_version_id !== undefined) return validateAssetVersion(c);
    if (c.character_version_id !== undefined) return validateCharacterVersion(c);
    if (c.style_version_id !== undefined) return validateStyleVersion(c);
    if (c.project_id !== undefined) return validateProject(c);
    return { valid: false, errorMessage: 'Unknown entity type' };
  }

  describe('Domain Entities Fixtures', () => {
    const pos = getFixtureFiles('domain-entities', 'positive');
    const neg = getFixtureFiles('domain-entities', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const result = validateDomainEntity(f.content);
        expect(result.valid).toBe(true);
        expect(result.errorMessage).toBeUndefined();
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const result = validateDomainEntity(f.content);
        expect(result.valid).toBe(false);
        expect(result.errorMessage).toBeDefined();
      });
    });
  });

  describe('Event Envelope Fixtures', () => {
    const pos = getFixtureFiles('event-envelope', 'positive');
    const neg = getFixtureFiles('event-envelope', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const res = validateEventEnvelope(f.content);
        expect(res.valid).toBe(true);
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const res = validateEventEnvelope(f.content);
        expect(res.valid).toBe(false);
      });
    });
  });

  describe('Provider Request Fixtures', () => {
    const pos = getFixtureFiles('provider-request', 'positive');
    const neg = getFixtureFiles('provider-request', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const res = validateProviderRequest(f.content);
        expect(res.valid).toBe(true);
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const res = validateProviderRequest(f.content);
        expect(res.valid).toBe(false);
      });
    });
  });

  describe('Provider Result Fixtures', () => {
    const pos = getFixtureFiles('provider-result', 'positive');
    const neg = getFixtureFiles('provider-result', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const res = validateProviderResult(f.content);
        expect(res.valid).toBe(true);
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const res = validateProviderResult(f.content);
        expect(res.valid).toBe(false);
      });
    });
  });

  describe('Browser Command Fixtures', () => {
    const pos = getFixtureFiles('browser-command', 'positive');
    const neg = getFixtureFiles('browser-command', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const res = validateBrowserCommand(f.content);
        expect(res.valid).toBe(true);
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const res = validateBrowserCommand(f.content);
        expect(res.valid).toBe(false);
      });
    });
  });

  describe('Flow Execution Result Fixtures', () => {
    const pos = getFixtureFiles('flow-execution-result', 'positive');
    const neg = getFixtureFiles('flow-execution-result', 'negative');

    it('should have at least 3 positive and 3 negative fixtures', () => {
      expect(pos.length).toBeGreaterThanOrEqual(3);
      expect(neg.length).toBeGreaterThanOrEqual(3);
    });

    pos.forEach(f => {
      it(`[POSITIVE] ${f.name} should pass validation`, () => {
        const res = validateFlowExecutionResult(f.content);
        expect(res.valid).toBe(true);
      });
    });

    neg.forEach(f => {
      it(`[NEGATIVE] ${f.name} should fail validation`, () => {
        const res = validateFlowExecutionResult(f.content);
        expect(res.valid).toBe(false);
      });
    });
  });
});
