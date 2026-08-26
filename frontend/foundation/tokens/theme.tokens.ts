export type UiColorTokens = {
  primary: string;
  primaryContainer?: string;
  background: string;
  surface: string;
  surfaceContainer?: string;
  border: string;
  text: string;
  textMuted: string;
  accentCrimson?: string;
  copper?: string;
  charcoal?: string;
  ivory?: string;
  linen?: string;
  edge?: string;
  graphite?: string;
  [key: string]: string | undefined;
};

export type UiSpacingTokens = Record<string, number | string>;

export type UiThemeConfig = {
  mode?: "dark" | "light" | "admin" | "system";
  defaultMode?: "dark" | "light" | "admin" | "system";
  modes?: Record<string, any>;
  colors?: UiColorTokens;
  tokens?: any;
  [key: string]: any;
};

export type UiThemePhysicalTokens = {
  typography: Record<string, any>;
  dimensions: Record<string, any>;
  borders: Record<string, any>;
  elevation: Record<string, any>;
  spacing: Record<string, any>;
  radius: Record<string, any>;
  motion: Record<string, any>;
  glass: Record<string, any>;
  gradient: Record<string, any>;
  opacity: Record<string, any>;
  layout: Record<string, any>;
};

export type UiThemePhysicalTokenOverrides = Partial<UiThemePhysicalTokens>;
export type UiThemeTokenScales = Record<string, any>;

export const themeTokens = {
  colors: {
    // Royal Carnes Prime - Dark Mode (Gourmet Velvet)
    bgClientDark: "#0B0908",
    surfaceClientDark: "#151312",
    surfaceContainerDark: "#1A1817",
    primaryClientDark: "#FFC665",
    accentCopperDark: "#B87333",
    textClientDark: "#E8E1DE",
    textMutedClientDark: "#D4C4B0",

    // Royal Carnes Prime - Light Mode (Editorial Luxury)
    bgClientLight: "#FCFBF7",
    surfaceClientLight: "#FCFBF7",
    surfaceContainerLight: "#F2F1ED",
    primaryClientLight: "#1A1A1A",
    accentCopperLight: "#B87333",
    borderClientLight: "#D1D1D1",
    textClientLight: "#1A1A1A",
    textMutedClientLight: "#4A4A4A",

    // Admin Sapphire Slate
    bgAdmin: "#080F1E",
    surfaceAdmin: "#0F1A30",
    surfaceContainerAdmin: "#172645",
    primaryAdmin: "#00E5FF",
    primaryContainerAdmin: "#008B9B",
    borderAdmin: "rgba(0, 229, 255, 0.3)",
    textAdmin: "#F0F8FF",
    textMutedAdmin: "#8DA7C4",

    statusActive: "#10B981",
    statusPaused: "#F59E0B",
    statusCanceled: "#EF4444"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    stackSm: "16px",
    stackMd: "40px",
    stackLg: "80px",
    gridGapDense: "12px",
    containerMax: "1280px"
  },
  radius: {
    sm: "4px",
    DEFAULT: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    full: "9999px"
  },
  layout: {
    desktopCols: 20,
    sidebarColsExpanded: 3,
    sidebarColsCollapsed: 1,
    usefulColsWide: 17,
    usefulColsNarrow: 14
  }
};

export const themeColorsDefault = {
  dark: {
    primary: "#FFC665",
    primaryContainer: "#E5A93C",
    background: "#0B0908",
    surface: "#151312",
    surfaceContainer: "#1A1817",
    border: "rgba(80, 69, 53, 0.4)",
    text: "#E8E1DE",
    textMuted: "#D4C4B0",
    accentCrimson: "#A40213",
    copper: "#B87333",
    charcoal: "#1A1A1A",
    ivory: "#FCFBF7",
    linen: "#F2F1ED",
    edge: "#D1D1D1",
    graphite: "#4A4A4A"
  },
  light: {
    primary: "#1A1A1A",
    primaryContainer: "#1C1B1B",
    background: "#FCFBF7",
    surface: "#FCFBF7",
    surfaceContainer: "#F2F1ED",
    border: "#D1D1D1",
    text: "#1A1A1A",
    textMuted: "#4A4A4A",
    accentCrimson: "#BA1A1A",
    copper: "#B87333",
    charcoal: "#1A1A1A",
    ivory: "#FCFBF7",
    linen: "#F2F1ED",
    edge: "#D1D1D1",
    graphite: "#4A4A4A"
  },
  admin: {
    primary: "#FFC665",
    primaryContainer: "#E5A93C",
    background: "#0B0908",
    surface: "#151312",
    surfaceContainer: "#1A1817",
    border: "rgba(201, 162, 39, 0.25)",
    text: "#E8E1DE",
    textMuted: "#D4C4B0",
    accentCrimson: "#A40213"
  }
};

export const themeSpacingDefault = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px"
};

export const createUiColorTokens = (mode: string = "dark") => {
  return (themeColorsDefault as any)[mode] || themeColorsDefault.dark;
};

export const resolveThemePhysicalTokens = (tokens: any, scales?: any): UiThemePhysicalTokens => {
  const base = tokens || {};
  return {
    typography: {
      fontToken: "'Inter', sans-serif",
      headingFamily: "'Playfair Display', serif",
      bodyFamily: "'Inter', sans-serif",
      size2xs: 10,
      sizeXs: 12,
      sizeSm: 14,
      sizeMd: 16,
      sizeLg: 18,
      sizeXl: 24,
      size2xl: 32,
      size3xl: 40,
      size4xl: 64,
      lineHeight2xs: 14,
      lineHeightXs: 16,
      lineHeightSm: 20,
      lineHeightMd: 24,
      lineHeightLg: 28,
      lineHeightXl: 32,
      lineHeight2xl: 40,
      lineHeight3xl: 48,
      lineHeight4xl: 72,
      regular: 400,
      semibold: 600,
      bold: 700,
      ...base.typography,
    },
    dimensions: {
      height: { "2xs": 24, xs: 28, sm: 32, md: 40, lg: 48, xl: 56, "2xl": 64, "3xl": 72 },
      minWidth: { "2xs": 48, xs: 64, sm: 80, md: 96, lg: 120, xl: 140, "2xl": 160, "3xl": 200 },
      icon: { "2xs": 12, xs: 14, sm: 16, md: 20, lg: 24, xl: 28, "2xl": 32, "3xl": 40 },
      ...base.dimensions,
    },
    borders: { none: 0, hairline: 1, thin: 1, medium: 2, thick: 3, ...base.borders },
    elevation: {
      none: { opacity: 0, native: { blur: 0, color: "#000000", opacity: 0, x: 0, y: 0 }, x: 0, y: 0, blur: 0, spread: 0 },
      sm: { opacity: 4, native: { blur: 32, color: "#000000", opacity: 0.06, x: 0, y: 12 }, x: 0, y: 12, blur: 32, spread: 0 },
      md: { opacity: 6, native: { blur: 40, color: "#000000", opacity: 0.06, x: 0, y: 20 }, x: 0, y: 20, blur: 40, spread: 0 },
      ...base.elevation,
    },
    spacing: { space2xs: 4, spaceXs: 8, spaceSm: 12, spaceMd: 16, spaceLg: 24, spaceXl: 32, space2xl: 48, space3xl: 64, ...base.spacing },
    radius: { none: 0, sm: 4, md: 6, lg: 8, xl: 12, "2xl": 16, full: 9999, ...base.radius },
    motion: { duration2xs: 100, durationXs: 150, durationSm: 200, durationMd: 250, durationLg: 300, durationXl: 400, duration2xl: 500, duration3xl: 600, ...base.motion },
    glass: base.glass || {},
    gradient: base.gradient || {},
    opacity: { "0": 0, "5": 5, "10": 10, "15": 15, "20": 20, "25": 25, "30": 30, "40": 40, "50": 50, "60": 60, "70": 70, "75": 75, "80": 80, "90": 90, "95": 95, "100": 100, invisible: 0, opaque: 100, ...base.opacity },
    layout: {
      desktopCols: 20,
      sidebarColsExpanded: 3,
      sidebarColsCollapsed: 1,
      usefulColsWide: 17,
      usefulColsNarrow: 14,
      ...base.layout
    },
  };
};

export const DEFAULT_UI_COLOR_TOKENS = themeColorsDefault.dark;
export const resolveContrastTextColor = (bg: string) => "#FFFFFF";
export const resolveReadableAccentColor = (accent: string, background: string) => "#B87333";
