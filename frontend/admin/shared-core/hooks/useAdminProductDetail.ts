import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminCatalogApi, type createAdminCatalogApi } from "../api/catalog.api";
import type { AdminProductView } from "../contracts/catalog.contract";
import { createAdminProductRowViewModel } from "../view-models/catalog.view-model";

type AdminCatalogApi = ReturnType<typeof createAdminCatalogApi>;

export interface UseAdminProductDetailOptions {
  api?: AdminCatalogApi;
  initialProduct?: AdminProductView | null;
}

export function useAdminProductDetail(options: UseAdminProductDetailOptions = {}) {
  const api = options.api || adminCatalogApi;
  const [product, setProduct] = useState<AdminProductView | null>(
    options.initialProduct || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(
    async (productId: string | number) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextProduct = await api.detail(productId);
        setProduct(nextProduct);
        return nextProduct;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  return useMemo(
    () => ({
      product,
      viewModel: product ? createAdminProductRowViewModel(product) : null,
      isLoading,
      error,
      load,
    }),
    [error, isLoading, load, product],
  );
}
