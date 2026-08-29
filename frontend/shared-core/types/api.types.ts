export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiErrorEnvelope {
  code: string;
  message?: string;
  detail?: unknown;
  status?: number;
}

export interface ApiRequestOptions extends RequestInit {
  token?: string | null;
  organizationSlug?: string | null;
}

export interface ApiClientConfig {
  baseUrl?: string;
  fetcher?: typeof fetch;
  organizationSlug?: string;
  getAccessToken?: () => string | null | undefined;
}

