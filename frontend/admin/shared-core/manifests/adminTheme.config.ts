import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export const adminThemeConfig = {
  themeName: "PrimeCut Admin Executive Design System",
  mode: "admin",
  colors: themeColorsDefault.admin,
  typography: {
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif"
  },
  layout: {
    desktopCols: 20,
    sidebarColsExpanded: 3,
    sidebarColsCollapsed: 1
  }
};
