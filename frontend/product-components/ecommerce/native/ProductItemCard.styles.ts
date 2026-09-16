import type { NativeFoundationDesignSystem } from "../../../foundation/native";
import type { ProductItemCardDensity } from "../product-item-card.config";

export const createProductItemCardStyles = (
  designSystem: NativeFoundationDesignSystem,
  density: ProductItemCardDensity = "showcase",
) => {
  const { colors, tokens } = designSystem.theme;
  const spacing = tokens.spacing || {};
  const dimensions = tokens.dimensions?.height || {};
  const isSelection = density === "selection";

  return {
    action: {
      alignSelf: "flex-end",
      minHeight: dimensions.md,
    },
    badge: {
      color: colors.primary,
      letterSpacing: tokens.typography?.letterSpacingMd,
      textTransform: "uppercase",
    },
    card: {
      gap: isSelection ? spacing.space2xs : spacing.spaceXs,
      padding: isSelection ? spacing.spaceMd : spacing.spaceSm,
    },
    category: {
      color: colors.primary,
      letterSpacing: tokens.typography?.letterSpacingMd,
      textTransform: "uppercase",
    },
    favoriteAction: {
      alignSelf: "flex-start",
      minHeight: dimensions.sm,
    },
    footer: {
      borderTopColor: colors.border,
      borderTopWidth: tokens.borders?.hairline,
      gap: spacing.spaceSm,
      paddingTop: spacing.spaceSm,
    },
    media: {
      aspectRatio: 4 / 3,
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: tokens.radius?.lg,
      overflow: "hidden",
      width: "100%",
    },
    meta: {
      color: colors.textMuted,
    },
    price: {
      color: colors.primary,
    },
    priceLabel: {
      color: colors.textMuted,
      letterSpacing: tokens.typography?.letterSpacingMd,
      textTransform: "uppercase",
    },
    quantityControl: {
      alignItems: "center",
      alignSelf: "flex-end",
      gap: spacing.spaceXs,
    },
    quantityValue: {
      color: colors.text,
      minWidth: dimensions.md,
      textAlign: "center",
    },
    surface: {
      borderColor: isSelection ? colors.border : undefined,
      borderWidth: isSelection ? tokens.borders?.hairline : undefined,
      overflow: "hidden",
    },
  };
};
