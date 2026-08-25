import type { UiFocusRingTokens } from "../themeBindings";

export const DEFAULT_FOCUS_RING_RECIPES = {
  "2xs": { blurToken: "none", offsetToken: "space2xs", opacityToken: "xs", stroke: "2xs" }, xs: { blurToken: "none", offsetToken: "space2xs", opacityToken: "sm", stroke: "xs" },
  sm: { blurToken: "2xs", offsetToken: "spaceXs", opacityToken: "md", stroke: "sm" }, md: { blurToken: "xs", offsetToken: "spaceSm", opacityToken: "lg", stroke: "md" },
  lg: { blurToken: "sm", offsetToken: "spaceSm", opacityToken: "xl", stroke: "lg" }, xl: { blurToken: "md", offsetToken: "spaceMd", opacityToken: "xl", stroke: "xl" },
  "2xl": { blurToken: "lg", offsetToken: "spaceLg", opacityToken: "2xl", stroke: "2xl" }, "3xl": { blurToken: "xl", offsetToken: "spaceXl", opacityToken: "3xl", stroke: "3xl" },
} satisfies UiFocusRingTokens;
export const DEFAULT_FOCUS_RING_RECIPE = DEFAULT_FOCUS_RING_RECIPES.md;
