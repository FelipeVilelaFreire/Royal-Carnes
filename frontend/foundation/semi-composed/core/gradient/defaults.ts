import type { UiGradientTokens } from "../themeBindings";

const level = (fromOpacity: number, toOpacity: number, intensity: number) => ({
  fromOpacity,
  fromOpacityToken: undefined,
  fromPosition: 0,
  fromPositionToken: "none",
  intensity,
  intensityToken: undefined,
  toOpacity,
  toOpacityToken: undefined,
  toPosition: 100,
  toPositionToken: "3xl",
} as const);

/** Gradient composition defaults belong to Semi-composed; colors resolve from Theme. */
export const DEFAULT_GRADIENT_RECIPES = {
  "2xs": level(16, 8, 8),
  xs: level(32, 8, 16),
  sm: level(48, 16, 32),
  md: level(64, 32, 48),
  lg: level(80, 48, 64),
  xl: level(92, 64, 80),
  "2xl": level(100, 80, 92),
  "3xl": level(100, 92, 100),
  brand: { direction: "135deg", from: "primary", fromOpacity: 100, level: "lg", to: "primary", toOpacity: 52 },
  brandSoft: { direction: "135deg", from: "primary", fromOpacity: 28, level: "sm", to: "surface", toOpacity: 100 },
  success: { direction: "135deg", from: "success", fromOpacity: 100, level: "lg", to: "success", toOpacity: 48 },
  warning: { direction: "135deg", from: "warning", fromOpacity: 100, level: "lg", to: "warning", toOpacity: 48 },
  danger: { direction: "135deg", from: "danger", fromOpacity: 100, level: "lg", to: "danger", toOpacity: 48 },
} satisfies UiGradientTokens;

export const DEFAULT_GRADIENT_RECIPE = DEFAULT_GRADIENT_RECIPES.md;
