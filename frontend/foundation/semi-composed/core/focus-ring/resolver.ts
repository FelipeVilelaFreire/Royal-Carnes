import type { UiFoundationTokenOverrides } from "../themeBindings";
import { resolveSemiComposedFoundationTokens } from "../resolveTokens";
import type { FocusRingRecipeLevel } from "./contract";
export const resolveFocusRingRecipe = (level: FocusRingRecipeLevel = "md", overrides?: UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(overrides).focusRings[level];
