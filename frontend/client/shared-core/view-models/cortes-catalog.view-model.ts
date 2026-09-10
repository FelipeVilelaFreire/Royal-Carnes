import type { ClientProductView } from "../contracts/catalog.contract";

export type CortesCatalogSortKey = "relevance" | "best_sellers" | "price_asc" | "price_desc";

export interface CortesCatalogCategoryOption {
  id: string;
  name: string;
}

export interface CortesCatalogDisplayProduct {
  id: string;
  name: string;
  subtitle: string;
  weight: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeType?: "offer" | "limited";
  category: string;
  line: string;
  image: string;
  origin?: string;
}

export interface CortesCatalogViewModelInput {
  apiProducts: ClientProductView[];
  activeCategoryId: string;
  allCategoriesLabel: string;
  defaultLineLabel: string;
  searchQuery: string;
  sortBy: CortesCatalogSortKey;
}

export interface CortesCatalogViewModel {
  categories: CortesCatalogCategoryOption[];
  filteredProducts: CortesCatalogDisplayProduct[];
  products: CortesCatalogDisplayProduct[];
  total: number;
}

const mapProductToDisplayProduct = (
  product: ClientProductView,
  defaultLineLabel: string,
): CortesCatalogDisplayProduct => {
  const price = product.prices[0];
  const variant = product.variants.find((item) => item.isActive) || product.variants[0];
  const primaryCategory =
    product.categories.find((category) => category.key === product.primaryCategoryKey) ||
    product.categories[0];

  return {
    id: String(product.id),
    name: product.name,
    subtitle: product.description || "",
    weight: variant?.measurementUnit?.symbol || variant?.unit || product.unit,
    price: price ? price.amountCents / 100 : 0,
    category: primaryCategory?.key || product.primaryCategoryKey || "all",
    line: primaryCategory?.name || product.collectionKeys[0] || defaultLineLabel,
    image: product.primaryMediaUrl || product.media[0]?.url || "",
  };
};

const createCategoryOptions = (
  products: ClientProductView[],
  allCategoriesLabel: string,
): CortesCatalogCategoryOption[] => {
  const categories = new Map<string, string>();
  products.forEach((product) => {
    product.categories.forEach((category) => {
      if (category.isActive) {
        categories.set(category.key, category.name);
      }
    });
  });

  return [
    { id: "all", name: allCategoriesLabel },
    ...Array.from(categories, ([id, name]) => ({ id, name })),
  ];
};

const sortProducts = (
  products: CortesCatalogDisplayProduct[],
  sortBy: CortesCatalogSortKey,
) => [...products].sort((a, b) => {
  if (sortBy === "price_asc") return a.price - b.price;
  if (sortBy === "price_desc") return b.price - a.price;
  if (sortBy === "best_sellers") {
    const aScore = a.badgeType === "offer" ? 1 : 0;
    const bScore = b.badgeType === "offer" ? 1 : 0;
    return bScore - aScore || a.name.localeCompare(b.name);
  }
  return a.name.localeCompare(b.name);
});

export const createCortesCatalogViewModel = ({
  activeCategoryId,
  allCategoriesLabel,
  apiProducts,
  defaultLineLabel,
  searchQuery,
  sortBy,
}: CortesCatalogViewModelInput): CortesCatalogViewModel => {
  const products = apiProducts.map((product) => mapProductToDisplayProduct(product, defaultLineLabel));
  const categories = createCategoryOptions(apiProducts, allCategoriesLabel);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = products.filter((item) => {
    const matchesCategory = activeCategoryId === "all" || item.category === activeCategoryId;
    const matchesSearch =
      normalizedQuery === "" ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const filteredProducts = sortProducts(filtered, sortBy);

  return {
    categories,
    filteredProducts,
    products,
    total: filteredProducts.length,
  };
};
