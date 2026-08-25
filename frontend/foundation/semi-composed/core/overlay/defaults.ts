import type { UiOverlayTokens } from "../themeBindings";

export const DEFAULT_OVERLAY_RECIPES = {
  "2xs": { blurToken: "none", borderToken: "none", innerElevation: "none", opacityToken: "2xs", outerElevation: "none" }, xs: { blurToken: "none", borderToken: "2xs", innerElevation: "none", opacityToken: "xs", outerElevation: "none" },
  sm: { blurToken: "2xs", borderToken: "xs", innerElevation: "none", opacityToken: "sm", outerElevation: "xs" }, md: { blurToken: "xs", borderToken: "sm", innerElevation: "2xs", opacityToken: "md", outerElevation: "sm" },
  lg: { blurToken: "sm", borderToken: "sm", innerElevation: "xs", opacityToken: "lg", outerElevation: "md" }, xl: { blurToken: "md", borderToken: "md", innerElevation: "xs", opacityToken: "xl", outerElevation: "lg" },
  "2xl": { blurToken: "lg", borderToken: "md", innerElevation: "sm", opacityToken: "2xl", outerElevation: "xl" }, "3xl": { blurToken: "xl", borderToken: "lg", innerElevation: "sm", opacityToken: "3xl", outerElevation: "3xl" },
} satisfies UiOverlayTokens;
export const DEFAULT_OVERLAY_RECIPE = DEFAULT_OVERLAY_RECIPES.md;
