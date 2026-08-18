import { UUID, Timestamp, AspectRatio, VideoResolution, AssetRole } from './domain';
import { NormalizedError } from './errors';

export type FlowCommandType =
  | 'ENSURE_SESSION'
  | 'OPEN_FLOW'
  | 'CREATE_OR_SELECT_PROJECT'
  | 'ATTACH_ASSETS'
  | 'SET_GENERATION_OPTIONS'
  | 'SUBMIT_PROMPT'
  | 'READ_GENERATION_STATE'
  | 'DOWNLOAD_OUTPUT'
  | 'CAPTURE_DIAGNOSTIC'
  | 'CANCEL';

export type FlowExecutionStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'RUNNING';

// -----------------------------------------------------------------------------
// Command Parameter Types (10 Operations)
// -----------------------------------------------------------------------------

export interface EnsureSessionParams {
  account_alias: string;
  headless?: boolean;
  profile_directory?: string;
}

export interface OpenFlowParams {
  flow_url: string;
  wait_for_selector?: string;
}

export interface CreateOrSelectProjectParams {
  project_name: string;
  project_id?: UUID;
}

export interface FlowAssetReference {
  asset_id: UUID;
  storage_uri: string;
  mime_type: string;
  role: AssetRole;
}

export interface AttachAssetsParams {
  assets: FlowAssetReference[];
}

export interface SetGenerationOptionsParams {
  aspect_ratio: AspectRatio;
  resolution?: VideoResolution;
  duration_seconds?: number;
  seed?: number;
  model_version?: string;
}

export interface SubmitPromptParams {
  prompt_text: string;
  negative_prompt?: string;
  idempotency_key: string;
  attempt_index?: number;
}

export interface ReadGenerationStateParams {
  provider_job_id: string;
}

export interface DownloadOutputParams {
  provider_job_id: string;
  destination_storage_uri: string;
}

export interface CaptureDiagnosticParams {
  destination_diagnostic_uri: string;
  include_screenshot?: boolean;
  include_har?: boolean;
  include_console_logs?: boolean;
}

export interface CancelParams {
  provider_job_id: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// Discriminated FlowCommand Interfaces
// -----------------------------------------------------------------------------

export interface BaseFlowCommand {
  command_id: UUID;
  session_id: string;
  timestamp_utc: Timestamp;
  timeout_ms?: number;
}

export interface EnsureSessionCommand extends BaseFlowCommand {
  command_type: 'ENSURE_SESSION';
  params: EnsureSessionParams;
}

export interface OpenFlowCommand extends BaseFlowCommand {
  command_type: 'OPEN_FLOW';
  params: OpenFlowParams;
}

export interface CreateOrSelectProjectCommand extends BaseFlowCommand {
  command_type: 'CREATE_OR_SELECT_PROJECT';
  params: CreateOrSelectProjectParams;
}

export interface AttachAssetsCommand extends BaseFlowCommand {
  command_type: 'ATTACH_ASSETS';
  params: AttachAssetsParams;
}

export interface SetGenerationOptionsCommand extends BaseFlowCommand {
  command_type: 'SET_GENERATION_OPTIONS';
  params: SetGenerationOptionsParams;
}

export interface SubmitPromptCommand extends BaseFlowCommand {
  command_type: 'SUBMIT_PROMPT';
  params: SubmitPromptParams;
}

export interface ReadGenerationStateCommand extends BaseFlowCommand {
  command_type: 'READ_GENERATION_STATE';
  params: ReadGenerationStateParams;
}

export interface DownloadOutputCommand extends BaseFlowCommand {
  command_type: 'DOWNLOAD_OUTPUT';
  params: DownloadOutputParams;
}

export interface CaptureDiagnosticCommand extends BaseFlowCommand {
  command_type: 'CAPTURE_DIAGNOSTIC';
  params: CaptureDiagnosticParams;
}

export interface CancelCommand extends BaseFlowCommand {
  command_type: 'CANCEL';
  params: CancelParams;
}

export type FlowCommand =
  | EnsureSessionCommand
  | OpenFlowCommand
  | CreateOrSelectProjectCommand
  | AttachAssetsCommand
  | SetGenerationOptionsCommand
  | SubmitPromptCommand
  | ReadGenerationStateCommand
  | DownloadOutputCommand
  | CaptureDiagnosticCommand
  | CancelCommand;

// -----------------------------------------------------------------------------
// Operation Specific Result Payloads
// -----------------------------------------------------------------------------

export interface EnsureSessionResult {
  session_active: boolean;
  account_alias: string;
  authenticated: boolean;
}

export interface OpenFlowResult {
  ready: boolean;
  page_title?: string;
  flow_version?: string;
}

export interface CreateOrSelectProjectResult {
  project_id: UUID;
  project_name: string;
  created_new: boolean;
}

export interface AttachAssetsResult {
  attached_count: number;
  asset_ids: UUID[];
}

export interface SetGenerationOptionsResult {
  options_applied: boolean;
  effective_aspect_ratio: AspectRatio;
  effective_resolution?: VideoResolution;
}

export interface SubmitPromptResult {
  provider_job_id: string;
  submitted_at: Timestamp;
  status: 'QUEUED' | 'PROCESSING';
}

export interface ReadGenerationStateResult {
  provider_job_id: string;
  generation_status: 'QUEUED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  progress_percent: number;
  error_detail?: string;
}

export interface DownloadOutputResult {
  provider_job_id: string;
  output_uri: string;
  byte_size: number;
  checksum_sha256: string;
  duration_ms: number;
}

export interface CaptureDiagnosticResult {
  diagnostic_package_uri: string;
  screenshot_captured: boolean;
  console_log_count: number;
}

export interface CancelResult {
  provider_job_id: string;
  cancelled: boolean;
}

// -----------------------------------------------------------------------------
// Generic Discriminated Result Map & Union
// -----------------------------------------------------------------------------

export interface FlowExecutionResultMap {
  ENSURE_SESSION: EnsureSessionResult;
  OPEN_FLOW: OpenFlowResult;
  CREATE_OR_SELECT_PROJECT: CreateOrSelectProjectResult;
  ATTACH_ASSETS: AttachAssetsResult;
  SET_GENERATION_OPTIONS: SetGenerationOptionsResult;
  SUBMIT_PROMPT: SubmitPromptResult;
  READ_GENERATION_STATE: ReadGenerationStateResult;
  DOWNLOAD_OUTPUT: DownloadOutputResult;
  CAPTURE_DIAGNOSTIC: CaptureDiagnosticResult;
  CANCEL: CancelResult;
}

export interface FlowExecutionResult<TType extends FlowCommandType = FlowCommandType> {
  command_id: UUID;
  session_id: string;
  command_type: TType;
  status: FlowExecutionStatus;
  timestamp_utc: Timestamp;
  duration_ms?: number;
  result?: FlowExecutionResultMap[TType];
  error?: NormalizedError;
}
