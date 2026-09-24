import { useEffect, useMemo } from "react";
import type { ApiClientConfig } from "../../../../shared-core";
import { useClientCatalog } from "../../hooks/useClientCatalog";
import { createHomeVitrineViewModel } from "../../view-models/home-vitrine.view-model";

export interface UseHomeVitrineOptions {
  apiConfig: ApiClientConfig;
}

export function useHomeVitrine({ apiConfig }: UseHomeVitrineOptions) {
  const catalog = useClientCatalog({ apiConfig });

  useEffect(() => {
    void catalog.load().catch(() => undefined);
  }, [catalog.load]);

  const viewModel = useMemo(
    () => createHomeVitrineViewModel(catalog.snapshot),
    [catalog.snapshot],
  );

  return {
    error: catalog.error,
    isLoading: catalog.isLoading,
    reload: catalog.load,
    viewModel,
  };
}
