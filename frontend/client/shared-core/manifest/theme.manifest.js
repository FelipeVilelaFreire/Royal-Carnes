import { royalPrimeThemeTokens } from "../../../shared-core/manifest";

export const clientThemeManifest = {
  ...royalPrimeThemeTokens,
  surface: "client",
  themeName: "ROYAL PRIME Gourmet Experience",
  colors: royalPrimeThemeTokens.modes.dark,
  typography: {
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
  },
  layout: royalPrimeThemeTokens.tokens.layout,
};
