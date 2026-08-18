import { CanonicalLifecycleStatus, ExecutionStage } from './state-machine';
import { NormalizedError } from './errors';

export type UUID = string;
export type Timestamp = string;

export type AspectRatio = '16:9' | '9:16' | '1:1' | '2.39:1';
export type VideoResolution = '720p' | '1080p' | '4k';
export type FlowTrack = 'TRACK_A_EXTENSION' | 'TRACK_A_PLAYWRIGHT' | 'TRACK_B_FLOWKIT';
export type VideoMimeType = 'video/mp4' | 'video/webm' | 'video/quicktime';
export type QcStatus = 'PENDING' | 'PASSED' | 'REJECTED';
export type SourceType = 'USER_UPLOAD' | 'AI_GENERATED' | 'STOCK_LIBRARY' | 'SYNTHETIC';
export type AssetRole = 'CHARACTER' | 'STYLE' | 'START_FRAME' | 'END_FRAME' | 'GENERAL';

export interface Project {
  project_id: UUID;
  title: string;
  description?: string;
  aspect_ratio?: AspectRatio;
  default_provider?: string;
  created_at: Timestamp;
  updated_at?: Timestamp;
  entity_version: number;
}

export interface Shot {
  shot_id: UUID;
  project_id: UUID;
  shot_number: number;
  title?: string;
  current_version_id?: UUID;
  created_at: Timestamp;
  updated_at?: Timestamp;
  entity_version: number;
}

export interface ShotVersion {
  shot_version_id: UUID;
  shot_id: UUID;
  version_number: number;
  duration_ms: number;
  action_description: string;
  camera_motion?: string;
  environment_settings?: string;
  character_refs?: UUID[];
  style_refs?: UUID[];
  asset_refs?: UUID[];
  constraints?: string[];
  continuity_refs?: UUID[];
  created_at: Timestamp;
}

export interface PromptVersion {
  prompt_version_id: UUID;
  shot_id: UUID;
  shot_version_id: UUID;
  version_number: number;
  target_provider: string;
  positive_prompt: string;
  negative_prompt?: string;
  parameters?: Record<string, unknown>;
  ast_snapshot?: Record<string, unknown>;
  created_at: Timestamp;
}

export interface GenerationJob {
  job_id: UUID;
  project_id: UUID;
  shot_id: UUID;
  shot_version_id: UUID;
  prompt_version_id: UUID;
  provider_id: string;
  idempotency_key: string;
  status: CanonicalLifecycleStatus;
  execution_stage?: ExecutionStage;
  attempt_index: number;
  max_attempts?: number;
  provider_job_id?: string;
  flow_track?: FlowTrack;
  lease_token?: UUID;
  lease_expires_at?: Timestamp;
  estimated_cost_credits?: number;
  actual_cost_credits?: number;
  normalized_error?: NormalizedError;
  requested_at: Timestamp;
  submitted_at?: Timestamp;
  completed_at?: Timestamp;
  entity_version: number;
}

export interface Take {
  take_id: UUID;
  shot_id: UUID;
  shot_version_id: UUID;
  prompt_version_id: UUID;
  job_id: UUID;
  take_number: number;
  storage_uri: string;
  mime_type: VideoMimeType | string;
  byte_size: number;
  checksum_sha256: string;
  duration_ms: number;
  qc_status?: QcStatus;
  qc_score?: number;
  created_at: Timestamp;
}

export interface AssetVersion {
  asset_version_id: UUID;
  asset_id: UUID;
  version_number: number;
  storage_uri: string;
  mime_type: string;
  byte_size: number;
  checksum_sha256: string;
  source_type?: SourceType;
  license_type?: string;
  rights_attribution?: string;
  origin_uri?: string;
  created_at: Timestamp;
}

export interface CharacterVersion {
  character_version_id: UUID;
  character_id: UUID;
  name: string;
  description?: string;
  face_embedding_hash?: string;
  reference_asset_ids?: UUID[];
  custom_attributes?: Record<string, unknown>;
  created_at: Timestamp;
}

export interface StyleVersion {
  style_version_id: UUID;
  style_id: UUID;
  name: string;
  lora_weights_uri?: string;
  style_prompt_prefix?: string;
  negative_prompt_additions?: string;
  custom_attributes?: Record<string, unknown>;
  created_at: Timestamp;
}
