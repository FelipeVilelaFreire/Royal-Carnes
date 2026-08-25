import type { UiFoundationTokenOverrides, UiFoundationTokens } from "../themeBindings";
import { resolveBorderRecipe, resolveMotionDurationRecipe, resolveRadiusRecipe, resolveSpacingRecipe } from "../recipeTokens";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { DividerRecipeLevel } from "./contract";

export const resolveDividerRecipe = (level: DividerRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).divider[level];

export type ResolvedDividerMetrics = {
  borderWidth: number;
  motionDuration: number;
  opacity: number;
  radius: number;
  spacing: number;
};

/**
 * Resolves the concrete Divider recipe from an already-selected Theme token set.
 * Consumers choose the active level; UI Core does not own the recipe arithmetic.
 */
export const resolveDividerMetrics = (tokens: UiFoundationTokens, level: DividerRecipeLevel = "md"): ResolvedDividerMetrics => {
  const recipe = tokens.divider[level] || tokens.divider.md;
  const stroke = recipe.stroke ? tokens.strokes[recipe.stroke] : tokens.strokes.xs;
  const durationLevel = recipe.motion ? tokens.motionRecipes[recipe.motion]?.durationToken : undefined;
  const durationToken = durationLevel
    ? `duration${durationLevel === "2xs" ? "2xs" : durationLevel === "2xl" ? "2xl" : durationLevel === "3xl" ? "3xl" : durationLevel[0].toUpperCase() + durationLevel.slice(1)}` as Parameters<typeof resolveMotionDurationRecipe>[1]
    : undefined;

  return {
    borderWidth: stroke?.borderToken ? resolveBorderRecipe(tokens, stroke.borderToken) : 1,
    motionDuration: durationToken ? resolveMotionDurationRecipe(tokens, durationToken) : 0,
    opacity: Math.min(100, (stroke?.opacityToken ? tokens.opacity[stroke.opacityToken] : 100) * (recipe.opacityToken ? tokens.opacity[recipe.opacityToken] : 100) / 100),
    radius: recipe.radiusToken ? resolveRadiusRecipe(tokens, recipe.radiusToken) : 0,
    spacing: recipe.spacingToken ? resolveSpacingRecipe(tokens, recipe.spacingToken) : 0,
  };
};
