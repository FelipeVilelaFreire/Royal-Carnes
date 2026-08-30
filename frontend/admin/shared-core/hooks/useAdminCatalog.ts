import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminCatalogApi, type createAdminCatalogApi } from "../api/catalog.api";
import type {
  AdminCatalogSnapshot,
  AdminProductFormInput,
} from "../contracts/catalog.contract";
import { createAdminCatalogViewModel } from "../view-models/catalog.view-model";

type AdminCatalogApi = ReturnType<typeof createAdminCatalogApi>;

export interface UseAdminCatalogOptions {
  api?: AdminCatalogApi;
  initialSnapshot?: AdminCatalogSnapshot;
}

const emptySnapshot: AdminCatalogSnapshot = {
  collections: [],
  commercialModes: [],
  products: [],
};

export function useAdminCatalog(options: UseAdminCatalogOptions = {}) {
  const api = options.api || adminCatalogApi;
  const [snapshot, setSnapshot] = useState<AdminCatalogSnapshot>(
    options.initialSnapshot || emptySnapshot,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [collections, commercialModes, products] = await Promise.all([
        api.listCollections(),
        api.listCommercialModes(),
        api.listProducts(),
      ]);
      const nextSnapshot = { collections, commercialModes, products };
      setSnapshot(nextSnapshot);
      return nextSnapshot;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const create = useCallback(
    async (input: AdminProductFormInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await api.create(input);
        setSnapshot((current) => ({
          ...current,
          products: [product, ...current.products],
        }));
        return product;
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
      snapshot,
      viewModel: createAdminCatalogViewModel(snapshot),
      isLoading,
      error,
      load,
      create,
    }),
    [create, error, isLoading, load, snapshot],
  );
}
