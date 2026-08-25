import { resolveUiFoundationTokens, type UiFoundationTokenOverrides } from "../themeBindings";
import type { IconRecipeAppearance } from "./contract";

export const resolveIconRecipe = (appearance: IconRecipeAppearance = "outline", overrides?: UiFoundationTokenOverrides) => ({
  appearance,
  size: resolveUiFoundationTokens(overrides).sizing.md,
  strokeWidth: 2,
});
