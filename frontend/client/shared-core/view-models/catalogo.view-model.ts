import type {
  ClientCategoryView,
  ClientProductView,
} from "../contracts/catalog.contract";

export type CatalogoSortKey = "relevance" | "best_sellers" | "price_asc" | "price_desc";

export interface CatalogoCategoryOption {
  id: string;
  name: string;
}

export interface CatalogoDisplayProduct {
  id: string;
  name: string;
  subtitle: string;
  weight: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeType?: "offer" | "limited";
  category: string;
  categoryKeys: string[];
  line: string;
  image: string;
  origin?: string;
}

export interface CatalogoViewModelInput {
  apiCategories: ClientCategoryView[];
  apiProducts: ClientProductView[];
  activeCategoryId: string;
  allCategoriesLabel: string;
  defaultLineLabel: string;
  searchQuery: string;
  sortBy: CatalogoSortKey;
}

export interface CatalogoViewModel {
  categories: CatalogoCategoryOption[];
  filteredProducts: CatalogoDisplayProduct[];
  products: CatalogoDisplayProduct[];
  total: number;
}

const mapProductToDisplayProduct = (
  product: ClientProductView,
  defaultLineLabel: string,
): CatalogoDisplayProduct => {
  const price = product.prices[0];
  const variant = product.variants.find((item) => item.isActive) || product.variants[0];
  const primaryCategory =
    product.categories.find((category) => category.key === product.primaryCategoryKey) ||
    product.categories[0];
  const categoryKeys = Array.from(new Set([
    ...product.categories.map((category) => category.key),
    ...(product.primaryCategoryKey ? [product.primaryCategoryKey] : []),
  ]));

  return {
    id: String(product.id),
    name: product.name,
    subtitle: product.description || "",
    weight: variant?.measurementUnit?.symbol || variant?.unit || product.unit,
    price: price ? price.amountCents / 100 : 0,
    category: primaryCategory?.key || product.primaryCategoryKey || "all",
    categoryKeys,
    line: primaryCategory?.name || product.collectionKeys[0] || defaultLineLabel,
    image: product.primaryMediaUrl || product.media[0]?.url || "",
  };
};

const createCategoryOptions = (
  categories: ClientCategoryView[],
  allCategoriesLabel: string,
): CatalogoCategoryOption[] => {
  return [
    { id: "all", name: allCategoriesLabel },
    ...categories
      .filter((category) => category.isActive)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name))
      .map((category) => ({ id: category.key, name: category.name })),
  ];
};

const sortProducts = (
  products: CatalogoDisplayProduct[],
  sortBy: CatalogoSortKey,
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

export const createCatalogoViewModel = ({
  activeCategoryId,
  allCategoriesLabel,
  apiCategories,
  apiProducts,
  defaultLineLabel,
  searchQuery,
  sortBy,
}: CatalogoViewModelInput): CatalogoViewModel => {
  const products = apiProducts.map((product) => mapProductToDisplayProduct(product, defaultLineLabel));
  const categories = createCategoryOptions(apiCategories, allCategoriesLabel);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = products.filter((item) => {
    const matchesCategory = activeCategoryId === "all" || item.categoryKeys.includes(activeCategoryId);
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
