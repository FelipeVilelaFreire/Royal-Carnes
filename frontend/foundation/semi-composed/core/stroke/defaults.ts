import type { UiStrokeTokens } from "../themeBindings";
import type { StrokeRecipe } from "./contract";

export const DEFAULT_STROKE_RECIPES = {
  "2xs": { borderToken: "2xs", opacityToken: "2xs" }, xs: { borderToken: "xs", opacityToken: "xs" }, sm: { borderToken: "sm", opacityToken: "sm" }, md: { borderToken: "md", opacityToken: "md" },
  lg: { borderToken: "lg", opacityToken: "lg" }, xl: { borderToken: "xl", opacityToken: "xl" }, "2xl": { borderToken: "2xl", opacityToken: "2xl" }, "3xl": { borderToken: "3xl", opacityToken: "3xl" },
} satisfies UiStrokeTokens;
export const DEFAULT_STROKE_RECIPE: StrokeRecipe = DEFAULT_STROKE_RECIPES.md;
