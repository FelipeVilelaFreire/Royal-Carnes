import type { UiDividerTokens } from "../themeBindings";

/** Canonical Divider composition. Theme supplies only the referenced raw tokens. */
export const DEFAULT_DIVIDER_RECIPES = {
  "2xs": { motion: "xs", opacityToken: "sm", radiusToken: "none", spacingToken: "space2xs", stroke: "2xs" },
  xs: { motion: "xs", opacityToken: "sm", radiusToken: "none", spacingToken: "space2xs", stroke: "2xs" },
  sm: { motion: "sm", opacityToken: "md", radiusToken: "xs", spacingToken: "spaceXs", stroke: "xs" },
  md: { motion: "sm", opacityToken: "md", radiusToken: "xs", spacingToken: "spaceSm", stroke: "xs" },
  lg: { motion: "md", opacityToken: "lg", radiusToken: "sm", spacingToken: "spaceSm", stroke: "sm" },
  xl: { motion: "md", opacityToken: "lg", radiusToken: "sm", spacingToken: "spaceMd", stroke: "sm" },
  "2xl": { motion: "md", opacityToken: "xl", radiusToken: "md", spacingToken: "spaceMd", stroke: "md" },
  "3xl": { motion: "md", opacityToken: "xl", radiusToken: "md", spacingToken: "spaceLg", stroke: "md" },
} satisfies UiDividerTokens;

export const DEFAULT_DIVIDER_RECIPE = DEFAULT_DIVIDER_RECIPES.md;
