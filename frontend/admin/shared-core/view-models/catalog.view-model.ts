import type {
  AdminCatalogSnapshot,
  AdminProductFormInput,
  AdminProductView,
} from "../contracts/catalog.contract";

export interface AdminProductRowViewModel {
  id: string | number;
  key: string;
  name: string;
  status: string;
  categoryNames: string[];
  collectionKeys: string[];
  commercialModeKeys: string[];
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

export function createAdminProductRowViewModel(
  product: AdminProductView,
): AdminProductRowViewModel {
  return {
    id: product.id,
    key: product.key,
    name: product.name,
    status: product.status,
    categoryNames: product.categories.map((category) => category.name),
    collectionKeys: product.collectionKeys,
    commercialModeKeys: product.commercialModeKeys,
    priceLabel: formatPrice(product),
    variantCount: product.variants.length,
  };
}

export function createAdminCatalogViewModel(
  snapshot: AdminCatalogSnapshot,
): AdminCatalogViewModel {
  return {
    rows: snapshot.products.map(createAdminProductRowViewModel),
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
