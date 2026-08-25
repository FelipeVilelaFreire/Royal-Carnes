import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { BackgroundRecipeLevel, BackgroundRecipeMaterial } from "./contract";
export const resolveBackgroundRecipe = (material: BackgroundRecipeMaterial = "plain", level: BackgroundRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).backgroundRecipes[material][level];
