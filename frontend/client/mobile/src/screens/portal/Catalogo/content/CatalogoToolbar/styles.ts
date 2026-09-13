import type { NativeFoundationDesignSystem } from "@foundation/native";

export const catalogoToolbarTokens = {
  gap: "md",
} as const;

export const createCatalogoToolbarStyles = (designSystem: NativeFoundationDesignSystem) => {
  const { colors, tokens } = designSystem.theme;
  const spacing = tokens.spacing || {};

  return {
    metaRow: {
      alignItems: "center",
      gap: spacing.spaceSm,
      justifyContent: "space-between",
    },
    resultCount: {
      flex: 1,
      flexShrink: 1,
      textAlign: "right",
    },
    root: {
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: tokens.radius?.xl,
      padding: spacing.spaceSm,
    },
    sortControl: {
      flex: 1,
      gap: spacing.space2xs,
      minWidth: 0,
    },
    sortLabel: {
      color: colors.textMuted,
    },
  };
};
