import { resolveUiFoundationTokens, type UiFoundationTokenOverrides } from "../themeBindings";
import type { InnerElevationRecipeLevel } from "./contract";

export const resolveInnerElevationRecipe = (level: InnerElevationRecipeLevel = "none", overrides?: UiFoundationTokenOverrides) => resolveUiFoundationTokens(overrides).elevation[level];
