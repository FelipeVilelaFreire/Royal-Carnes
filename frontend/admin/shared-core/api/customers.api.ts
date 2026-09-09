import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminCustomerCreateInput,
  AdminCustomerDto,
  AdminCustomerUpdateInput,
  AdminCustomerView,
} from "../contracts/customers.contract";
import {
  mapAdminCustomerCreateInput,
  mapAdminCustomerDto,
  mapAdminCustomerUpdateInput,
} from "../mappers/customers.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function buildAdminCustomersHeaders(config: ApiClientConfig) {
  return buildApiHeaders({
    token: config.getAccessToken?.(),
    organizationSlug: config.organizationSlug,
  });
}

export function createAdminCustomersApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async list(): Promise<AdminCustomerView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/customers/"), {
        headers: buildAdminCustomersHeaders(config),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminCustomerDto[]).map(mapAdminCustomerDto);
    },
    async detail(customerId: string | number): Promise<AdminCustomerView> {
      const response = await fetcher(resolveUrl(config.baseUrl, `/api/v1/customers/${customerId}/`), {
        headers: buildAdminCustomersHeaders(config),
      });

      await throwIfApiError(response);
      return mapAdminCustomerDto((await response.json()) as AdminCustomerDto);
    },
    async create(input: AdminCustomerCreateInput): Promise<AdminCustomerView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/customers/"), {
        body: JSON.stringify(mapAdminCustomerCreateInput(input)),
        headers: buildAdminCustomersHeaders(config),
        method: "POST",
      });

      await throwIfApiError(response);
      return mapAdminCustomerDto((await response.json()) as AdminCustomerDto);
    },
    async update(customerId: string | number, input: AdminCustomerUpdateInput): Promise<AdminCustomerView> {
      const response = await fetcher(resolveUrl(config.baseUrl, `/api/v1/customers/${customerId}/`), {
        body: JSON.stringify(mapAdminCustomerUpdateInput(input)),
        headers: buildAdminCustomersHeaders(config),
        method: "PATCH",
      });

      await throwIfApiError(response);
      return mapAdminCustomerDto((await response.json()) as AdminCustomerDto);
    },
  };
}

export const adminCustomersApi = createAdminCustomersApi();
