import type {
  CatalogEntityId,
  CatalogStatus,
  CategoryId,
  CategoryKey,
  CollectionId,
  CollectionKey,
  CommercialModeId,
  CommercialModeKey,
  MeasurementUnitId,
  MeasurementUnitKey,
  MeasurementUnitKind,
  MediaAssetBase,
  MoneyAmount,
  ProductId,
  ProductKey,
  ProductPriceId,
  ProductPriceType,
  ProductVariantId,
  ProductVariantSku,
} from "../types/catalog.types";

export interface CategoryBase {
  id: CategoryId;
  key: CategoryKey;
  name: string;
  parentId?: CategoryId | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CollectionBase {
  id: CollectionId;
  key: CollectionKey;
  name: string;
  description?: string | null;
  status: CatalogStatus;
  sortOrder: number;
  productIds: ProductId[];
}

export interface CommercialModeBase {
  id: CommercialModeId;
  key: CommercialModeKey;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MeasurementUnitBase {
  id?: MeasurementUnitId | null;
  key?: MeasurementUnitKey | null;
  name?: string | null;
  symbol?: string | null;
  kind?: MeasurementUnitKind | null;
  decimalPlaces?: number | null;
}

export interface ProductVariantBase {
  id: ProductVariantId;
  sku: ProductVariantSku;
  name: string;
  unit: string;
  measurementUnit: MeasurementUnitBase | null;
  unitQuantity: string;
  weightGrams?: number | null;
  attributes: Record<string, unknown>;
  isActive: boolean;
}

export interface ProductPriceBase extends MoneyAmount {
  id: ProductPriceId;
  variantId?: ProductVariantId | null;
  variantSku?: ProductVariantSku | null;
  commercialModeKey: CommercialModeKey;
  commercialModeName: string;
  collectionKey?: CollectionKey | null;
  priceType: ProductPriceType;
}

export interface ProductBase {
  id: ProductId;
  key: ProductKey;
  name: string;
  slug: string;
  description?: string | null;
  unit: string;
  status: CatalogStatus;
  isPerishable: boolean;
  sortOrder: number;
  categories: CategoryBase[];
  primaryCategoryKey?: CategoryKey | null;
  collectionKeys: CollectionKey[];
  commercialModeKeys: CommercialModeKey[];
  primaryMediaUrl?: string | null;
  media: MediaAssetBase[];
  variants: ProductVariantBase[];
  prices: ProductPriceBase[];
}

export type CatalogErrorCode =
  | "catalog_reference_not_found"
  | "product_not_found"
  | "product_duplicate_key"
  | "variant_duplicate_sku"
  | "price_duplicate_scope"
  | "permission_denied"
  | "network_error"
  | "unknown_error";

export type CatalogRecordId = CatalogEntityId;
