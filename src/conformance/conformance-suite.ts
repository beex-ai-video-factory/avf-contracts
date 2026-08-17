import { FlowExecutionPort } from './port-interface';
import { assertValidBrowserCommand, assertValidFlowExecutionResult } from '../validators/flow-validators';
import { FlowCommand } from '../types/flow';

export interface ConformanceSuiteOptions {
  trackName: 'TRACK_A_BROWSER' | 'TRACK_B_FLOWKIT' | 'MOCK_PORT';
  skipTeardown?: boolean;
}

/**
 * Common conformance test suite validating that any FlowExecutionPort implementation
 * strictly complies with the 10-operation contract, input schemas, and output envelopes.
 */
export function defineFlowExecutionPortConformanceSuite(
  getPort: () => FlowExecutionPort | Promise<FlowExecutionPort>,
  options: ConformanceSuiteOptions = { trackName: 'MOCK_PORT' }
): void {
  describe(`FlowExecutionPort Conformance [${options.trackName}]`, () => {
    let port: FlowExecutionPort;

    beforeAll(async () => {
      port = await getPort();
    });

    describe('Operation 1: ENSURE_SESSION', () => {
      it('should execute ensureSession successfully and return valid result', async () => {
        const params = {
          account_alias: 'account-primary',
          headless: true,
          profile_directory: '/tmp/test-profile',
        };
        const result = await port.ensureSession(params);
        expect(result).toBeDefined();
        expect(typeof result.session_active).toBe('boolean');
        expect(typeof result.account_alias).toBe('string');
        expect(typeof result.authenticated).toBe('boolean');
      });

      it('should handle generic command dispatch for ENSURE_SESSION', async () => {
        const cmd: FlowCommand = {
          command_id: 'a0000000-0000-4000-8000-000000000001',
          session_id: 'sess-test-01',
          timestamp_utc: new Date().toISOString(),
          command_type: 'ENSURE_SESSION',
          params: {
            account_alias: 'account-primary',
            headless: true,
          },
        };
        assertValidBrowserCommand(cmd);
        const res = await port.executeCommand(cmd);
        assertValidFlowExecutionResult(res);
        expect(res.command_id).toBe(cmd.command_id);
        expect(res.command_type).toBe('ENSURE_SESSION');
        expect(res.status).toBe('SUCCESS');
      });
    });

    describe('Operation 2: OPEN_FLOW', () => {
      it('should open workspace flow URL', async () => {
        const result = await port.openFlow({
          flow_url: 'https://flow.google.com/workspace/project-123',
          wait_for_selector: '#workspace-ready',
        });
        expect(result).toBeDefined();
        expect(typeof result.ready).toBe('boolean');
      });
    });

    describe('Operation 3: CREATE_OR_SELECT_PROJECT', () => {
      it('should create or select a project container', async () => {
        const result = await port.createOrSelectProject({
          project_name: 'Conformance Test Project',
          project_id: 'b0000000-0000-4000-8000-000000000001',
        });
        expect(result).toBeDefined();
        expect(result.project_id).toBeDefined();
        expect(result.project_name).toBe('Conformance Test Project');
        expect(typeof result.created_new).toBe('boolean');
      });
    });

    describe('Operation 4: ATTACH_ASSETS', () => {
      it('should attach reference assets to workspace', async () => {
        const result = await port.attachAssets({
          assets: [
            {
              asset_id: 'c0000000-0000-4000-8000-000000000001',
              storage_uri: 'https://storage.aivideofactory.com/assets/char1.png',
              mime_type: 'image/png',
              role: 'CHARACTER',
            },
          ],
        });
        expect(result).toBeDefined();
        expect(result.attached_count).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(result.asset_ids)).toBe(true);
      });
    });

    describe('Operation 5: SET_GENERATION_OPTIONS', () => {
      it('should configure generation parameters', async () => {
        const result = await port.setGenerationOptions({
          aspect_ratio: '16:9',
          resolution: '1080p',
          duration_seconds: 5,
          seed: 42,
          model_version: 'v2.0',
        });
        expect(result).toBeDefined();
        expect(result.options_applied).toBe(true);
        expect(result.effective_aspect_ratio).toBe('16:9');
      });
    });

    describe('Operation 6: SUBMIT_PROMPT', () => {
      it('should submit prompt and return provider_job_id', async () => {
        const result = await port.submitPrompt({
          prompt_text: 'Cinematic drone shot of coastal cliffs at sunrise, 8k hyper-realistic',
          negative_prompt: 'blurry, distorted, low quality',
          idempotency_key: 'idemp-0123456789abcdef',
          attempt_index: 1,
        });
        expect(result).toBeDefined();
        expect(typeof result.provider_job_id).toBe('string');
        expect(result.provider_job_id.length).toBeGreaterThan(0);
        expect(['QUEUED', 'PROCESSING']).toContain(result.status);
      });
    });

    describe('Operation 7: READ_GENERATION_STATE', () => {
      it('should inspect generation state of submitted job', async () => {
        const result = await port.readGenerationState({
          provider_job_id: 'job-ext-conformance-123',
        });
        expect(result).toBeDefined();
        expect(result.provider_job_id).toBe('job-ext-conformance-123');
        expect(['QUEUED', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED']).toContain(result.generation_status);
        expect(result.progress_percent).toBeGreaterThanOrEqual(0);
        expect(result.progress_percent).toBeLessThanOrEqual(100);
      });
    });

    describe('Operation 8: DOWNLOAD_OUTPUT', () => {
      it('should download rendered output artifact and return media metadata', async () => {
        const result = await port.downloadOutput({
          provider_job_id: 'job-ext-conformance-123',
          destination_storage_uri: 'https://storage.aivideofactory.com/takes/take-01.mp4',
        });
        expect(result).toBeDefined();
        expect(result.provider_job_id).toBe('job-ext-conformance-123');
        expect(result.output_uri).toBe('https://storage.aivideofactory.com/takes/take-01.mp4');
        expect(result.byte_size).toBeGreaterThan(0);
        expect(result.checksum_sha256).toMatch(/^[0-9a-fA-F]{64}$/);
        expect(result.duration_ms).toBeGreaterThanOrEqual(100);
      });
    });

    describe('Operation 9: CAPTURE_DIAGNOSTIC', () => {
      it('should capture diagnostics and bundle package', async () => {
        const result = await port.captureDiagnostic({
          destination_diagnostic_uri: 'https://storage.aivideofactory.com/diagnostics/diag-01.zip',
          include_screenshot: true,
          include_har: true,
          include_console_logs: true,
        });
        expect(result).toBeDefined();
        expect(result.diagnostic_package_uri).toBe('https://storage.aivideofactory.com/diagnostics/diag-01.zip');
        expect(typeof result.screenshot_captured).toBe('boolean');
        expect(typeof result.console_log_count).toBe('number');
      });
    });

    describe('Operation 10: CANCEL', () => {
      it('should abort ongoing generation', async () => {
        const result = await port.cancel({
          provider_job_id: 'job-ext-conformance-123',
          reason: 'Conformance test cancellation',
        });
        expect(result).toBeDefined();
        expect(result.provider_job_id).toBe('job-ext-conformance-123');
        expect(result.cancelled).toBe(true);
      });
    });
  });
}
