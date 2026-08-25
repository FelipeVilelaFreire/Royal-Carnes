import type { UiElevationLevel, UiFoundationTokens } from "../semi-composed/core";

export const foundationTokenCssVariables = (tokens?: UiFoundationTokens): Record<string, string> => {
  if (!tokens) return {};
  return {
    "--ui-spacing-sm": tokens.spacing?.sm || "8px",
    "--ui-spacing-md": tokens.spacing?.md || "16px",
    "--ui-spacing-lg": tokens.spacing?.lg || "24px",
  };
};

export type { UiElevationLevel, UiFoundationTokens };
