import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { clientCatalogApi, type createClientCatalogApi } from "../api/catalog.api";
import type {
  ClientCatalogQuery,
  ClientCatalogSnapshot,
} from "../contracts/catalog.contract";
import { createClientCatalogViewModel } from "../view-models/catalog.view-model";

type ClientCatalogApi = ReturnType<typeof createClientCatalogApi>;

export interface UseClientCatalogOptions {
  api?: ClientCatalogApi;
  initialSnapshot?: ClientCatalogSnapshot;
  initialQuery?: ClientCatalogQuery;
}

const emptySnapshot: ClientCatalogSnapshot = {
  collections: [],
  commercialModes: [],
  products: [],
};

export function useClientCatalog(options: UseClientCatalogOptions = {}) {
  const api = options.api || clientCatalogApi;
  const [snapshot, setSnapshot] = useState<ClientCatalogSnapshot>(
    options.initialSnapshot || emptySnapshot,
  );
  const [query, setQuery] = useState<ClientCatalogQuery>(options.initialQuery || {});
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

  return useMemo(
    () => ({
      snapshot,
      query,
      viewModel: createClientCatalogViewModel(snapshot, query),
      isLoading,
      error,
      setQuery,
      load,
    }),
    [error, isLoading, load, query, snapshot],
  );
}
