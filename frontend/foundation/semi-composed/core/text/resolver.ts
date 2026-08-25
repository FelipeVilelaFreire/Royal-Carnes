import { resolveUiFoundationTokens, type UiFoundationTokenOverrides } from "../themeBindings";
import type { TextRecipe } from "./contract";

export const resolveTextRecipe = (overrides?: UiFoundationTokenOverrides): TextRecipe => resolveUiFoundationTokens(overrides).typography;
