import { adminThemeManifest } from "./theme.manifest";
import { adminPtBR } from "../locales/pt-BR";

export const adminAppShellConfig = {
  mode: "admin",
  theme: adminThemeManifest,
  strings: adminPtBR.appShell,
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
