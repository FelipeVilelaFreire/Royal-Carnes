import { resolveUiFoundationTokens, type UiFoundationTokenOverrides } from "../themeBindings";
import type { OuterElevationRecipeLevel } from "./contract";

export const resolveOuterElevationRecipe = (level: OuterElevationRecipeLevel = "none", overrides?: UiFoundationTokenOverrides) => resolveUiFoundationTokens(overrides).elevation[level];
