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
