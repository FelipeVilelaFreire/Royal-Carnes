import type { ApiRequestOptions } from "../types/api.types";

export function buildAuthHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function buildOrganizationHeaders(
  organizationSlug?: string | null,
): HeadersInit {
  return organizationSlug ? { "X-Organization-Slug": organizationSlug } : {};
}

export function buildApiHeaders(options: ApiRequestOptions = {}): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...buildAuthHeaders(options.token),
    ...buildOrganizationHeaders(options.organizationSlug),
    ...options.headers,
  };
}

