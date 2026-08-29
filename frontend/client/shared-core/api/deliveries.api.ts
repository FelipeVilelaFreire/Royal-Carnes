import { API_BASE_URL } from "../../../shared-core/config";
import type {
  DeliveryConfigResponse,
  DeliveryDto
} from "../contracts/delivery.contract";

const DEFAULT_ORGANIZATION_SLUG = "royalprime";

export interface RequestOptions {
  accessToken?: string;
  organizationSlug?: string;
}

function headers(options: RequestOptions = {}) {
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Organization-Slug": options.organizationSlug || DEFAULT_ORGANIZATION_SLUG
  };
  if (options.accessToken) {
    requestHeaders.Authorization = `Bearer ${options.accessToken}`;
  }
  return requestHeaders;
}

async function requestJson<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...headers(options),
      ...(init.headers || {})
    }
  });
  if (!response.ok) {
    throw new Error(`deliveries_api_${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getDeliveryConfig(options: RequestOptions = {}): Promise<DeliveryConfigResponse> {
  return await requestJson<DeliveryConfigResponse>("/deliveries/config/", {}, options);
}

export async function getMyDeliveries(options: RequestOptions = {}): Promise<DeliveryDto[]> {
  return await requestJson<DeliveryDto[]>("/deliveries/me/", {}, options);
}

export async function getMyDeliveryById(id: string, options: RequestOptions = {}): Promise<DeliveryDto | null> {
  return await requestJson<DeliveryDto>(`/deliveries/me/${id}/`, {}, options);
}
