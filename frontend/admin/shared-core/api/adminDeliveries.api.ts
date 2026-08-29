import { API_BASE_URL } from "../../../shared-core/config";
import type { AdminDelivery } from "../contracts/admin-delivery.contract";

const DEFAULT_ORGANIZATION_SLUG = "royalprime";

export interface AdminRequestOptions {
  accessToken?: string;
  organizationSlug?: string;
}

function headers(options: AdminRequestOptions = {}) {
  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Organization-Slug": options.organizationSlug || DEFAULT_ORGANIZATION_SLUG
  };
  if (options.accessToken) {
    reqHeaders.Authorization = `Bearer ${options.accessToken}`;
  }
  return reqHeaders;
}

export async function getAdminDeliveries(options: AdminRequestOptions = {}): Promise<AdminDelivery[]> {
  const response = await fetch(`${API_BASE_URL}/deliveries/admin/deliveries/`, {
    headers: headers(options)
  });
  if (!response.ok) {
    throw new Error(`admin_deliveries_api_${response.status}`);
  }
  return response.json();
}
