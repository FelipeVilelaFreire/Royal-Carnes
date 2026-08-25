import { type UiFoundationTokenOverrides, type UiFoundationTokens, type UiSurfaceRecipeMaterial } from "../themeBindings";
import { resolveBorderRecipe, resolveElevationRecipe, resolveMotionDurationRecipe, resolveRadiusRecipe, resolveSpacingRecipe } from "../recipeTokens";
import { resolveGlassLevelMetrics } from "../glass/resolver";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { DropdownPanelRecipeLevel } from "./contract";
export const resolveDropdownPanelRecipe = (level: DropdownPanelRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).dropdownPanels[level];

export type ResolvedDropdownPanelMetrics = {
  appearance: UiSurfaceRecipeMaterial;
  borderWidth: number;
  glassBlur: number;
  glassOpacity: number;
  layer: number;
  motionDuration: number;
  offset: number;
  padding: number;
  radius: number;
  safeArea: number;
  shadow: string;
  surfaceLevel: DropdownPanelRecipeLevel;
};

const elevationToCssShadow = (value: ReturnType<typeof resolveElevationRecipe>) =>
  value.opacity <= 0 || (value.blur <= 0 && value.x <= 0 && value.y <= 0)
    ? "none"
    : `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px color-mix(in srgb,var(--color-scrim) ${value.opacity}%,transparent)`;

/** Resolves Dropdown Panel material from the selected Theme token set. */
export const resolveDropdownPanelMetrics = (
  tokens: UiFoundationTokens,
  level: DropdownPanelRecipeLevel = "md",
  appearance: UiSurfaceRecipeMaterial = "solid",
): ResolvedDropdownPanelMetrics => {
  const dropdown = tokens.dropdownPanels[level] || tokens.dropdownPanels.md;
  const surfaceLevel = dropdown.surfaceLevel || level;
  const surface = tokens.surfaceRecipes[appearance]?.[surfaceLevel] || tokens.surfaceRecipes.solid.md;
  const glass = surface.glassLevel && surface.glassLevel !== "none" ? resolveGlassLevelMetrics(tokens, surface.glassLevel) : undefined;
  const stroke = surface.stroke && surface.stroke !== "none" ? tokens.strokes[surface.stroke] : undefined;
  const elevation = surface.outerElevation ? resolveElevationRecipe(tokens, surface.outerElevation) : undefined;
  const durationLevel = dropdown.motion && dropdown.motion !== "none" ? tokens.motionRecipes[dropdown.motion]?.durationToken : undefined;
  const durationToken = durationLevel
    ? `duration${durationLevel === "2xs" ? "2xs" : durationLevel === "2xl" ? "2xl" : durationLevel === "3xl" ? "3xl" : durationLevel[0].toUpperCase() + durationLevel.slice(1)}` as Parameters<typeof resolveMotionDurationRecipe>[1]
    : undefined;
  return {
    appearance,
    borderWidth: stroke?.borderToken ? resolveBorderRecipe(tokens, stroke.borderToken) : 0,
    glassBlur: glass?.blur ?? 0,
    glassOpacity: glass?.opacity ?? 0,
    layer: tokens.layers[dropdown.layerToken || "lg"] ?? tokens.layers.lg,
    motionDuration: durationToken ? resolveMotionDurationRecipe(tokens, durationToken) : 0,
    offset: dropdown.offsetToken ? tokens.spacing[dropdown.offsetToken] ?? 0 : 0,
    padding: surface.paddingToken ? resolveSpacingRecipe(tokens, surface.paddingToken) : 0,
    radius: surface.radiusToken ? resolveRadiusRecipe(tokens, surface.radiusToken) : 0,
    safeArea: dropdown.safeAreaToken ? tokens.spacing[dropdown.safeAreaToken] ?? 0 : 0,
    shadow: elevation ? elevationToCssShadow(elevation) : "none",
    surfaceLevel,
  };
};
