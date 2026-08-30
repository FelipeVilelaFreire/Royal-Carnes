import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminInventoryAdjustmentInput,
  AdminInventoryItemDto,
  AdminInventoryItemFormInput,
  AdminInventoryItemView,
  AdminInventoryMovementDto,
  AdminInventoryMovementView,
} from "../contracts/inventory.contract";
import {
  mapAdminInventoryAdjustmentInput,
  mapAdminInventoryItemDto,
  mapAdminInventoryItemFormInput,
  mapAdminInventoryMovementDto,
} from "../mappers/inventory.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function buildAdminInventoryHeaders(config: ApiClientConfig) {
  return buildApiHeaders({
    token: config.getAccessToken?.(),
    organizationSlug: config.organizationSlug,
  });
}

export function createAdminInventoryApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async listItems(): Promise<AdminInventoryItemView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/inventory/admin/items/"), {
        headers: buildAdminInventoryHeaders(config),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminInventoryItemDto[]).map(mapAdminInventoryItemDto);
    },
    async detail(itemId: string | number): Promise<AdminInventoryItemView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/inventory/admin/items/${itemId}/`),
        {
          headers: buildAdminInventoryHeaders(config),
        },
      );

      await throwIfApiError(response);
      return mapAdminInventoryItemDto((await response.json()) as AdminInventoryItemDto);
    },
    async create(input: AdminInventoryItemFormInput): Promise<AdminInventoryItemView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/inventory/admin/items/"), {
        method: "POST",
        headers: buildAdminInventoryHeaders(config),
        body: JSON.stringify(mapAdminInventoryItemFormInput(input)),
      });

      await throwIfApiError(response);
      return mapAdminInventoryItemDto((await response.json()) as AdminInventoryItemDto);
    },
    async adjust(
      itemId: string | number,
      input: AdminInventoryAdjustmentInput,
    ): Promise<AdminInventoryItemView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/inventory/admin/items/${itemId}/adjust/`),
        {
          method: "POST",
          headers: buildAdminInventoryHeaders(config),
          body: JSON.stringify(mapAdminInventoryAdjustmentInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminInventoryItemDto((await response.json()) as AdminInventoryItemDto);
    },
    async listMovements(itemId: string | number): Promise<AdminInventoryMovementView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/inventory/admin/items/${itemId}/movements/`),
        {
          headers: buildAdminInventoryHeaders(config),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminInventoryMovementDto[]).map(
        mapAdminInventoryMovementDto,
      );
    },
  };
}

export const adminInventoryApi = createAdminInventoryApi();
