import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { SurfaceRecipeLevel, SurfaceRecipeMaterial } from "./contract";
export const resolveSurfaceRecipe = (material: SurfaceRecipeMaterial = "solid", level: SurfaceRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).surfaceRecipes[material][level];
