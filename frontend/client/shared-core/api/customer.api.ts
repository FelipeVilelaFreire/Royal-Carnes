import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type { ClientCustomerDto, ClientCustomerView } from "../contracts/customer.contract";
import { mapClientCustomerDto } from "../mappers/customer.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createClientCustomerApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async me(): Promise<ClientCustomerDto> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/customers/me/"), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return (await response.json()) as ClientCustomerDto;
    },
    async createAddress(input: Record<string, unknown>): Promise<NonNullable<ClientCustomerDto["addresses"]>[number]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/customers/me/addresses/"), {
        method: "POST",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify(input),
      });

      await throwIfApiError(response);
      return (await response.json()) as NonNullable<ClientCustomerDto["addresses"]>[number];
    },
    async update(input: Record<string, unknown>): Promise<ClientCustomerDto> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/customers/me/"), {
        method: "PATCH",
        headers: buildApiHeaders({ token: config.getAccessToken?.(), organizationSlug: config.organizationSlug }),
        body: JSON.stringify(input),
      });
      await throwIfApiError(response);
      return (await response.json()) as ClientCustomerDto;
    },
    async detail(customerId: string | number): Promise<ClientCustomerView> {
      const response = await fetcher(resolveUrl(config.baseUrl, `/api/v1/customers/${customerId}/`), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return mapClientCustomerDto((await response.json()) as ClientCustomerDto);
    },
  };
}

export const clientCustomerApi = createClientCustomerApi();
