import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { clientCatalogApi, type createClientCatalogApi } from "../api/catalog.api";
import type { ClientProductView } from "../contracts/catalog.contract";
import { createClientProductCardViewModel } from "../view-models/catalog.view-model";

type ClientCatalogApi = ReturnType<typeof createClientCatalogApi>;

export interface UseClientProductDetailOptions {
  api?: ClientCatalogApi;
  initialProduct?: ClientProductView | null;
}

export function useClientProductDetail(options: UseClientProductDetailOptions = {}) {
  const api = options.api || clientCatalogApi;
  const [product, setProduct] = useState<ClientProductView | null>(
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
      viewModel: product ? createClientProductCardViewModel(product) : null,
      isLoading,
      error,
      load,
    }),
    [error, isLoading, load, product],
  );
}
