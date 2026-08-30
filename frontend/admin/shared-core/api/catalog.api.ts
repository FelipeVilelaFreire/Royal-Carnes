import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminCollectionDto,
  AdminCollectionView,
  AdminCommercialModeDto,
  AdminCommercialModeView,
  AdminProductDto,
  AdminProductFormInput,
  AdminProductView,
} from "../contracts/catalog.contract";
import {
  mapAdminCollectionDto,
  mapAdminCommercialModeDto,
  mapAdminProductDto,
  mapAdminProductFormInput,
} from "../mappers/catalog.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminCatalogApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async listCollections(): Promise<AdminCollectionView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/catalog/collections/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminCollectionDto[]).map(mapAdminCollectionDto);
    },
    async listCommercialModes(): Promise<AdminCommercialModeView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/commercial-modes/"),
        {
          headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminCommercialModeDto[]).map(mapAdminCommercialModeDto);
    },
    async listProducts(): Promise<AdminProductView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/products/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminProductDto[]).map(mapAdminProductDto);
    },
    async detail(productId: string | number): Promise<AdminProductView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/catalog/products/${productId}/`),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return mapAdminProductDto((await response.json()) as AdminProductDto);
    },
    async create(input: AdminProductFormInput): Promise<AdminProductView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/products/"),
        {
          method: "POST",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify(mapAdminProductFormInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminProductDto((await response.json()) as AdminProductDto);
    },
  };
}

export const adminCatalogApi = createAdminCatalogApi();
