import { resolveThemePhysicalTokens, type UiThemePhysicalTokenOverrides, type UiThemePhysicalTokens, type UiThemeTokenScales } from "../../tokens";
import type { UiAmbientEffectRecipeTokens, UiBackgroundRecipeTokens, UiDisabledTokens, UiDividerTokens, UiDropdownPanelTokens, UiFieldRecipeTokens, UiFocusRingTokens, UiGradientTokens, UiInteractionTokens, UiListboxOptionTokens, UiListboxTokens, UiMotionRecipeTokens, UiOverlayTokens, UiStateLayerTokens, UiStrokeTokens, UiSurfaceRecipeTokens, UiSurfaceTokens } from "./recipeContracts";
import { DEFAULT_DISABLED_RECIPES } from "./disabled/defaults";
import { DEFAULT_DIVIDER_RECIPES } from "./divider/defaults";
import { DEFAULT_FOCUS_RING_RECIPES } from "./focus-ring/defaults";
import { DEFAULT_MOTION_RECIPES } from "./motion/defaults";
import { DEFAULT_INTERACTION_RECIPES, DEFAULT_STATE_LAYER_RECIPES } from "./state-layer/defaults";
import { DEFAULT_STROKE_RECIPES } from "./stroke/defaults";
import { DEFAULT_OVERLAY_RECIPES } from "./overlay/defaults";
import { DEFAULT_DROPDOWN_PANEL_RECIPES } from "./dropdown-panel/defaults";
import { DEFAULT_LISTBOX_RECIPES } from "./listbox/defaults";
import { DEFAULT_LISTBOX_OPTION_RECIPES } from "./listbox-option/defaults";
import { DEFAULT_SURFACE_RECIPES } from "./surface/defaults";
import { DEFAULT_GRADIENT_RECIPES } from "./gradient/defaults";
import { DEFAULT_GLASS_PRESETS } from "./glass/defaults";
import { DEFAULT_BACKGROUND_RECIPES } from "./background/defaults";
import { DEFAULT_AMBIENT_RECIPES } from "./ambient/defaults";
import { DEFAULT_FIELD_RECIPES } from "./field/defaults";

type SemiComposedRecipeTokens = {
  ambientEffectRecipes: UiAmbientEffectRecipeTokens;
  backgroundRecipes: UiBackgroundRecipeTokens;
  disabled: UiDisabledTokens;
  divider: UiDividerTokens;
  dropdownPanels: UiDropdownPanelTokens;
  fieldRecipes: UiFieldRecipeTokens;
  focusRings: UiFocusRingTokens;
  gradients: UiGradientTokens;
  interaction: UiInteractionTokens;
  listboxes: UiListboxTokens;
  listboxOptions: UiListboxOptionTokens;
  motionRecipes: UiMotionRecipeTokens;
  overlays: UiOverlayTokens;
  stateLayers: UiStateLayerTokens;
  strokes: UiStrokeTokens;
  surface: UiSurfaceTokens;
  surfaceRecipes: UiSurfaceRecipeTokens;
};

export type UiFoundationTokens = UiThemePhysicalTokens & SemiComposedRecipeTokens;
export type UiFoundationTokenOverrides = UiThemePhysicalTokenOverrides & Partial<SemiComposedRecipeTokens>;

const resolveDividerOverrides = (overrides?: UiFoundationTokenOverrides): Partial<UiDividerTokens> | undefined =>
  (overrides?.divider as (Partial<UiDividerTokens> & { levels?: Partial<UiDividerTokens> }) | undefined)?.levels
  ?? overrides?.divider as Partial<UiDividerTokens> | undefined;

const mergeRecipeLevels = <T extends Record<string, Record<string, unknown>>>(defaults: T, overrides?: Partial<T>): T => ({
  ...defaults,
  ...Object.fromEntries(Object.entries(overrides || {}).map(([level, recipe]) => [
    level,
    { ...defaults[level], ...recipe },
  ])),
}) as T;

const mergeSurfaceRecipes = (overrides?: Partial<UiSurfaceRecipeTokens>): UiSurfaceRecipeTokens => {
  const recipes = { ...DEFAULT_SURFACE_RECIPES } as UiSurfaceRecipeTokens;
  for (const [material, levels] of Object.entries(overrides || {})) {
    const key = material as keyof UiSurfaceRecipeTokens;
    recipes[key] = mergeRecipeLevels(
      DEFAULT_SURFACE_RECIPES[key] as Record<string, Record<string, unknown>>,
      levels as Record<string, Record<string, unknown>>,
    ) as UiSurfaceRecipeTokens[typeof key];
  }
  return recipes;
};

const mergeGradients = (overrides?: Partial<UiGradientTokens>): UiGradientTokens => ({
  ...DEFAULT_GRADIENT_RECIPES,
  ...Object.fromEntries(Object.entries(overrides || {}).map(([key, recipe]) => [
    key,
    { ...DEFAULT_GRADIENT_RECIPES[key as keyof UiGradientTokens], ...recipe },
  ])),
}) as UiGradientTokens;

const mergeGlassSurfacePresets = (overrides?: Partial<UiSurfaceTokens>): UiSurfaceTokens => {
  const surface: UiSurfaceTokens = {
    available: ["solid", "soft", "outline", "transparent", ...Object.keys(DEFAULT_GLASS_PRESETS)],
    presets: DEFAULT_GLASS_PRESETS as any,
  };
  return {
    ...surface,
    ...overrides,
    available: overrides?.available ? [...overrides.available] : [...surface.available],
    presets: {
      ...surface.presets,
      ...DEFAULT_GLASS_PRESETS,
      ...Object.fromEntries(Object.entries(overrides?.presets || {}).map(([key, preset]) => [
        key,
        { ...(DEFAULT_GLASS_PRESETS[key as keyof typeof DEFAULT_GLASS_PRESETS] || surface.presets[key]), ...preset },
      ])),
    } as any,
  };
};

const mergeBackgroundRecipes = (overrides?: Partial<UiBackgroundRecipeTokens>): UiBackgroundRecipeTokens => {
  const recipes = { ...DEFAULT_BACKGROUND_RECIPES } as UiBackgroundRecipeTokens;
  for (const [material, levels] of Object.entries(overrides || {})) {
    const key = material as keyof UiBackgroundRecipeTokens;
    recipes[key] = mergeRecipeLevels(
      DEFAULT_BACKGROUND_RECIPES[key] as Record<string, Record<string, unknown>>,
      levels as Record<string, Record<string, unknown>>,
    ) as UiBackgroundRecipeTokens[typeof key];
  }
  return recipes;
};

const mergeAmbientRecipes = (overrides?: Partial<UiAmbientEffectRecipeTokens>): UiAmbientEffectRecipeTokens => {
  const recipes = { ...DEFAULT_AMBIENT_RECIPES } as UiAmbientEffectRecipeTokens;
  for (const [material, levels] of Object.entries(overrides || {})) {
    const key = material as keyof UiAmbientEffectRecipeTokens;
    recipes[key] = mergeRecipeLevels(
      DEFAULT_AMBIENT_RECIPES[key] as Record<string, Record<string, unknown>>,
      levels as Record<string, Record<string, unknown>>,
    ) as UiAmbientEffectRecipeTokens[typeof key];
  }
  return recipes;
};

const mergeFieldRecipes = (overrides?: Partial<UiFieldRecipeTokens>): UiFieldRecipeTokens => mergeRecipeLevels(
  DEFAULT_FIELD_RECIPES,
  overrides as any,
) as UiFieldRecipeTokens;

const mergeInteractionRecipes = (overrides?: Partial<UiInteractionTokens>): UiInteractionTokens => ({
  ...DEFAULT_INTERACTION_RECIPES,
  ...overrides,
  levels: {
    ...DEFAULT_INTERACTION_RECIPES.levels,
    ...overrides?.levels,
    base: { ...DEFAULT_INTERACTION_RECIPES.levels.base, ...overrides?.levels?.base },
    depth: { ...DEFAULT_INTERACTION_RECIPES.levels.depth, ...overrides?.levels?.depth },
    transform: { ...DEFAULT_INTERACTION_RECIPES.levels.transform, ...overrides?.levels?.transform },
    time: { ...DEFAULT_INTERACTION_RECIPES.levels.time, ...overrides?.levels?.time },
  },
}) as UiInteractionTokens;

export const resolveSemiComposedFoundationTokens = (overrides?: UiFoundationTokenOverrides, tokenScales?: UiThemeTokenScales): UiFoundationTokens => {
  const themeTokens = resolveThemePhysicalTokens(overrides, tokenScales);
  const dividerOverrides = resolveDividerOverrides(overrides);
  return {
    ...themeTokens,
    surfaceRecipes: mergeSurfaceRecipes(overrides?.surfaceRecipes as Partial<UiSurfaceRecipeTokens> | undefined),
    gradients: mergeGradients(overrides?.gradients),
    interaction: mergeInteractionRecipes(overrides?.interaction),
    surface: mergeGlassSurfacePresets(overrides?.surface),
    backgroundRecipes: mergeBackgroundRecipes(overrides?.backgroundRecipes),
    ambientEffectRecipes: mergeAmbientRecipes(overrides?.ambientEffectRecipes as Partial<UiAmbientEffectRecipeTokens> | undefined),
    fieldRecipes: mergeFieldRecipes(overrides?.fieldRecipes),
    divider: {
      ...DEFAULT_DIVIDER_RECIPES,
      ...Object.fromEntries(Object.entries(dividerOverrides || {}).map(([level, recipe]) => [
        level,
        { ...DEFAULT_DIVIDER_RECIPES[level as keyof UiDividerTokens], ...recipe },
      ])),
    } as UiDividerTokens,
    disabled: mergeRecipeLevels(DEFAULT_DISABLED_RECIPES, overrides?.disabled as any),
    focusRings: mergeRecipeLevels(DEFAULT_FOCUS_RING_RECIPES, overrides?.focusRings as any),
    motionRecipes: mergeRecipeLevels(DEFAULT_MOTION_RECIPES, overrides?.motionRecipes as any),
    stateLayers: mergeRecipeLevels(DEFAULT_STATE_LAYER_RECIPES, overrides?.stateLayers as any),
    strokes: mergeRecipeLevels(DEFAULT_STROKE_RECIPES, overrides?.strokes as any),
    overlays: mergeRecipeLevels(DEFAULT_OVERLAY_RECIPES, overrides?.overlays as any),
    dropdownPanels: mergeRecipeLevels(DEFAULT_DROPDOWN_PANEL_RECIPES, overrides?.dropdownPanels as any),
    listboxOptions: mergeRecipeLevels(DEFAULT_LISTBOX_OPTION_RECIPES, overrides?.listboxOptions as any),
    listboxes: mergeRecipeLevels(DEFAULT_LISTBOX_RECIPES, (overrides as any)?.listboxes as any),
  } as UiFoundationTokens;
};
