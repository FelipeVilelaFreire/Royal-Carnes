import type {
  CategoryBase,
  CollectionBase,
  CommercialModeBase,
  ProductBase,
} from "../../../shared-core";

export interface AdminCategoryDto {
  id: string | number;
  key: string;
  name: string;
  parent_id?: string | number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface AdminCollectionDto {
  id: string | number;
  key: string;
  name: string;
  description?: string | null;
  status: "active" | "draft" | "archived";
  sort_order?: number;
  product_ids?: Array<string | number>;
}

export interface AdminCommercialModeDto {
  id: string | number;
  key: string;
  name: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface AdminProductMediaDto {
  id: string | number;
  url: string;
  alt?: string | null;
  sort_order?: number;
  is_primary?: boolean;
}

export interface AdminProductVariantDto {
  id: string | number;
  sku?: string;
  name: string;
  unit: string;
  unit_key?: string | null;
  unit_name?: string | null;
  unit_kind?: "weight" | "count" | "package" | "volume" | "service" | null;
  unit_symbol?: string | null;
  unit_quantity?: string | number;
  weight_grams?: number | null;
  attributes?: Record<string, unknown>;
  is_active?: boolean;
}

export interface AdminProductPriceDto {
  id: string | number;
  variant_id?: string | number | null;
  variant_sku?: string | null;
  commercial_mode_key: string;
  commercial_mode_name: string;
  collection_key?: string | null;
  price_type: "base" | "promotional" | "subscription" | "campaign" | "manual";
  currency: string;
  amount_cents: number;
}

export interface AdminProductDto {
  id: string | number;
  key: string;
  name: string;
  slug: string;
  description?: string | null;
  unit: string;
  status: "active" | "draft" | "archived";
  is_perishable?: boolean;
  sort_order?: number;
  categories?: AdminCategoryDto[];
  primary_category_key?: string | null;
  collection_keys?: string[];
  commercial_mode_keys?: string[];
  primary_media_url?: string | null;
  media?: AdminProductMediaDto[];
  variants?: AdminProductVariantDto[];
  prices?: AdminProductPriceDto[];
}

export interface AdminProductVariantFormInput {
  sku?: string;
  name: string;
  unit?: string;
  unitKey?: string;
  unitQuantity?: string | number;
  weightGrams?: number | null;
  attributes?: Record<string, unknown>;
  priceCents?: number;
  priceType?: "base" | "promotional" | "subscription" | "campaign" | "manual";
  commercialModeKeys?: string[];
  isActive?: boolean;
}

export interface AdminProductFormInput {
  key: string;
  name: string;
  categoryKeys: string[];
  unit?: string;
  priceCents?: number;
  priceType?: "base" | "promotional" | "subscription" | "campaign" | "manual";
  commercialModeKeys?: string[];
  collectionKeys?: string[];
  variants?: AdminProductVariantFormInput[];
}

export interface AdminProductCreateDto {
  key: string;
  name: string;
  category_keys: string[];
  unit?: string;
  price_cents?: number;
  price_type?: "base" | "promotional" | "subscription" | "campaign" | "manual";
  commercial_mode_keys?: string[];
  collection_keys?: string[];
  variants?: Array<{
    sku?: string;
    name: string;
    unit?: string;
    unit_key?: string;
    unit_quantity?: string | number;
    weight_grams?: number | null;
    attributes?: Record<string, unknown>;
    price_cents?: number;
    price_type?: "base" | "promotional" | "subscription" | "campaign" | "manual";
    commercial_mode_keys?: string[];
    is_active?: boolean;
  }>;
}

export interface AdminCatalogSnapshot {
  collections: CollectionBase[];
  commercialModes: CommercialModeBase[];
  products: ProductBase[];
}

export type AdminCategoryView = CategoryBase;
export type AdminCollectionView = CollectionBase;
export type AdminCommercialModeView = CommercialModeBase;
export type AdminProductView = ProductBase;
