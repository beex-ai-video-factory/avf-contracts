import {
  FlowExecutionPort,
  EnsureSessionParams,
  EnsureSessionResult,
  OpenFlowParams,
  OpenFlowResult,
  CreateOrSelectProjectParams,
  CreateOrSelectProjectResult,
  AttachAssetsParams,
  AttachAssetsResult,
  SetGenerationOptionsParams,
  SetGenerationOptionsResult,
  SubmitPromptParams,
  SubmitPromptResult,
  ReadGenerationStateParams,
  ReadGenerationStateResult,
  DownloadOutputParams,
  DownloadOutputResult,
  CaptureDiagnosticParams,
  CaptureDiagnosticResult,
  CancelParams,
  CancelResult,
  FlowCommand,
  FlowExecutionResult,
  defineFlowExecutionPortConformanceSuite,
} from '../src';

class MockFlowExecutionPort implements FlowExecutionPort {
  async ensureSession(params: EnsureSessionParams): Promise<EnsureSessionResult> {
    return {
      session_active: true,
      account_alias: params.account_alias,
      authenticated: true,
    };
  }

  async openFlow(_params: OpenFlowParams): Promise<OpenFlowResult> {
    return {
      ready: true,
      page_title: 'Google Flow Workspace',
      flow_version: 'v2.1',
    };
  }

  async createOrSelectProject(params: CreateOrSelectProjectParams): Promise<CreateOrSelectProjectResult> {
    return {
      project_id: params.project_id || 'b0000000-0000-4000-8000-000000000001',
      project_name: params.project_name,
      created_new: true,
    };
  }

  async attachAssets(params: AttachAssetsParams): Promise<AttachAssetsResult> {
    return {
      attached_count: params.assets.length,
      asset_ids: params.assets.map(a => a.asset_id),
    };
  }

  async setGenerationOptions(params: SetGenerationOptionsParams): Promise<SetGenerationOptionsResult> {
    return {
      options_applied: true,
      effective_aspect_ratio: params.aspect_ratio,
      effective_resolution: params.resolution,
    };
  }

  async submitPrompt(_params: SubmitPromptParams): Promise<SubmitPromptResult> {
    return {
      provider_job_id: 'mock-provider-job-12345',
      submitted_at: new Date().toISOString(),
      status: 'QUEUED',
    };
  }

  async readGenerationState(params: ReadGenerationStateParams): Promise<ReadGenerationStateResult> {
    return {
      provider_job_id: params.provider_job_id,
      generation_status: 'SUCCEEDED',
      progress_percent: 100,
    };
  }

  async downloadOutput(params: DownloadOutputParams): Promise<DownloadOutputResult> {
    return {
      provider_job_id: params.provider_job_id,
      output_uri: params.destination_storage_uri,
      byte_size: 10485760,
      checksum_sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      duration_ms: 5000,
    };
  }

  async captureDiagnostic(params: CaptureDiagnosticParams): Promise<CaptureDiagnosticResult> {
    return {
      diagnostic_package_uri: params.destination_diagnostic_uri,
      screenshot_captured: params.include_screenshot ?? true,
      console_log_count: 12,
    };
  }

  async cancel(params: CancelParams): Promise<CancelResult> {
    return {
      provider_job_id: params.provider_job_id,
      cancelled: true,
    };
  }

  async executeCommand(command: FlowCommand): Promise<FlowExecutionResult> {
    switch (command.command_type) {
      case 'ENSURE_SESSION': {
        const res = await this.ensureSession(command.params);
        return {
          command_id: command.command_id,
          session_id: command.session_id,
          command_type: 'ENSURE_SESSION',
          status: 'SUCCESS',
          timestamp_utc: new Date().toISOString(),
          duration_ms: 100,
          result: res,
        };
      }
      default:
        return {
          command_id: command.command_id,
          session_id: command.session_id,
          command_type: command.command_type,
          status: 'SUCCESS',
          timestamp_utc: new Date().toISOString(),
          duration_ms: 50,
        };
    }
  }
}

// Run standard conformance test suite without options (default)
defineFlowExecutionPortConformanceSuite(() => new MockFlowExecutionPort());

// Run standard conformance test suite with explicit options
defineFlowExecutionPortConformanceSuite(() => new MockFlowExecutionPort(), {
  trackName: 'TRACK_A_BROWSER',
});
