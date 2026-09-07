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
        footer: { width: "wide", gutter: "page", align: "center" },
        bottomTabBar: { enabled: false, width: "full", gutter: "none" }
      },
      mobile: {
        content: { width: "full", gutter: "none" },
        header: { enabled: true, width: "full", gutter: "page", align: "between" },
        footer: { enabled: false, width: "full", gutter: "page" },
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
    navAppearance: "pill",
    navAlignment: "center",
    contentOffsetTop: "var(--theme--dimensions-height-3xl)",
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
    enabled: true
  }
};

export const clientAppShellConfig = landingAppShellConfig;
