import { resolveThemePhysicalTokens, themeColorsDefault, themeTokens } from "./theme.tokens";

export interface ThemeManifest {
  surface?: "client" | "admin";
  colors?: Record<string, string>;
  defaultMode?: string;
  modes?: Record<string, Record<string, string>>;
  tokens?: Record<string, any>;
  [key: string]: any;
}

const px = (value: unknown) => typeof value === "number" ? `${value}px` : String(value);

const formatScaleValue = (prefix: string, value: unknown) => {
  if (prefix.startsWith("z-index")) return String(value);
  return px(value);
};

const setScaleVariables = (
  root: HTMLElement,
  prefix: string,
  values: Record<string, unknown> | undefined,
) => {
  if (!values) return;
  Object.entries(values).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      setScaleVariables(root, `${prefix}-${key}`, value as Record<string, unknown>);
      return;
    }
    root.style.setProperty(`--theme--${prefix}-${key}`, formatScaleValue(prefix, value));
  });
};

export function injectThemeTokens(target: "client" | "admin" = "client", customManifest?: ThemeManifest) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isClient = target === "client";

  const mode = customManifest?.defaultMode || (isClient ? "dark" : "admin");
  const modeColors = customManifest?.modes?.[mode] || customManifest?.modes?.dark;
  const colors = (customManifest?.colors || modeColors || (isClient ? themeColorsDefault.dark : themeColorsDefault.admin)) as Record<string, string>;
  const tokens = resolveThemePhysicalTokens(customManifest?.tokens);

  root.style.setProperty("--theme--color-bg", colors.background || themeTokens.colors.bgClientDark);
  root.style.setProperty("--theme--color-background", colors.background || themeTokens.colors.bgClientDark);
  root.style.setProperty("--theme--color-surface", colors.surface || themeTokens.colors.surfaceClientDark);
  root.style.setProperty("--theme--color-surface-container", colors.surfaceContainer || themeTokens.colors.surfaceContainerDark);
  root.style.setProperty("--theme--color-primary", colors.primary || themeTokens.colors.primaryClientDark);
  root.style.setProperty("--theme--color-primary-container", colors.primaryContainer || colors.primary || themeTokens.colors.primaryClientDark);
  root.style.setProperty("--theme--color-accent", colors.accent || colors.copper || themeTokens.colors.accentCopperDark);
  root.style.setProperty("--theme--color-accent-contrast", colors.accentContrast || colors.background || themeTokens.colors.bgClientDark);
  root.style.setProperty("--theme--color-border", colors.border || themeColorsDefault.dark.border);
  root.style.setProperty("--theme--color-text", colors.text || themeTokens.colors.textClientDark);
  root.style.setProperty("--theme--color-text-muted", colors.textMuted || themeTokens.colors.textMutedClientDark);

  root.style.setProperty("--theme--status-active", colors.statusActive || colors.success || themeTokens.colors.statusActive);
  root.style.setProperty("--theme--status-paused", colors.statusPaused || colors.warning || themeTokens.colors.statusPaused);
  root.style.setProperty("--theme--status-canceled", colors.statusCanceled || colors.danger || themeTokens.colors.statusCanceled);

  Object.entries(colors).forEach(([key, value]) => {
    if (value) root.style.setProperty(`--theme--color-${key}`, value);
  });

  setScaleVariables(root, "typography", tokens.typography);
  setScaleVariables(root, "spacing", tokens.spacing);
  setScaleVariables(root, "dimensions", tokens.dimensions);
  setScaleVariables(root, "radius", tokens.radius);
  setScaleVariables(root, "borders", tokens.borders);
  setScaleVariables(root, "elevation", tokens.elevation);
  setScaleVariables(root, "layout", tokens.layout);
  setScaleVariables(root, "motion", tokens.motion);
  setScaleVariables(root, "blur", tokens.blur);
  setScaleVariables(root, "z-index", tokens.zIndex);

  root.style.setProperty("--theme--radius-md", px(tokens.radius?.md ?? themeTokens.radius.md));
  root.style.setProperty("--theme--radius-lg", px(tokens.radius?.lg ?? themeTokens.radius.lg));
  root.style.setProperty("--theme--radius-full", px(tokens.radius?.full ?? themeTokens.radius.full));
  root.style.setProperty("--theme--spacing-md", px(tokens.spacing?.spaceMd ?? themeTokens.spacing.md));
  root.style.setProperty("--theme--spacing-lg", px(tokens.spacing?.spaceLg ?? themeTokens.spacing.lg));
  root.style.setProperty("--theme--layout-container-sm", px(tokens.layout?.containerSm ?? 720));
  root.style.setProperty("--theme--layout-container-md", px(tokens.layout?.containerMd ?? 960));
  root.style.setProperty("--theme--layout-container-lg", px(tokens.layout?.containerLg ?? 1180));
  root.style.setProperty("--theme--layout-container-xl", px(tokens.layout?.containerXl ?? themeTokens.spacing.containerMax));

  root.setAttribute("data-theme-surface", target);
  root.setAttribute("data-theme-mode", mode);
}
