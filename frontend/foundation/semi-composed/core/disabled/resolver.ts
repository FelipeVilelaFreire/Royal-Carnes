import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { DisabledRecipeLevel } from "./contract";
export const resolveDisabledRecipe = (level: DisabledRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).disabled[level];
