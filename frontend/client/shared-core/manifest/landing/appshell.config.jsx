import { clientThemeManifest } from "../theme.manifest";
import { clientPtBR } from "../../locales/pt-BR";

export const landingAppShellConfig = {
  mode: "client",
  theme: clientThemeManifest,
  strings: clientPtBR.appShell,
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
  nativeTabBar: {
    enabled: false
  },
  footer: {
    enabled: true
  }
};

export const clientAppShellConfig = landingAppShellConfig;
