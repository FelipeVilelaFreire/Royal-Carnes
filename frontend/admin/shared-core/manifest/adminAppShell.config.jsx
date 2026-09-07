import { adminThemeManifest } from "./theme.manifest";
import { adminPtBR } from "../locales/pt-BR";
import { adminNavigationGroups } from "../navigation/admin.navigation";

export const adminAppShellConfig = {
  mode: "admin",
  theme: adminThemeManifest,
  strings: adminPtBR.appShell,
  navigationGroups: adminNavigationGroups,
  navigationPlacements: {
    header: {
      enabled: false
    },
    sidebar: {
      routeKeys: ["dashboard", "produtos", "assinaturas", "pedidos", "deliveries", "usuarios", "configuracoes"]
    },
    drawer: {
      inheritFrom: "sidebar"
    },
    bottomTabBar: {
      routeKeys: ["dashboard", "pedidos", "deliveries", "produtos", "configuracoes"]
    },
    nativeTabBar: {
      inheritFrom: "bottomTabBar"
    },
    footer: {
      enabled: false
    }
  },
  layout: {
    desktop: "sidebar",
    mobile: "bottomTabBar",
    totalCols: 20,
    viewports: {
      desktop: {
        content: { width: "full", gutter: "none" },
        header: { enabled: false, width: "full", gutter: "none" },
        footer: { enabled: false, width: "full", gutter: "none" },
        bottomTabBar: { enabled: false, width: "full", gutter: "none" }
      },
      mobile: {
        content: { width: "full", gutter: "none" },
        header: { enabled: false, width: "full", gutter: "page" },
        footer: { enabled: false, width: "full", gutter: "page" },
        bottomTabBar: { enabled: true, width: "full", gutter: "page", align: "evenly" }
      },
      native: {
        inheritFrom: "mobile",
        content: { width: "full", gutter: "page" },
        bottomTabBar: { enabled: true, width: "full", gutter: "page", align: "evenly" }
      }
    }
  },
  header: {
    enabled: false
  },
  sidebar: {
    enabled: true,
    collapsible: true,
    defaultCollapsed: false,
    density: "compact",
    expandedCols: 3,
    collapsedCols: 1,
    brandNameKey: "brand.name",
    brandKickerKey: "brand.tagline",
    brandLogo: "/assets/brand/royal-prime-logo.jpg",
    showUserProfile: false
  },
  bottomTabBar: {
    enabled: true,
    contentOffsetBottom: "var(--theme--dimensions-height-3xl)"
  },
  nativeTabBar: {
    enabled: true
  },
  drawer: {
    enabled: true,
    position: "left"
  },
  footer: {
    enabled: false
  }
};
