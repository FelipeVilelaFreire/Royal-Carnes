import { glassPresetKey, type UiFoundationTokenOverrides, type UiFoundationTokens, type UiThemeScaleConfig } from "../themeBindings";
import { resolveBorderRecipe } from "../recipeTokens";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { GlassRecipeLevel } from "./contract";

export const resolveGlassRecipe = (level: GlassRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).surface.presets[glassPresetKey(level)];

export type GlassMetricScales = {
  border?: number;
  blur?: number;
  opacity?: number;
  recipe?: number;
  theme?: UiThemeScaleConfig;
};

export type ResolvedGlassLevelMetrics = {
  blur: number;
  borderWidth: number;
  elevation: string;
  innerElevation: string;
  opacity: number;
};

const combinedScale = (...values: number[]) => values.reduce((scale, value) => scale * value / 100, 100);
const roundThemeScaleValue = (value: number) => Math.round(value * 100) / 100;
const applyThemeMetricScale = (base: number, scale: UiThemeScaleConfig | undefined, max?: number) => {
  if (!scale) return base;
  const adjustment = Math.abs(Number.isFinite(scale.adjustment) ? scale.adjustment : 0);
  const direction = scale.direction || (scale.adjustment < 0 ? "decrease" : "increase");
  const delta = direction === "decrease" ? -adjustment : adjustment;
  const resolved = scale.mode === "additive" ? base + delta : base * (100 + delta) / 100;
  return Math.max(0, max === undefined ? roundThemeScaleValue(resolved) : Math.min(max, roundThemeScaleValue(resolved)));
};
const legacyGlassBorderToken = (borderTone = 0): "none" | "2xs" | "xs" | "sm" | "md" =>
  borderTone <= 0 ? "none" : borderTone <= 8 ? "2xs" : borderTone <= 14 ? "xs" : borderTone <= 22 ? "sm" : "md";

/** Resolves Glass material measurements from Theme tokens and explicit config scales. */
export const resolveGlassLevelMetrics = (tokens: UiFoundationTokens, level: GlassRecipeLevel = "md", scales: GlassMetricScales = {}): ResolvedGlassLevelMetrics => {
  const recipe = tokens.surface.presets[glassPresetKey(level)] || tokens.surface.presets.glassMd;
  const recipeScale = combinedScale(scales.recipe ?? 100);
  const blur = (recipe.blurToken ? tokens.blur[recipe.blurToken] : recipe.blur) * combinedScale(recipeScale, scales.blur ?? 100);
  const borderWidth = resolveBorderRecipe(tokens, recipe.borderToken || legacyGlassBorderToken(recipe.borderTone), combinedScale(recipeScale, scales.border ?? 100));
  const opacity = Math.min(100, (recipe.opacityToken ? tokens.opacity[recipe.opacityToken] : recipe.opacity) * combinedScale(recipeScale, scales.opacity ?? 100));
  return {
    blur: applyThemeMetricScale(blur, scales.theme),
    borderWidth: applyThemeMetricScale(borderWidth, scales.theme),
    elevation: recipe.elevation,
    innerElevation: recipe.innerElevation || "none",
    opacity: applyThemeMetricScale(opacity, scales.theme, 100),
  };
};
