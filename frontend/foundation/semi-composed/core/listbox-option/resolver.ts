import { type UiFoundationTokenOverrides, type UiFoundationTokens, type UiListboxTextLevel } from "../themeBindings";
import { resolveMotionDurationRecipe, resolveRadiusRecipe } from "../recipeTokens";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { ListboxOptionRecipeLevel } from "./contract";
export const resolveListboxOptionRecipe = (level: ListboxOptionRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).listboxOptions[level];

export type ResolvedListboxOptionMetrics = {
  disabledOpacity: number;
  focusOpacity: number;
  gap: number;
  iconLevel: ListboxOptionRecipeLevel;
  motionDuration: number;
  padding: number;
  radius: number;
  stateLayerOpacity: number;
  surfaceLevel: ListboxOptionRecipeLevel;
  textLevel: UiListboxTextLevel;
};

const resolveMotionDuration = (tokens: UiFoundationTokens, level?: string | "none") => {
  if (!level || level === "none") return 0;
  const durationLevel = tokens.motionRecipes[level as keyof typeof tokens.motionRecipes]?.durationToken;
  const durationToken = durationLevel
    ? `duration${durationLevel === "2xs" ? "2xs" : durationLevel === "2xl" ? "2xl" : durationLevel === "3xl" ? "3xl" : durationLevel[0].toUpperCase() + durationLevel.slice(1)}` as Parameters<typeof resolveMotionDurationRecipe>[1]
    : undefined;
  return durationToken ? resolveMotionDurationRecipe(tokens, durationToken) : 0;
};

/** Resolves a Listbox Option recipe from Theme tokens without depending on UI Core. */
export const resolveListboxOptionMetrics = (tokens: UiFoundationTokens, level: ListboxOptionRecipeLevel = "md"): ResolvedListboxOptionMetrics => {
  const option = tokens.listboxOptions[level] || tokens.listboxOptions.md;
  const disabled = option.disabled && option.disabled !== "none" ? tokens.disabled[option.disabled] : undefined;
  const focus = option.focusRing && option.focusRing !== "none" ? tokens.focusRings[option.focusRing] : undefined;
  const stateLayer = option.stateLayer && option.stateLayer !== "none" ? tokens.stateLayers[option.stateLayer] : undefined;
  const surfaceLevel = option.surfaceLevel || level;
  const surface = tokens.surfaceRecipes.solid[surfaceLevel] || tokens.surfaceRecipes.solid.md;
  return {
    disabledOpacity: disabled?.opacityToken ? tokens.opacity[disabled.opacityToken] : tokens.opacity.md,
    focusOpacity: focus?.opacityToken ? tokens.opacity[focus.opacityToken] : tokens.opacity.md,
    gap: option.gapToken ? tokens.spacing[option.gapToken] ?? 0 : 0,
    iconLevel: option.iconLevel || level,
    motionDuration: resolveMotionDuration(tokens, stateLayer?.motion || "none"),
    padding: option.paddingToken ? tokens.spacing[option.paddingToken] ?? 0 : 0,
    radius: surface.radiusToken ? resolveRadiusRecipe(tokens, surface.radiusToken) : 0,
    stateLayerOpacity: stateLayer?.backgroundOpacityToken ? tokens.opacity[stateLayer.backgroundOpacityToken] : 0,
    surfaceLevel,
    textLevel: option.textLevel || "body",
  };
};
