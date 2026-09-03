import { royalPrimeThemeTokens } from "../../../shared-core/manifest";

const adminColors = {
  ...royalPrimeThemeTokens.modes.dark,
  border: "rgba(201, 162, 39, 0.25)",
  statusActive: royalPrimeThemeTokens.modes.dark.success,
  statusPaused: royalPrimeThemeTokens.modes.dark.warning,
  statusCanceled: royalPrimeThemeTokens.modes.dark.danger,
};

export const adminThemeManifest = {
  ...royalPrimeThemeTokens,
  surface: "admin",
  themeName: "ROYAL PRIME ADMIN Executive System",
  colors: adminColors,
  modes: {
    ...royalPrimeThemeTokens.modes,
    admin: adminColors,
  },
  defaultMode: "admin",
  typography: {
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
  },
  layout: {
    ...royalPrimeThemeTokens.tokens.layout,
    sidebarColsExpanded: 3,
    sidebarColsCollapsed: 1,
  },
};
