import { resolveRoyalPrimeThemeMode, royalPrimeThemeTokens } from "../../../../shared-core/manifest/theme";
import { clientThemeModes } from "./colors";

export const resolveClientThemeMode = (mode: "dark" | "light" = "dark") =>
  resolveRoyalPrimeThemeMode(mode, clientThemeModes);

export const clientResolvedThemeModes = {
  dark: resolveClientThemeMode("dark"),
  light: resolveClientThemeMode("light"),
};

export const clientThemeTokens = {
  ...royalPrimeThemeTokens,
  surface: "client",
  themeName: "ROYAL PRIME Gourmet Experience",
  defaultMode: "dark",
  modes: clientResolvedThemeModes,
  colors: clientResolvedThemeModes.dark,
  typography: {
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
  },
  layout: royalPrimeThemeTokens.tokens.layout,
};
