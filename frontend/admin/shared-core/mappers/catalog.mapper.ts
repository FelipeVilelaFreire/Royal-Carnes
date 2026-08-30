import type {
  AdminCategoryDto,
  AdminCollectionDto,
  AdminCommercialModeDto,
  AdminProductCreateDto,
  AdminProductDto,
  AdminProductFormInput,
  AdminProductPriceDto,
  AdminProductVariantDto,
} from "../contracts/catalog.contract";
import type {
  CategoryBase,
  CollectionBase,
  CommercialModeBase,
  ProductBase,
  ProductPriceBase,
  ProductVariantBase,
} from "../../../shared-core";

export function mapAdminCategoryDto(dto: AdminCategoryDto): CategoryBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    parentId: dto.parent_id ?? null,
    sortOrder: dto.sort_order ?? 0,
    isActive: dto.is_active !== false,
  };
}

export function mapAdminCollectionDto(dto: AdminCollectionDto): CollectionBase {
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

export function mapAdminCommercialModeDto(dto: AdminCommercialModeDto): CommercialModeBase {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    isActive: dto.is_active !== false,
    sortOrder: dto.sort_order ?? 0,
  };
}

function mapAdminProductVariantDto(dto: AdminProductVariantDto): ProductVariantBase {
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

function mapAdminProductPriceDto(dto: AdminProductPriceDto): ProductPriceBase {
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

export function mapAdminProductDto(dto: AdminProductDto): ProductBase {
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
    categories: (dto.categories || []).map(mapAdminCategoryDto),
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
    variants: (dto.variants || []).map(mapAdminProductVariantDto),
    prices: (dto.prices || []).map(mapAdminProductPriceDto),
  };
}

export function mapAdminProductFormInput(input: AdminProductFormInput): AdminProductCreateDto {
  return {
    key: input.key,
    name: input.name,
    category_keys: input.categoryKeys,
    unit: input.unit,
    price_cents: input.priceCents,
    price_type: input.priceType,
    commercial_mode_keys: input.commercialModeKeys,
    collection_keys: input.collectionKeys,
    variants: input.variants?.map((variant) => ({
      sku: variant.sku,
      name: variant.name,
      unit: variant.unit,
      unit_key: variant.unitKey,
      unit_quantity: variant.unitQuantity,
      weight_grams: variant.weightGrams,
      attributes: variant.attributes,
      price_cents: variant.priceCents,
      price_type: variant.priceType,
      commercial_mode_keys: variant.commercialModeKeys,
      is_active: variant.isActive,
    })),
  };
}
