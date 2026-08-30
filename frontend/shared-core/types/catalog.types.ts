export type CatalogEntityId = string | number;
export type ProductId = CatalogEntityId;
export type ProductVariantId = CatalogEntityId;
export type ProductPriceId = CatalogEntityId;
export type CategoryId = CatalogEntityId;
export type CollectionId = CatalogEntityId;
export type CommercialModeId = CatalogEntityId;
export type MeasurementUnitId = CatalogEntityId;

export type ProductKey = string;
export type ProductVariantSku = string;
export type CategoryKey = string;
export type CollectionKey = string;
export type CommercialModeKey = string;
export type MeasurementUnitKey = string;

export type CatalogStatus = "active" | "draft" | "archived";
export type MeasurementUnitKind = "weight" | "count" | "package" | "volume" | "service";
export type ProductPriceType = "base" | "promotional" | "subscription" | "campaign" | "manual";

export interface MoneyAmount {
  amountCents: number;
  currency: string;
}

export interface MediaAssetBase {
  id?: CatalogEntityId;
  url: string;
  alt?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}
