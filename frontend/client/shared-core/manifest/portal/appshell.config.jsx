import { clientThemeManifest } from "../theme.manifest";

export const portalAppShellConfig = {
  mode: "client",
  theme: clientThemeManifest,
  strings: {},
  navigationGroups: [
    { key: "shop", labelKey: "navigationGroups.shop", order: 0 },
    { key: "account", labelKey: "navigationGroups.account", order: 1 },
    { key: "support", labelKey: "navigationGroups.support", order: 2 }
  ],
  navigationPlacements: {
    bottomTabBar: {
      routeKeys: ["home", "catalogo", "produtos", "meusPedidos", "minhaConta"]
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
        bottomTabBar: { enabled: true, width: "full", gutter: "none" }
      },
      native: {
        inheritFrom: "mobile",
        content: { width: "full", gutter: "page" },
        bottomTabBar: { enabled: true, width: "full", gutter: "none" }
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
    appearanceEditor: {
      enabled: true,
      experiments: [
        { group: "home", id: "homeTeste1", path: "/home-teste-1" },
        { group: "home", id: "homeTeste2", path: "/home-teste-2" },
        { group: "home", id: "homeTeste3", path: "/home-teste-3" },
        { group: "home", id: "homeTeste4", path: "/home-teste-4" },
        { group: "home", id: "homeTeste5", path: "/home-teste-5" },
        { group: "home", id: "homeTeste6", path: "/home-teste-6" },
        { group: "home", id: "homeTeste7", path: "/home-teste-7" },
        { group: "home", id: "homeTeste8", path: "/home-teste-8" },
        { group: "orders", id: "meusPedidosTeste1", path: "/meus-pedidos-teste-1" },
        { group: "orders", id: "meusPedidosTeste2", path: "/meus-pedidos-teste-2" },
        { group: "orders", id: "meusPedidosTeste3", path: "/meus-pedidos-teste-3" },
        { group: "orders", id: "meusPedidosTeste4", path: "/meus-pedidos-teste-4" },
        { group: "orders", id: "meusPedidosTeste5", path: "/meus-pedidos-teste-5" },
        { group: "landing", id: "landingTeste1", path: "/landing-teste-1" },
        { group: "landing", id: "landingTeste2", path: "/landing-teste-2" },
        { group: "landing", id: "landingTeste3", path: "/landing-teste-3" },
        { group: "landing", id: "landingTeste4", path: "/landing-teste-4" },
        { group: "landing", id: "landingTeste5", path: "/landing-teste-5" },
        { group: "catalog", id: "catalogoTeste1", path: "/catalogo-teste-1" },
      ],
    },
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
    publicNavKeys: ["home", "catalogo", "produtos"],
    protectedNavKeys: ["meusPedidos", "minhaConta"]
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
