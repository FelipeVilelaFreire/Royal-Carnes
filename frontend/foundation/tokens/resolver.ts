import { themeTokens, themeColorsDefault } from "./theme.tokens";

export interface ThemeManifest {
  surface?: "client" | "admin";
  colors?: Record<string, string>;
  [key: string]: any;
}

export function injectThemeTokens(target: "client" | "admin" = "client", customManifest?: ThemeManifest) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isClient = target === "client";

  const colors = customManifest?.colors || (isClient ? themeColorsDefault.dark : themeColorsDefault.admin);

  root.style.setProperty("--theme--color-bg", colors.background || (isClient ? themeTokens.colors.bgClient : themeTokens.colors.bgAdmin));
  root.style.setProperty("--theme--color-surface", colors.surface || (isClient ? themeTokens.colors.surfaceClient : themeTokens.colors.surfaceAdmin));
  root.style.setProperty("--theme--color-surface-container", colors.surfaceContainer || (isClient ? themeTokens.colors.surfaceContainer : themeTokens.colors.surfaceContainerAdmin));
  root.style.setProperty("--theme--color-primary", colors.primary || (isClient ? themeTokens.colors.primaryClient : themeTokens.colors.primaryAdmin));
  root.style.setProperty("--theme--color-border", colors.border || (isClient ? "rgba(80, 69, 53, 0.4)" : "rgba(200, 157, 102, 0.25)"));
  root.style.setProperty("--theme--color-text", colors.text || (isClient ? themeTokens.colors.textClient : themeTokens.colors.textAdmin));
  root.style.setProperty("--theme--color-text-muted", colors.textMuted || (isClient ? themeTokens.colors.textMutedClient : themeTokens.colors.textMutedAdmin));

  root.style.setProperty("--theme--status-active", colors.statusActive || themeTokens.colors.statusActive);
  root.style.setProperty("--theme--status-paused", colors.statusPaused || themeTokens.colors.statusPaused);
  root.style.setProperty("--theme--status-canceled", colors.statusCanceled || themeTokens.colors.statusCanceled);

  root.style.setProperty("--theme--radius-md", themeTokens.radius.md);
  root.style.setProperty("--theme--radius-lg", themeTokens.radius.lg);
  root.style.setProperty("--theme--radius-full", themeTokens.radius.full);

  root.setAttribute("data-theme-surface", target);
}
