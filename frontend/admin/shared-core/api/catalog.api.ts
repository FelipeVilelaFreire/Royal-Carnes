import {
  buildAuthHeaders,
  buildApiHeaders,
  buildOrganizationHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminCategoryDto,
  AdminCategoryFormInput,
  AdminCategoryUpdateInput,
  AdminCategoryView,
  AdminCollectionDto,
  AdminCollectionView,
  AdminCommercialModeDto,
  AdminCommercialModeView,
  AdminMeasurementUnitDto,
  AdminMeasurementUnitView,
  AdminProductDto,
  AdminProductFormInput,
  AdminProductUpdateInput,
  AdminProductView,
} from "../contracts/catalog.contract";
import {
  mapAdminCategoryDto,
  mapAdminCategoryUpdateInput,
  mapAdminCollectionDto,
  mapAdminCommercialModeDto,
  mapAdminMeasurementUnitDto,
  mapAdminProductDto,
  mapAdminProductFormInput,
} from "../mappers/catalog.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminCatalogApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async uploadMedia(file: File): Promise<{ url: string }> {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/uploads/media/"),
        {
          method: "POST",
          headers: {
            ...buildAuthHeaders(config.getAccessToken?.()),
            ...buildOrganizationHeaders(config.organizationSlug),
          },
          body: formData,
        },
      );

      await throwIfApiError(response);
      return (await response.json()) as { url: string };
    },
    async listCollections(): Promise<AdminCollectionView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/catalog/collections/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminCollectionDto[]).map(mapAdminCollectionDto);
    },
    async listAdminCollections(): Promise<AdminCollectionView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/collections/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

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
    async listCategories(): Promise<AdminCategoryView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/catalog/categories/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as AdminCategoryDto[]).map(mapAdminCategoryDto);
    },
    async listAdminCategories(): Promise<AdminCategoryView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/categories/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminCategoryDto[]).map(mapAdminCategoryDto);
    },
    async createCategory(input: AdminCategoryFormInput): Promise<AdminCategoryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/admin/categories/"),
        {
          method: "POST",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify(mapAdminCategoryUpdateInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminCategoryDto((await response.json()) as AdminCategoryDto);
    },
    async categoryDetail(categoryId: string | number): Promise<AdminCategoryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/catalog/admin/categories/${categoryId}/`),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return mapAdminCategoryDto((await response.json()) as AdminCategoryDto);
    },
    async updateCategory(categoryId: string | number, input: AdminCategoryUpdateInput): Promise<AdminCategoryView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/catalog/admin/categories/${categoryId}/`),
        {
          method: "PATCH",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify(mapAdminCategoryUpdateInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminCategoryDto((await response.json()) as AdminCategoryDto);
    },
    async listMeasurementUnits(): Promise<AdminMeasurementUnitView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/catalog/measurement-units/"),
        {
          headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminMeasurementUnitDto[]).map(mapAdminMeasurementUnitDto);
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
    async update(productId: string | number, input: AdminProductUpdateInput): Promise<AdminProductView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/catalog/admin/products/${productId}/`),
        {
          method: "PATCH",
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
