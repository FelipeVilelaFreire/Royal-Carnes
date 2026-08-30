import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminOrderConfigDto,
  AdminOrderConfigView,
  AdminOrderCreateInput,
  AdminOrderDto,
  AdminOrderTransitionInput,
  AdminOrderView,
} from "../contracts/orders.contract";
import {
  mapAdminOrderConfigDto,
  mapAdminOrderCreateInput,
  mapAdminOrderDto,
  mapAdminOrderTransitionInput,
} from "../mappers/orders.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function buildAdminOrdersHeaders(config: ApiClientConfig) {
  return buildApiHeaders({
    token: config.getAccessToken?.(),
    organizationSlug: config.organizationSlug,
  });
}

export function createAdminOrdersApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async config(): Promise<AdminOrderConfigView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/config/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return mapAdminOrderConfigDto((await response.json()) as AdminOrderConfigDto);
    },
    async list(): Promise<AdminOrderView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/admin/orders/"), {
        headers: buildAdminOrdersHeaders(config),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminOrderDto[]).map(mapAdminOrderDto);
    },
    async detail(orderId: string | number): Promise<AdminOrderView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/orders/admin/orders/${orderId}/`),
        {
          headers: buildAdminOrdersHeaders(config),
        },
      );

      await throwIfApiError(response);
      return mapAdminOrderDto((await response.json()) as AdminOrderDto);
    },
    async create(input: AdminOrderCreateInput): Promise<AdminOrderView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/orders/admin/orders/"), {
        method: "POST",
        headers: buildAdminOrdersHeaders(config),
        body: JSON.stringify(mapAdminOrderCreateInput(input)),
      });

      await throwIfApiError(response);
      return mapAdminOrderDto((await response.json()) as AdminOrderDto);
    },
    async transition(
      orderId: string | number,
      input: AdminOrderTransitionInput,
    ): Promise<AdminOrderView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/orders/admin/orders/${orderId}/transition/`),
        {
          method: "POST",
          headers: buildAdminOrdersHeaders(config),
          body: JSON.stringify(mapAdminOrderTransitionInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminOrderDto((await response.json()) as AdminOrderDto);
    },
  };
}

export const adminOrdersApi = createAdminOrdersApi();
