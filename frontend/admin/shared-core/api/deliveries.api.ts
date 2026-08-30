import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminDeliveryConfigDto,
  AdminDeliveryConfigView,
  AdminDeliveryConfirmInput,
  AdminDeliveryCreateInput,
  AdminDeliveryDto,
  AdminDeliveryTransitionInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import {
  mapAdminDeliveryConfigDto,
  mapAdminDeliveryConfirmInput,
  mapAdminDeliveryCreateInput,
  mapAdminDeliveryDto,
  mapAdminDeliveryTransitionInput,
} from "../mappers/deliveries.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function buildAdminDeliveriesHeaders(config: ApiClientConfig) {
  return buildApiHeaders({
    token: config.getAccessToken?.(),
    organizationSlug: config.organizationSlug,
  });
}

export function createAdminDeliveriesApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async config(): Promise<AdminDeliveryConfigView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/deliveries/config/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return mapAdminDeliveryConfigDto((await response.json()) as AdminDeliveryConfigDto);
    },
    async list(): Promise<AdminDeliveryView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/deliveries/admin/deliveries/"),
        {
          headers: buildAdminDeliveriesHeaders(config),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminDeliveryDto[]).map(mapAdminDeliveryDto);
    },
    async detail(deliveryId: string | number): Promise<AdminDeliveryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/deliveries/admin/deliveries/${deliveryId}/`),
        {
          headers: buildAdminDeliveriesHeaders(config),
        },
      );

      await throwIfApiError(response);
      return mapAdminDeliveryDto((await response.json()) as AdminDeliveryDto);
    },
    async create(input: AdminDeliveryCreateInput): Promise<AdminDeliveryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/deliveries/admin/deliveries/"),
        {
          method: "POST",
          headers: buildAdminDeliveriesHeaders(config),
          body: JSON.stringify(mapAdminDeliveryCreateInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminDeliveryDto((await response.json()) as AdminDeliveryDto);
    },
    async transition(
      deliveryId: string | number,
      input: AdminDeliveryTransitionInput,
    ): Promise<AdminDeliveryView> {
      const response = await fetcher(
        resolveUrl(
          config.baseUrl,
          `/api/v1/deliveries/admin/deliveries/${deliveryId}/transition/`,
        ),
        {
          method: "POST",
          headers: buildAdminDeliveriesHeaders(config),
          body: JSON.stringify(mapAdminDeliveryTransitionInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminDeliveryDto((await response.json()) as AdminDeliveryDto);
    },
    async confirm(
      deliveryId: string | number,
      input: AdminDeliveryConfirmInput,
    ): Promise<AdminDeliveryView> {
      const response = await fetcher(
        resolveUrl(
          config.baseUrl,
          `/api/v1/deliveries/admin/deliveries/${deliveryId}/confirm/`,
        ),
        {
          method: "POST",
          headers: buildAdminDeliveriesHeaders(config),
          body: JSON.stringify(mapAdminDeliveryConfirmInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminDeliveryDto((await response.json()) as AdminDeliveryDto);
    },
  };
}

export const adminDeliveriesApi = createAdminDeliveriesApi();
