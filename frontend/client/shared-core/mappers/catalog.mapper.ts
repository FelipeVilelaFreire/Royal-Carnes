import type {
  ClientCategoryDto,
  ClientCollectionDto,
  ClientCommercialModeDto,
  ClientProductDto,
  ClientProductPriceDto,
  ClientProductVariantDto,
} from "../contracts/catalog.contract";
import type {
  CategoryBase,
  CollectionBase,
  CommercialModeBase,
  ProductBase,
  ProductPriceBase,
  ProductVariantBase,
} from "../../../shared-core";

export function mapClientCategoryDto(dto: ClientCategoryDto): CategoryBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    parentId: dto.parent_id ?? null,
    sortOrder: dto.sort_order ?? 0,
    isActive: dto.is_active !== false,
  };
}

export function mapClientCollectionDto(dto: ClientCollectionDto): CollectionBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    description: dto.description ?? null,
    status: dto.status,
    sortOrder: dto.sort_order ?? 0,
    productIds: dto.product_ids || [],
  };
}

export function mapClientCommercialModeDto(dto: ClientCommercialModeDto): CommercialModeBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    isActive: dto.is_active !== false,
    sortOrder: dto.sort_order ?? 0,
  };
}

function mapClientProductVariantDto(dto: ClientProductVariantDto): ProductVariantBase {
  return {
    id: dto.id,
    sku: dto.sku || "",
    name: dto.name,
    unit: dto.unit,
    measurementUnit: {
      key: dto.unit_key ?? null,
      name: dto.unit_name ?? null,
      kind: dto.unit_kind ?? null,
      symbol: dto.unit_symbol ?? null,
    },
    unitQuantity: String(dto.unit_quantity ?? "1.000"),
    weightGrams: dto.weight_grams ?? null,
    attributes: dto.attributes || {},
    isActive: dto.is_active !== false,
  };
}

function mapClientProductPriceDto(dto: ClientProductPriceDto): ProductPriceBase {
  return {
    id: dto.id,
    variantId: dto.variant_id ?? null,
    variantSku: dto.variant_sku ?? null,
    commercialModeKey: dto.commercial_mode_key,
    commercialModeName: dto.commercial_mode_name,
    collectionKey: dto.collection_key ?? null,
    priceType: dto.price_type,
    currency: dto.currency,
    amountCents: dto.amount_cents,
  };
}

export function mapClientProductDto(dto: ClientProductDto): ProductBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    slug: dto.slug,
    description: dto.description ?? null,
    unit: dto.unit,
    status: dto.status,
    isPerishable: dto.is_perishable ?? false,
    sortOrder: dto.sort_order ?? 0,
    categories: (dto.categories || []).map(mapClientCategoryDto),
    primaryCategoryKey: dto.primary_category_key ?? null,
    collectionKeys: dto.collection_keys || [],
    commercialModeKeys: dto.commercial_mode_keys || [],
    primaryMediaUrl: dto.primary_media_url ?? null,
    media: (dto.media || []).map((media) => ({
      id: media.id,
      url: media.url,
      alt: media.alt ?? null,
      sortOrder: media.sort_order ?? 0,
      isPrimary: media.is_primary ?? false,
    })),
    variants: (dto.variants || []).map(mapClientProductVariantDto),
    prices: (dto.prices || []).map(mapClientProductPriceDto),
  };
}
