import { resolveSurfaceUiConfig, type ResolvedUiConfig, type SurfaceUiConfig } from "./core";
import { foundationTokenCssVariables } from "./foundationTokenCssVariables";

export const cssVariables = (config?: SurfaceUiConfig): Record<string, string> => {
  const resolved = resolveSurfaceUiConfig(config);
  return {
    ...foundationTokenCssVariables(resolved.tokens),
    "--ui-theme-primary": resolved.tokens.colors.primary,
    "--ui-theme-surface": resolved.tokens.colors.surface,
  };
};

export type { ResolvedUiConfig, SurfaceUiConfig };
