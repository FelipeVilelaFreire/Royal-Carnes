import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { StateLayerRecipeLevel } from "./contract";
export const resolveStateLayerRecipe = (level: StateLayerRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).stateLayers[level];
