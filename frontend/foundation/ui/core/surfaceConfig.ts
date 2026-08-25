import { createUiColorTokens } from "../../tokens";
import { resolveUiFoundationTokens } from "../../semi-composed/core";
import { resolveSurfaceUiConfig } from "./resolver";
import type { FoundationUiConfig, LegacyThemeConfig, SurfaceUiConfig, UiColorTokens, UiThemeConfig } from "./contract";

export type { LegacyThemeConfig } from "./contract";

export function normalizeFoundationUiConfig(ui?: Partial<SurfaceUiConfig>, legacyTheme?: LegacyThemeConfig): FoundationUiConfig {
  const resolved = resolveSurfaceUiConfig(ui);
  const existingTheme = ui?.theme;
  const { mode: _legacyMode, ...supplied } = { ...legacyTheme, ...existingTheme?.modes.light };
  const light: UiColorTokens = createUiColorTokens(supplied);
  const theme: UiThemeConfig = {
    defaultMode: existingTheme?.defaultMode || legacyTheme?.mode || "light",
    modes: { light, ...(existingTheme?.modes.dark ? { dark: createUiColorTokens(existingTheme.modes.dark) } : {}) },
    tokenScales: existingTheme?.tokenScales,
    tokens: resolveUiFoundationTokens(existingTheme?.tokens, existingTheme?.tokenScales),
  };

  return { ...resolved, theme };
}

export function resolveUiThemeTokens(ui: Pick<FoundationUiConfig, "theme"> | { theme?: UiThemeConfig }, preferredMode?: "dark" | "light") {
  const theme = ui.theme || resolveSurfaceUiConfig().theme;
  const mode = preferredMode || (theme.defaultMode === "dark" ? "dark" : "light");
  return mode === "dark" && theme.modes.dark ? theme.modes.dark : theme.modes.light;
}
