import { clientThemeManifest } from "../theme.manifest";
import { clientPtBR } from "../../locales/pt-BR";

export const portalAppShellConfig = {
  mode: "client",
  theme: clientThemeManifest,
  strings: clientPtBR.appShell,
  navigationGroups: [
    { key: "shop", labelKey: "navigationGroups.shop", order: 0 },
    { key: "account", labelKey: "navigationGroups.account", order: 1 },
    { key: "support", labelKey: "navigationGroups.support", order: 2 }
  ],
  navigationPlacements: {
    bottomTabBar: {
      routeKeys: ["home", "cortes", "produtos", "minhaConta"]
    },
    nativeTabBar: {
      inheritFrom: "bottomTabBar"
    }
  },
  layout: {
    desktop: "header",
    mobile: "headerMobile",
    totalCols: 20,
    viewports: {
      desktop: {
        content: { width: "full", gutter: "none" },
        header: { width: "full", gutter: "page", align: "between" },
        footer: { width: "wide", gutter: "page" },
        bottomTabBar: { enabled: false, width: "full", gutter: "none" }
      },
      mobile: {
        content: { width: "full", gutter: "none" },
        header: { enabled: false, width: "full", gutter: "page" },
        footer: { enabled: false, width: "full", gutter: "page" },
        bottomTabBar: { enabled: true, width: "full", gutter: "page" }
      },
      native: {
        inheritFrom: "mobile",
        content: { width: "full", gutter: "page" },
        bottomTabBar: { enabled: true, width: "full", gutter: "page" }
      }
    }
  },
  sidebar: {
    enabled: false,
    collapsible: true,
    defaultCollapsed: false,
    expandedCols: 3,
    collapsedCols: 1,
    brandNameKey: "brand.name",
    brandLogo: "/assets/brand/royal-prime-logo.jpg",
    showUserProfile: false
  },
  header: {
    enabled: true,
    layoutMode: "attached",
    visualStyle: "portalClassic",
    surfaceStyle: "solid",
    brandDisplay: "text",
    drawerTrigger: false,
    navAppearance: "pill",
    navAlignment: "left",
    contentOffsetTop: "var(--theme--dimensions-height-3xl)",
    brandSurface: "none",
    brandRoutePath: "/home",
    mobile: {
      enabled: false
    },
    floatingTopOffsetToken: "none",
    paddingXToken: "xl",
    paddingYToken: "md",
    gapLateralToken: "md",
    navGapToken: "xl",
    brandNameKey: "brand.name",
    brandLogo: "/assets/brand/royal-prime-logo.jpg"
  },
  auth: {
    mockAuthenticated: false,
    mobileMockAuthenticated: false,
    publicNavKeys: ["home", "cortes", "produtos"],
    protectedNavKeys: ["minhaCaixa", "royalDelivery", "meuClube", "meusPedidos", "minhaConta"]
  },
  bottomTabBar: {
    enabled: true,
    contentOffsetBottom: "var(--theme--dimensions-height-3xl)"
  },
  nativeTabBar: {
    enabled: true
  },
  native: {
    header: {
      enabled: false
    }
  },
  drawer: {
    enabled: true,
    position: "left"
  },
  footer: {
    enabled: false
  }
};
