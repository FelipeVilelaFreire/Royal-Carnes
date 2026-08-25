import { type UiFoundationTokenOverrides, type UiFoundationTokens, type UiListboxTextLevel } from "../themeBindings";
import { resolveMotionDurationRecipe } from "../recipeTokens";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { ListboxRecipeLevel } from "./contract";
export const resolveListboxRecipe = (level: ListboxRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).listboxes[level];

export type ResolvedListboxMetrics = {
  disabledOpacity: number;
  focusOpacity: number;
  gap: number;
  iconLevel: ListboxRecipeLevel;
  motionDuration: number;
  stateLayerOpacity: number;
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

/** Resolves a Listbox recipe from Theme tokens without depending on UI Core. */
export const resolveListboxMetrics = (tokens: UiFoundationTokens, level: ListboxRecipeLevel = "md"): ResolvedListboxMetrics => {
  const listbox = tokens.listboxes[level] || tokens.listboxes.md;
  const disabled = listbox.disabled && listbox.disabled !== "none" ? tokens.disabled[listbox.disabled] : undefined;
  const focus = listbox.focusRing && listbox.focusRing !== "none" ? tokens.focusRings[listbox.focusRing] : undefined;
  const stateLayer = listbox.stateLayer && listbox.stateLayer !== "none" ? tokens.stateLayers[listbox.stateLayer] : undefined;
  return {
    disabledOpacity: disabled?.opacityToken ? tokens.opacity[disabled.opacityToken] : tokens.opacity.md,
    focusOpacity: focus?.opacityToken ? tokens.opacity[focus.opacityToken] : tokens.opacity.md,
    gap: listbox.gapToken ? tokens.spacing[listbox.gapToken] ?? 0 : 0,
    iconLevel: listbox.iconLevel || level,
    motionDuration: resolveMotionDuration(tokens, listbox.motion),
    stateLayerOpacity: stateLayer?.backgroundOpacityToken ? tokens.opacity[stateLayer.backgroundOpacityToken] : 0,
    textLevel: listbox.textLevel || "body",
  };
};
