import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { AmbientRecipeLevel, AmbientRecipeMaterial } from "./contract";
export const resolveAmbientRecipe = (material: AmbientRecipeMaterial = "auroraBlur", level: AmbientRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).ambientEffectRecipes[material][level];
