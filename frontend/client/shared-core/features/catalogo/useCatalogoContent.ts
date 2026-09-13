import { useEffect, useMemo, useState } from "react";
import type { ApiClientConfig } from "../../../../shared-core";
import { useClientCatalog } from "../../hooks/useClientCatalog";
import {
  createCatalogoViewModel,
  type CatalogoSortKey,
} from "../../view-models/catalogo.view-model";

export interface CatalogoContentStrings {
  allCategoriesLabel: string;
  defaultLineLabel: string;
  sortOptions: {
    bestSellers: string;
    priceAsc: string;
    priceDesc: string;
    relevance: string;
  };
}

export interface UseCatalogoContentOptions {
  apiConfig: ApiClientConfig;
  strings: CatalogoContentStrings;
}

export const useCatalogoContent = ({ apiConfig, strings }: UseCatalogoContentOptions) => {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CatalogoSortKey>("relevance");
  const catalog = useClientCatalog({ apiConfig });

  useEffect(() => {
    void catalog.load().catch(() => undefined);
  }, [catalog.load]);

  const viewModel = useMemo(
    () => createCatalogoViewModel({
      activeCategoryId,
      allCategoriesLabel: strings.allCategoriesLabel,
      apiCategories: catalog.snapshot.categories,
      apiProducts: catalog.snapshot.products,
      defaultLineLabel: strings.defaultLineLabel,
      searchQuery,
      sortBy,
    }),
    [
      activeCategoryId,
      catalog.snapshot.categories,
      catalog.snapshot.products,
      searchQuery,
      sortBy,
      strings.allCategoriesLabel,
      strings.defaultLineLabel,
    ],
  );
  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: strings.sortOptions.relevance },
      { value: "best_sellers", label: strings.sortOptions.bestSellers },
      { value: "price_asc", label: strings.sortOptions.priceAsc },
      { value: "price_desc", label: strings.sortOptions.priceDesc },
    ],
    [strings.sortOptions],
  );
  const clearFilters = () => {
    setActiveCategoryId("all");
    setSearchQuery("");
    setSortBy("relevance");
  };

  return {
    activeCategoryId,
    categories: viewModel.categories,
    clearFilters,
    error: catalog.error,
    filteredProducts: viewModel.filteredProducts,
    isFiltered: Boolean(searchQuery) || activeCategoryId !== "all" || sortBy !== "relevance",
    isLoading: catalog.isLoading,
    reload: catalog.load,
    searchQuery,
    setActiveCategoryId,
    setSearchQuery,
    setSortBy,
    sortBy,
    sortOptions,
  };
};

export type CatalogoContentModel = ReturnType<typeof useCatalogoContent>;
