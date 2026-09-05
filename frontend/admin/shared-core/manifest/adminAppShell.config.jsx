import { adminThemeManifest } from "./theme.manifest";
import { adminPtBR } from "../locales/pt-BR";

export const adminAppShellConfig = {
  mode: "admin",
  theme: adminThemeManifest,
  strings: adminPtBR.appShell,
  navigationGroups: [
    { key: "overview", labelKey: "navigationGroups.overview", order: 0 },
    { key: "commerce", labelKey: "navigationGroups.commerce", order: 1 },
    { key: "people", labelKey: "navigationGroups.people", order: 2 },
    { key: "system", labelKey: "navigationGroups.system", order: 3 }
  ],
  header: {
    enabled: false
  },
  sidebar: {
    enabled: true,
    collapsible: true,
    defaultCollapsed: false,
    expandedCols: 3,
    collapsedCols: 1,
    showUserProfile: true,
    userProfile: {
      name: "Admin Master",
      badge: "Operador Prime Cut"
    }
  },
  bottomTabBar: {
    enabled: true
  },
  nativeTabBar: {
    enabled: true
  }
};
