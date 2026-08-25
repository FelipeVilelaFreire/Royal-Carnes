import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { GradientRecipeLevel } from "./contract";
export const resolveGradientRecipe = (level: GradientRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).gradients[level];
