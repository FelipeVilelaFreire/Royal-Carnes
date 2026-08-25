import type { UiBackgroundRecipeTokens } from "../themeBindings";

export const DEFAULT_BACKGROUND_RECIPES = {
  plain: {
    "2xs": { motion: "none", overlay: "none" }, xs: { motion: "none", overlay: "none" }, sm: { motion: "none", overlay: "2xs" }, md: { motion: "2xs", overlay: "xs" }, lg: { motion: "xs", overlay: "sm" }, xl: { motion: "sm", overlay: "md" }, "2xl": { motion: "md", overlay: "lg" }, "3xl": { motion: "lg", overlay: "xl" },
  },
  gradient: {
    "2xs": { gradientLevel: "2xs", motion: "none", overlay: "none" }, xs: { gradientLevel: "xs", motion: "none", overlay: "2xs" }, sm: { gradientLevel: "sm", motion: "2xs", overlay: "xs" }, md: { gradientLevel: "md", motion: "xs", overlay: "sm" }, lg: { gradientLevel: "lg", motion: "sm", overlay: "md" }, xl: { gradientLevel: "xl", motion: "md", overlay: "lg" }, "2xl": { gradientLevel: "2xl", motion: "lg", overlay: "xl" }, "3xl": { gradientLevel: "3xl", motion: "xl", overlay: "2xl" },
  },
  glass: {
    "2xs": { glassLevel: "2xs", gradientLevel: "none", motion: "none", overlay: "none", pattern: "none" }, xs: { glassLevel: "xs", gradientLevel: "none", motion: "none", overlay: "2xs", pattern: "none" }, sm: { glassLevel: "sm", gradientLevel: "2xs", motion: "2xs", overlay: "xs", pattern: "noise", patternOpacityToken: "2xs", patternScale: "xs" }, md: { glassLevel: "md", gradientLevel: "xs", motion: "xs", overlay: "sm", pattern: "noise", patternOpacityToken: "xs", patternScale: "sm" }, lg: { glassLevel: "lg", gradientLevel: "sm", motion: "sm", overlay: "md", pattern: "noise", patternOpacityToken: "sm", patternScale: "md" }, xl: { glassLevel: "xl", gradientLevel: "md", motion: "md", overlay: "lg", pattern: "noise", patternOpacityToken: "md", patternScale: "lg" }, "2xl": { glassLevel: "2xl", gradientLevel: "lg", motion: "lg", overlay: "xl", pattern: "noise", patternOpacityToken: "lg", patternScale: "xl" }, "3xl": { glassLevel: "3xl", gradientLevel: "xl", motion: "xl", overlay: "2xl", pattern: "noise", patternOpacityToken: "xl", patternScale: "2xl" },
  },
  image: {
    "2xs": { blurToken: "none", gradientLevel: "none", motion: "none", overlay: "2xs" }, xs: { blurToken: "none", gradientLevel: "none", motion: "none", overlay: "xs" }, sm: { blurToken: "none", gradientLevel: "2xs", motion: "2xs", overlay: "sm" }, md: { blurToken: "2xs", gradientLevel: "xs", motion: "xs", overlay: "md" }, lg: { blurToken: "xs", gradientLevel: "sm", motion: "sm", overlay: "lg" }, xl: { blurToken: "sm", gradientLevel: "md", motion: "md", overlay: "xl" }, "2xl": { blurToken: "md", gradientLevel: "lg", motion: "lg", overlay: "2xl" }, "3xl": { blurToken: "lg", gradientLevel: "xl", motion: "xl", overlay: "3xl" },
  },
  pattern: {
    "2xs": { motion: "none", overlay: "none", pattern: "noise", patternOpacityToken: "2xs", patternScale: "2xs" }, xs: { motion: "none", overlay: "none", pattern: "noise", patternOpacityToken: "xs", patternScale: "xs" }, sm: { motion: "2xs", overlay: "2xs", pattern: "grid", patternOpacityToken: "sm", patternScale: "sm" }, md: { motion: "xs", overlay: "xs", pattern: "grid", patternOpacityToken: "md", patternScale: "md" }, lg: { motion: "sm", overlay: "sm", pattern: "dots", patternOpacityToken: "lg", patternScale: "lg" }, xl: { motion: "md", overlay: "md", pattern: "dots", patternOpacityToken: "xl", patternScale: "xl" }, "2xl": { motion: "lg", overlay: "lg", pattern: "waves", patternOpacityToken: "2xl", patternScale: "2xl" }, "3xl": { motion: "xl", overlay: "xl", pattern: "waves", patternOpacityToken: "3xl", patternScale: "3xl" },
  },
} satisfies UiBackgroundRecipeTokens;

export const DEFAULT_BACKGROUND_RECIPE = DEFAULT_BACKGROUND_RECIPES.plain.md;
