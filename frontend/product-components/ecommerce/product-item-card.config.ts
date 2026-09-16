export type ProductItemCardPreset = "catalogo" | "compact" | "readonly" | "includedInPlan";
export type ProductItemCardDensity = "showcase" | "selection" | "compact";

export type ProductItemCardMetaMode = "category-detail" | "category-only" | "detail-only";
export type ProductItemCardPriceMode = "unit" | "from" | "estimate" | "included" | "hidden";
export type ProductItemCardActionMode = "none" | "select" | "add" | "quantity" | "view-details" | "configure";
export type ProductItemCardFavoriteMode = "none" | "toggle";
export type ProductItemCardQuantityMode = "none" | "stepper" | "readonly";

/**
 * Declarative composition contract shared by Web and React Native.
 * Product data and handlers stay with the consumer; this file only decides
 * which visual slots the product context is allowed to render.
 */
export interface ProductItemCardComposition {
  actionMode: ProductItemCardActionMode;
  density: ProductItemCardDensity;
  favoriteMode: ProductItemCardFavoriteMode;
  metaMode: ProductItemCardMetaMode;
  priceMode: ProductItemCardPriceMode;
  quantityMode: ProductItemCardQuantityMode;
  showAction: boolean;
  showBadge: boolean;
  showCategory: boolean;
  showDescription: boolean;
  showDetail: boolean;
  showFavorite: boolean;
  showImage: boolean;
  showMeta: boolean;
  showName: boolean;
  showOriginalPrice: boolean;
  showPrice: boolean;
}

const baseComposition: ProductItemCardComposition = {
  actionMode: "none",
  density: "showcase",
  favoriteMode: "none",
  metaMode: "category-detail",
  priceMode: "unit",
  quantityMode: "none",
  showAction: false,
  showBadge: true,
  showCategory: true,
  showDescription: true,
  showDetail: true,
  showFavorite: false,
  showImage: true,
  showMeta: true,
  showName: true,
  showOriginalPrice: true,
  showPrice: true,
};

export const productItemCardCompositions: Record<ProductItemCardPreset, ProductItemCardComposition> = {
  catalogo: {
    ...baseComposition,
    favoriteMode: "toggle",
    showFavorite: true,
  },
  compact: {
    ...baseComposition,
    density: "compact",
    showDescription: false,
    showImage: false,
    showOriginalPrice: false,
  },
  readonly: {
    ...baseComposition,
    showFavorite: false,
    showOriginalPrice: false,
  },
  includedInPlan: {
    ...baseComposition,
    actionMode: "select",
    density: "compact",
    priceMode: "included",
    quantityMode: "stepper",
    showAction: true,
    showFavorite: false,
    showImage: false,
    showOriginalPrice: false,
    showPrice: false,
  },
};

export const resolveProductItemCardComposition = (
  preset: ProductItemCardPreset = "catalogo",
  overrides: Partial<ProductItemCardComposition> = {},
): ProductItemCardComposition => {
  const definedOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  ) as Partial<ProductItemCardComposition>;

  return {
    ...productItemCardCompositions[preset],
    ...definedOverrides,
  };
};
