import { adminThemeManifest } from "./theme.manifest";

export const adminAppShellConfig = {
  mode: "admin",
  theme: adminThemeManifest,
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
  }
};
