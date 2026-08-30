import type {
  ClientCatalogQuery,
  ClientCatalogSnapshot,
  ClientProductView,
} from "../contracts/catalog.contract";

export interface ClientProductCardViewModel {
  id: string | number;
  key: string;
  name: string;
  description: string;
  imageUrl: string | null;
  categoryKeys: string[];
  collectionKeys: string[];
  commercialModeKeys: string[];
  priceLabel: string | null;
  isAvailable: boolean;
}

export interface ClientCatalogViewModel {
  products: ClientProductCardViewModel[];
  total: number;
  collectionKeys: string[];
  commercialModeKeys: string[];
}

function formatPrice(product: ClientProductView): string | null {
  const price = product.prices[0];
  if (!price) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountCents / 100);
}

export function createClientProductCardViewModel(
  product: ClientProductView,
): ClientProductCardViewModel {
  return {
    id: product.id,
    key: product.key,
    name: product.name,
    description: product.description || "",
    imageUrl: product.primaryMediaUrl || product.media[0]?.url || null,
    categoryKeys: product.categories.map((category) => category.key),
    collectionKeys: product.collectionKeys,
    commercialModeKeys: product.commercialModeKeys,
    priceLabel: formatPrice(product),
    isAvailable: product.status === "active" && product.commercialModeKeys.length > 0,
  };
}

export function createClientCatalogViewModel(
  snapshot: ClientCatalogSnapshot,
  query: ClientCatalogQuery = {},
): ClientCatalogViewModel {
  const products = snapshot.products.filter((product) => {
    if (query.collectionKey && !product.collectionKeys.includes(query.collectionKey)) return false;
    if (
      query.commercialModeKey &&
      !product.commercialModeKeys.includes(query.commercialModeKey)
    ) {
      return false;
    }
    return true;
  });

  return {
    products: products.map(createClientProductCardViewModel),
    total: products.length,
    collectionKeys: snapshot.collections.map((collection) => collection.key),
    commercialModeKeys: snapshot.commercialModes.map((mode) => mode.key),
  };
}
