import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  ClientCollectionDto,
  ClientCollectionView,
  ClientCommercialModeDto,
  ClientCommercialModeView,
  ClientProductDto,
  ClientProductView,
} from "../contracts/catalog.contract";
import {
  mapClientCollectionDto,
  mapClientCommercialModeDto,
  mapClientProductDto,
} from "../mappers/catalog.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createClientCatalogApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async listCollections(): Promise<ClientCollectionView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/catalog/collections/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as ClientCollectionDto[]).map(mapClientCollectionDto);
    },
    async listCommercialModes(): Promise<ClientCommercialModeView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/commercial-modes/"),
        {
          headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as ClientCommercialModeDto[]).map(mapClientCommercialModeDto);
    },
    async listProducts(): Promise<ClientProductView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/catalog/products/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as ClientProductDto[]).map(mapClientProductDto);
    },
    async detail(productId: string | number): Promise<ClientProductView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/catalog/products/${productId}/`),
        {
          headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
        },
      );

      await throwIfApiError(response);
      return mapClientProductDto((await response.json()) as ClientProductDto);
    },
  };
}

export const clientCatalogApi = createClientCatalogApi();
