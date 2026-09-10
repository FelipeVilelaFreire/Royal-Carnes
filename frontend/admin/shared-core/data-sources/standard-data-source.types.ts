import type { ApiErrorEnvelope } from "../../../shared-core";
import type { AdminStandardOptionSources } from "../view-models/standard.view-model";

export interface AdminStandardDataSourceConfig {
  key: string;
  fallbackOnError?: boolean;
}

export interface AdminStandardDataSourceResult {
  error: ApiErrorEnvelope | null;
  isFallback: boolean;
  rows: any[] | null;
}

export interface AdminStandardMutationResult {
  error: ApiErrorEnvelope | null;
  row: any | null;
}

export interface AdminStandardOptionSourceResult {
  error: ApiErrorEnvelope | null;
  optionSources: AdminStandardOptionSources;
}
