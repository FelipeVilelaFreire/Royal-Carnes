import { clientThemeManifest } from "../theme.manifest";

export const landingAppShellConfig = {
  mode: "client",
  theme: clientThemeManifest,
  layout: {
    desktop: "header",
    mobile: "headerMobile",
    totalCols: 20
  },
  header: {
    enabled: true,
    layoutMode: "attached",
    surfaceStyle: "glassBlur",
    floatingTopOffsetToken: "none",
    paddingXToken: "xl",
    paddingYToken: "md",
    gapLateralToken: "md",
    navGapToken: "xl",
    brandName: "ROYAL PRIME",
    brandLogo: "/assets/brand/royal-prime-logo.jpg"
  },
  sidebar: {
    enabled: false
  },
  bottomTabBar: {
    enabled: false
  },
  footer: {
    enabled: true
  }
};

export const clientAppShellConfig = landingAppShellConfig;
