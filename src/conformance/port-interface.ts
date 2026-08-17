import {
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
} from '../types/flow';

/**
 * Standard FlowExecutionPort interface for Track A (Browser Worker) and Track B (FlowKit Bridge).
 * Enforces semantic equivalence and 100% interoperability across both execution tracks.
 */
export interface FlowExecutionPort {
  /**
   * Operation 1: Ensure browser session is active and authenticated.
   */
  ensureSession(params: EnsureSessionParams): Promise<EnsureSessionResult>;

  /**
   * Operation 2: Navigate to target Flow workspace URL.
   */
  openFlow(params: OpenFlowParams): Promise<OpenFlowResult>;

  /**
   * Operation 3: Create or select project container.
   */
  createOrSelectProject(params: CreateOrSelectProjectParams): Promise<CreateOrSelectProjectResult>;

  /**
   * Operation 4: Upload and attach media reference assets.
   */
  attachAssets(params: AttachAssetsParams): Promise<AttachAssetsResult>;

  /**
   * Operation 5: Configure generation aspect ratio, resolution, duration, seed.
   */
  setGenerationOptions(params: SetGenerationOptionsParams): Promise<SetGenerationOptionsResult>;

  /**
   * Operation 6: Submit video prompt text with idempotency key.
   */
  submitPrompt(params: SubmitPromptParams): Promise<SubmitPromptResult>;

  /**
   * Operation 7: Poll or inspect generation progress and status.
   */
  readGenerationState(params: ReadGenerationStateParams): Promise<ReadGenerationStateResult>;

  /**
   * Operation 8: Download rendered output video artifact to storage destination.
   */
  downloadOutput(params: DownloadOutputParams): Promise<DownloadOutputResult>;

  /**
   * Operation 9: Capture screenshots, DOM state, and network logs for diagnostics.
   */
  captureDiagnostic(params: CaptureDiagnosticParams): Promise<CaptureDiagnosticResult>;

  /**
   * Operation 10: Abort or cancel an ongoing generation operation.
   */
  cancel(params: CancelParams): Promise<CancelResult>;

  /**
   * Generic command dispatcher accepting any valid FlowCommand envelope.
   */
  executeCommand(command: FlowCommand): Promise<FlowExecutionResult>;
}
