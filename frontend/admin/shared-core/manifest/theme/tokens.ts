import { resolveRoyalPrimeThemeMode, royalPrimeThemeTokens } from "../../../../shared-core/manifest/theme";
import { adminThemeModes } from "./colors";

export const resolveAdminThemeMode = (mode: "admin" | "dark" | "light" = "admin") =>
  resolveRoyalPrimeThemeMode(mode, adminThemeModes);

export const adminResolvedThemeModes = {
  dark: resolveAdminThemeMode("dark"),
  light: resolveAdminThemeMode("light"),
  admin: resolveAdminThemeMode("admin"),
};

export const adminThemeTokens = {
  ...royalPrimeThemeTokens,
  surface: "admin",
  themeName: "ROYAL PRIME ADMIN Executive System",
  colors: adminResolvedThemeModes.admin,
  modes: adminResolvedThemeModes,
  defaultMode: "admin",
  tokens: {
    ...royalPrimeThemeTokens.tokens,
    typography: {
      ...royalPrimeThemeTokens.tokens.typography,
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      headingFamily: "'Plus Jakarta Sans', sans-serif",
      monoFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    },
  },
  layout: {
    ...royalPrimeThemeTokens.tokens.layout,
    sidebarColsExpanded: 3,
    sidebarColsCollapsed: 1,
  },
} as const;
