import { clientThemeManifest } from "../theme.manifest";
import { clientPtBR } from "../../locales/pt-BR";

export const landingAppShellConfig = {
  mode: "client",
  theme: {
    ...clientThemeManifest,
    modeStorageKey: "royal_prime_theme",
    modeChangeEvent: "royal_theme_changed"
  },
  strings: clientPtBR.appShell,
  navigationPlacements: {
    bottomTabBar: {
      enabled: false
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
        footer: { width: "full", gutter: "page", align: "center" },
        bottomTabBar: { enabled: false, width: "full", gutter: "none" }
      },
      mobile: {
        content: { width: "full", gutter: "none" },
        header: { enabled: true, width: "full", gutter: "none", align: "between" },
        footer: { enabled: true, width: "full", gutter: "page" },
        bottomTabBar: { enabled: false, width: "full", gutter: "page" }
      },
      native: {
        inheritFrom: "mobile",
        content: { width: "full", gutter: "page" },
        bottomTabBar: { enabled: false, width: "full", gutter: "page" }
      }
    }
  },
  header: {
    enabled: true,
    layoutMode: "attached",
    surfaceStyle: "glassBlur",
    brandDisplay: "text",
    brandSurface: "none",
    drawerTrigger: "mobile",
    heightToken: "2xl",
    compactHeightToken: "xl",
    compactPaddingYToken: "2xs",
    compactBrandSizeToken: "sizeLg",
    compactNavHeightToken: "sm",
    compactNavPaddingXToken: "sm",
    scrollActivationViewportRatio: 0.12,
    scrollResetViewportRatio: 0.03,
    scrollTransitionViewportRatio: 0.18,
    mobileActions: "hidden",
    mobileDrawerPlacement: "end",
    mobile: {
      compactHeightToken: "2xl",
      compactPaddingYToken: "none",
      paddingXToken: "none",
      paddingYToken: "none"
    },
    navAppearance: "pill",
    navAlignment: "center",
    contentOffsetTop: "var(--theme--dimensions-height-2xl)",
    brandRoutePath: "/",
    floatingTopOffsetToken: "sm",
    paddingXToken: "xl",
    paddingYToken: "sm",
    gapLateralToken: "md",
    navGapToken: "xl",
    brandNameKey: "brand.name",
    brandLogo: "/assets/brand/royal-prime-logo.jpg",
    actions: [
      {
        key: "theme",
        type: "themeToggle",
        icon: "theme",
        appearance: "outline",
        tone: "neutral",
        size: "sm",
        darkLabelKey: "headerActions.themeLight",
        lightLabelKey: "headerActions.themeDark"
      },
      {
        key: "portal",
        type: "route",
        path: "/home",
        appearance: "transparent",
        tone: "neutral",
        size: "sm",
        labelKey: "headerActions.enterPortal"
      }
    ]
  },
  sidebar: {
    enabled: false
  },
  bottomTabBar: {
    enabled: false,
    contentOffsetBottom: "0"
  },
  nativeTabBar: {
    enabled: false
  },
  drawer: {
    enabled: true,
    position: "right"
  },
  footer: {
    enabled: true,
    eyebrowKey: "footer.brand.eyebrow",
    descriptionKey: "footer.brand.description",
    legalKey: "footer.legal",
    columns: [
      {
        key: "experience",
        titleKey: "footer.columns.experience",
        links: [
          { key: "footer-home", labelKey: "navigation.home", targetId: "top", type: "scroll" },
          { key: "footer-forms", labelKey: "navigation.productOptions", targetId: "product-options", type: "scroll" },
          { key: "footer-how", labelKey: "navigation.howItWorks", targetId: "how-it-works", type: "scroll" }
        ]
      },
      {
        key: "products",
        titleKey: "footer.columns.products",
        links: [
          { key: "footer-plans", labelKey: "navigation.products", targetId: "assinaturas", type: "scroll" },
          { key: "footer-catalogs", labelKey: "navigation.cortes", path: "/cortes", type: "route" },
          { key: "footer-box", labelKey: "navigation.royalBox", path: "/montar-box", type: "route" },
          { key: "footer-delivery", labelKey: "navigation.royalDelivery", path: "/royal-delivery", type: "route" }
        ]
      },
      {
        key: "portal",
        titleKey: "footer.columns.portal",
        links: [
          { key: "footer-portal", labelKey: "headerActions.enterPortal", path: "/home", type: "route" },
          { key: "footer-orders", labelKey: "navigation.meusPedidos", path: "/meus-pedidos", type: "route" },
          { key: "footer-account", labelKey: "navigation.perfil", path: "/perfil", type: "route" },
          { key: "footer-faq", labelKey: "navigation.faq", targetId: "faq", type: "scroll" }
        ]
      }
    ],
    highlights: [
      { key: "delivery", valueKey: "footer.highlights.delivery.value", labelKey: "footer.highlights.delivery.label" },
      { key: "box", valueKey: "footer.highlights.box.value", labelKey: "footer.highlights.box.label" }
    ]
  }
};

export const clientAppShellConfig = landingAppShellConfig;
