import { portalAppShellConfig } from "./appshell.config";

export type AppThemeMode = "dark" | "light";

export const createMobileAppShellConfig = (themeMode: AppThemeMode = "dark") => {
  const theme = (portalAppShellConfig.theme || {}) as any;
  const colors = theme.modes?.[themeMode] || theme.colors;

  return {
    ...portalAppShellConfig,
    mode: "client",
    theme: {
      ...theme,
      colors,
      defaultMode: themeMode,
    },
  };
};
