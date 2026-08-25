import {
  createUiColorTokens as createThemeColorTokens,
  DEFAULT_UI_COLOR_TOKENS as themeDefaultColors,
  type UiColorTokens
} from "../../tokens";

export type UiAmbientEffectRecipeTokens = any;
export type UiBackgroundRecipeTokens = any;
export type UiDisabledTokens = any;
export type UiDividerTokens = any;
export type UiDropdownPanelTokens = any;
export type UiFieldRecipeTokens = any;
export type UiFieldRecipe = any;
export type UiFieldRecipeLevel = any;
export type UiGlassLevel = any;
export type UiSurfacePreset = any;
export type UiSurfaceAppearanceToken = any;
export type UiMotionRecipe = any;
export type UiMotionRecipeLevel = any;
export type UiStrokeLevel = any;
export type UiStrokeRecipe = any;
export type UiFocusRingTokens = any;
export type UiGradientTokens = any;
export type UiInteractionTokens = any;
export type UiListboxOptionTokens = any;
export type UiListboxTokens = any;
export type UiMotionRecipeTokens = any;
export type UiOverlayTokens = any;
export type UiStateLayerTokens = any;
export type UiStrokeTokens = any;
export type UiSurfaceRecipeTokens = any;
export type UiSurfaceTokens = any;

export const DEFAULT_UI_FOUNDATION_TOKENS: any = {
  typography: {
    fontToken: "body",
    letterSpacingToken: "md",
    lineHeightToken: "md",
    sizeToken: "md",
    toneToken: "text",
    weightToken: "regular"
  },
  sizing: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px"
  }
};

export const normalizeUiSemanticSize = (size: any) => String(size || "16px");
export const resolveFamilySemanticSize = (sizing: any, size: any, family?: any, recipes?: any) => {
  if (typeof size === "number") return size;
  return 16;
};

export const createUiColorTokens = (overrides: any = {}): UiColorTokens => {
  if (typeof overrides === "string") {
    return createThemeColorTokens(overrides) as any;
  }
  return { ...themeDefaultColors, ...overrides };
};

export const DEFAULT_UI_COLOR_TOKENS: UiColorTokens = themeDefaultColors;
export const resolveContrastTextColor = (background: string) => "#FFFFFF";
export const resolveReadableAccentColor = (accent: string, background: string) => "#D4AF37";
