import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  ClientDeliveryConfigDto,
  ClientDeliveryConfigView,
  ClientDeliveryDto,
  ClientDeliveryView,
} from "../contracts/deliveries.contract";
import {
  mapClientDeliveryConfigDto,
  mapClientDeliveryDto,
} from "../mappers/deliveries.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createClientDeliveriesApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async config(): Promise<ClientDeliveryConfigView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/deliveries/config/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return mapClientDeliveryConfigDto((await response.json()) as ClientDeliveryConfigDto);
    },
    async listMine(): Promise<ClientDeliveryView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/deliveries/me/"), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as ClientDeliveryDto[]).map(mapClientDeliveryDto);
    },
    async detail(deliveryId: string | number): Promise<ClientDeliveryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/deliveries/me/${deliveryId}/`),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return mapClientDeliveryDto((await response.json()) as ClientDeliveryDto);
    },
  };
}

export const clientDeliveriesApi = createClientDeliveriesApi();
