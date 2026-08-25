import { clientThemeManifest } from "../theme.manifest";

export const portalAppShellConfig = {
  mode: "client",
  theme: clientThemeManifest,
  layout: {
    desktop: "header",
    mobile: "headerMobile",
    totalCols: 20
  },
  sidebar: {
    enabled: false,
    collapsible: true,
    defaultCollapsed: false,
    expandedCols: 3,
    collapsedCols: 1,
    brandName: "ROYAL PRIME",
    brandLogo: "/assets/brand/royal-prime-logo.jpg",
    showUserProfile: true,
    userProfile: {
      name: "Felipe",
      badge: "Membro Royal VIP",
      since: "Agosto/2026"
    }
  },
  header: {
    enabled: true,
    layoutMode: "attached",
    surfaceStyle: "glassBlur",
    navAlignment: "left",
    contentOffsetTop: "92px",
    brandKicker: "Carnes premium",
    brandSurface: "elevated",
    brandRoutePath: "/home",
    mobile: {
      enabled: false
    },
    floatingTopOffsetToken: "none",
    paddingXToken: "xl",
    paddingYToken: "md",
    gapLateralToken: "md",
    navGapToken: "xl",
    brandName: "ROYAL PRIME",
    brandLogo: "/assets/brand/royal-prime-logo.jpg"
  },
  auth: {
    mockAuthenticated: false,
    mobileMockAuthenticated: true,
    publicNavKeys: ["home", "cortes"],
    protectedNavKeys: ["minhaCaixa", "royalDelivery", "meuClube"]
  },
  bottomTabBar: {
    enabled: true,
    contentOffsetBottom: "76px"
  },
  drawer: {
    enabled: true,
    position: "left"
  },
  footer: {
    enabled: false
  }
};
