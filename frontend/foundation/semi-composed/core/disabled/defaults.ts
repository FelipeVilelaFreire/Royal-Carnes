import type { UiDisabledTokens } from "../themeBindings";

export const DEFAULT_DISABLED_RECIPES = {
  "2xs": { opacityToken: "2xs", stroke: "2xs" }, xs: { opacityToken: "xs", stroke: "2xs" }, sm: { opacityToken: "sm", stroke: "xs" }, md: { opacityToken: "md", stroke: "xs" },
  lg: { opacityToken: "lg", stroke: "sm" }, xl: { opacityToken: "xl", stroke: "sm" }, "2xl": { opacityToken: "2xl", stroke: "md" }, "3xl": { opacityToken: "3xl", stroke: "md" },
} satisfies UiDisabledTokens;
export const DEFAULT_DISABLED_RECIPE = DEFAULT_DISABLED_RECIPES.md;
