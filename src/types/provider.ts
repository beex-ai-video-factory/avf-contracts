import { UUID, Timestamp, AspectRatio, AssetRole } from './domain';
import { NormalizedError } from './errors';

export interface AssetReference {
  asset_id: UUID;
  storage_uri: string;
  mime_type: string;
  role: AssetRole;
}

export interface ProviderRequest {
  request_id: UUID;
  job_id: UUID;
  prompt_version_id: UUID;
  provider_id: string;
  positive_prompt: string;
  negative_prompt?: string;
  aspect_ratio?: AspectRatio;
  duration_seconds?: number;
  seed?: number;
  idempotency_key: string;
  attempt_index?: number;
  asset_references?: AssetReference[];
  provider_parameters?: Record<string, unknown>;
  timestamp_utc: Timestamp;
}

export type ProviderStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'RUNNING';
export type ProviderGenerationStatus = 'QUEUED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';

export interface OutputMetadata {
  mime_type?: string;
  byte_size?: number;
  checksum_sha256?: string;
  duration_ms?: number;
}

export interface ProviderResult {
  request_id: UUID;
  job_id: UUID;
  provider_id: string;
  provider_job_id?: string;
  status: ProviderStatus;
  generation_status?: ProviderGenerationStatus;
  progress_percent?: number;
  output_uri?: string;
  output_metadata?: OutputMetadata;
  cost_credits_used?: number;
  error?: NormalizedError;
  timestamp_utc: Timestamp;
}
