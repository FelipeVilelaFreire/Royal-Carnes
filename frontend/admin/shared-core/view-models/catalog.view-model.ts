import type {
  AdminCatalogSnapshot,
  AdminCategoryView,
  AdminCollectionView,
  AdminProductFormInput,
  AdminProductView,
} from "../contracts/catalog.contract";

export interface AdminCategoryRowViewModel {
  id: string | number;
  isActive: boolean;
  key: string;
  name: string;
  parentKey: string;
  parentName: string;
  sortOrder: number;
  statusLabelKey: string;
}

export interface AdminCollectionRowViewModel {
  id: string | number;
  image: string | null;
  key: string;
  name: string;
  description: string;
  productCount: number;
  sortOrder: number;
  status: string;
  statusLabelKey: string;
}

export interface AdminProductRowViewModel {
  id: string | number;
  description: string;
  image: string | null;
  key: string;
  name: string;
  status: string;
  unit: string;
  categoryKeys: string[];
  categoryNames: string[];
  primaryCategoryName: string;
  collectionKeys: string[];
  collectionNames: string[];
  commercialModeKeys: string[];
  priceCents: number | null;
  priceLabel: string | null;
  variantCount: number;
}

export interface AdminCatalogViewModel {
  rows: AdminProductRowViewModel[];
  total: number;
  activeCount: number;
  draftCount: number;
  archivedCount: number;
}

export interface AdminProductFormViewModel {
  input: AdminProductFormInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminProductFormInput>;
}

function formatPrice(product: AdminProductView): string | null {
  const price = product.prices[0];
  if (!price) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountCents / 100);
}

export function createAdminCategoryRowsViewModel(
  categories: AdminCategoryView[],
): AdminCategoryRowViewModel[] {
  return categories
    .map((category) => {
      const parent = categories.find((candidate) => candidate.id === category.parentId);
      return {
        id: category.id,
        isActive: category.isActive,
        key: category.key,
        name: category.name,
        parentKey: String(category.parentId || ""),
        parentName: parent?.name || "",
        sortOrder: category.sortOrder,
        statusLabelKey: category.isActive ? "common.statusActive" : "common.statusInactive",
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
}

export function createAdminCollectionRowsViewModel(
  collections: AdminCollectionView[],
): AdminCollectionRowViewModel[] {
  return collections
    .map((collection) => ({
      id: collection.id,
      image: collection.imageUrl || null,
      key: collection.key,
      name: collection.name,
      description: collection.description || "",
      productCount: collection.productIds.length,
      sortOrder: collection.sortOrder,
      status: collection.status,
      statusLabelKey: `common.status${collection.status.charAt(0).toUpperCase()}${collection.status.slice(1)}`,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
}

export function createAdminProductRowViewModel(
  product: AdminProductView,
  collections: AdminCollectionView[] = [],
): AdminProductRowViewModel {
  const collectionNames = product.collectionKeys.map(
    (collectionKey) => collections.find((collection) => collection.key === collectionKey)?.name || collectionKey,
  );

  return {
    id: product.id,
    description: product.description || "",
    image: product.primaryMediaUrl || product.media.find((media) => media.isPrimary)?.url || product.media[0]?.url || null,
    key: product.key,
    name: product.name,
    status: product.status,
    unit: product.unit,
    categoryKeys: product.categories.map((category) => category.key),
    categoryNames: product.categories.map((category) => category.name),
    primaryCategoryName:
      product.categories.find((category) => category.key === product.primaryCategoryKey)?.name ||
      product.categories[0]?.name ||
      "",
    collectionKeys: product.collectionKeys,
    collectionNames,
    commercialModeKeys: product.commercialModeKeys,
    priceCents: product.prices[0]?.amountCents ?? null,
    priceLabel: formatPrice(product),
    variantCount: product.variants.length,
  };
}

export function createAdminCatalogViewModel(
  snapshot: AdminCatalogSnapshot,
): AdminCatalogViewModel {
  return {
    rows: snapshot.products.map((product) => createAdminProductRowViewModel(product, snapshot.collections)),
    total: snapshot.products.length,
    activeCount: snapshot.products.filter((product) => product.status === "active").length,
    draftCount: snapshot.products.filter((product) => product.status === "draft").length,
    archivedCount: snapshot.products.filter((product) => product.status === "archived").length,
  };
}

export function createAdminProductFormViewModel(
  input: AdminProductFormInput,
): AdminProductFormViewModel {
  const missingFields: Array<keyof AdminProductFormInput> = [];
  if (!input.key) missingFields.push("key");
  if (!input.name) missingFields.push("name");
  if (!input.categoryKeys.length) missingFields.push("categoryKeys");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}
