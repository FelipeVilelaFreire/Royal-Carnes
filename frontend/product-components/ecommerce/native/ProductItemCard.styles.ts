import type { NativeFoundationDesignSystem } from "../../../foundation/native";

export const createProductItemCardStyles = (designSystem: NativeFoundationDesignSystem) => {
  const { colors, tokens } = designSystem.theme;
  const spacing = tokens.spacing || {};
  const dimensions = tokens.dimensions?.height || {};

  return {
    action: {
      alignSelf: "flex-start",
      minHeight: dimensions.md,
    },
    badge: {
      color: colors.primary,
      letterSpacing: tokens.typography?.letterSpacingMd,
      textTransform: "uppercase",
    },
    card: {
      gap: spacing.spaceXs,
      padding: spacing.spaceSm,
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
      aspectRatio: 16 / 10,
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
    surface: {
      overflow: "hidden",
    },
  };
};
