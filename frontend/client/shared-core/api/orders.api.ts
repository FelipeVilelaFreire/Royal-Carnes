import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  ClientOrderConfigDto,
  ClientOrderConfigView,
  ClientOrderCreateInput,
  ClientOrderDto,
  ClientOrderView,
} from "../contracts/orders.contract";
import {
  mapClientOrderConfigDto,
  mapClientOrderCreateInput,
  mapClientOrderDto,
} from "../mappers/orders.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createClientOrdersApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async config(): Promise<ClientOrderConfigView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/config/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return mapClientOrderConfigDto((await response.json()) as ClientOrderConfigDto);
    },
    async listMine(): Promise<ClientOrderView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/me/"), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as ClientOrderDto[]).map(mapClientOrderDto);
    },
    async detail(orderId: string | number): Promise<ClientOrderView> {
      const response = await fetcher(resolveUrl(config.baseUrl, `/api/v1/orders/me/${orderId}/`), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return mapClientOrderDto((await response.json()) as ClientOrderDto);
    },
    async create(input: ClientOrderCreateInput): Promise<ClientOrderView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/me/"), {
        method: "POST",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify(mapClientOrderCreateInput(input)),
      });

      await throwIfApiError(response);
      return mapClientOrderDto((await response.json()) as ClientOrderDto);
    },
  };
}

export const clientOrdersApi = createClientOrdersApi();
