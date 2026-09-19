import type {
  AdminCatalogSnapshot,
  AdminCategoryView,
  AdminCollectionView,
  AdminProductFormInput,
  AdminProductView,
} from "../contracts/catalog.contract";

type CatalogStatusTone = "success" | "warning" | "neutral";

export interface AdminCategoryRowViewModel {
  id: string | number;
  isActive: boolean;
  key: string;
  hierarchyLabel: string;
  childCategoryNames: string[];
  childCategoriesSummary: string;
  name: string;
  parentKey: string;
  parentName: string;
  sortOrder: number;
  statusLabelKey: string;
  statusTone: CatalogStatusTone;
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
  statusTone: CatalogStatusTone;
}

export interface AdminProductRowViewModel {
  id: string | number;
  description: string;
  image: string | null;
  key: string;
  name: string;
  status: string;
  statusTone: CatalogStatusTone;
  unit: string;
  categoryKeys: string[];
  categoryNames: string[];
  parentCategoryName: string;
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

function resolveCatalogStatusTone(status: "active" | "draft" | "archived"): CatalogStatusTone {
  if (status === "active") return "success";
  if (status === "draft") return "warning";
  return "neutral";
}

export function createAdminCategoryRowsViewModel(
  categories: AdminCategoryView[],
): AdminCategoryRowViewModel[] {
  const hierarchyFor = (category: AdminCategoryView): string => {
    const parts = [category.name];
    const visited = new Set<string | number>([category.id]);
    let parent = categories.find((candidate) => candidate.id === category.parentId);
    while (parent && !visited.has(parent.id)) {
      parts.unshift(parent.name);
      visited.add(parent.id);
      parent = categories.find((candidate) => candidate.id === parent?.parentId);
    }
    return parts.join(" / ");
  };

  return categories
    .map((category) => {
      const parent = categories.find((candidate) => candidate.id === category.parentId);
      const children = categories
        .filter((candidate) => candidate.parentId === category.id)
        .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
      return {
        childCategoryNames: children.map((child) => child.name),
        childCategoriesSummary: children.map((child) => child.name).join(", "),
        id: category.id,
        isActive: category.isActive,
        key: category.key,
        hierarchyLabel: hierarchyFor(category),
        name: category.name,
        parentKey: parent?.key || "",
        parentName: parent?.name || "",
        sortOrder: category.sortOrder,
        statusLabelKey: category.isActive ? "common.statusActive" : "common.statusInactive",
        statusTone: category.isActive ? "success" : "danger",
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
      statusTone: resolveCatalogStatusTone(collection.status),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
}

export function createAdminProductRowViewModel(
  product: AdminProductView,
  collections: AdminCollectionView[] = [],
  categories: AdminCategoryView[] = [],
): AdminProductRowViewModel {
  const collectionNames = product.collectionKeys.map(
    (collectionKey) => collections.find((collection) => collection.key === collectionKey)?.name || collectionKey,
  );

  const primaryCategory = product.categories.find((category) => category.key === product.primaryCategoryKey)
    || product.categories[0];
  const parentCategory = categories.find((category) => category.id === primaryCategory?.parentId);

  return {
    id: product.id,
    description: product.description || "",
    image: product.primaryMediaUrl || product.media.find((media) => media.isPrimary)?.url || product.media[0]?.url || null,
    key: product.key,
    name: product.name,
    status: product.status,
    statusTone: resolveCatalogStatusTone(product.status),
    unit: product.unit,
    categoryKeys: product.categories.map((category) => category.key),
    categoryNames: product.categories.map((category) => category.name),
    parentCategoryName: parentCategory?.name || "",
    primaryCategoryName: primaryCategory?.name || "",
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
    rows: snapshot.products.map((product) => createAdminProductRowViewModel(product, snapshot.collections, snapshot.categories)),
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
