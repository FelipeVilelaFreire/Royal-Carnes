import type { UiColorTokens, UiThemeConfig, UiThemePhysicalTokens } from "../../tokens";

export type UiSizeRecipes = any;
export type UiTypographyTokens = any;
export type UiSemanticSize = SemiLevel | string;
export type UiSizingTokens = any;
export type ThemeColorToken = keyof UiColorTokens | string;

export const SEMI_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SemiLevel = (typeof SEMI_LEVELS)[number];
export type SemiElevationLevel = "none" | SemiLevel;
export type ThemeOpacityToken = "0" | "5" | "10" | "15" | "20" | "25" | "30" | "40" | "50" | "60" | "70" | "75" | "80" | "90" | "95" | "100" | "invisible" | "opaque" | string;
export type ThemeBorderToken = "none" | "hairline" | "thin" | "medium" | "thick" | string;
export type ThemeRadiusToken = "none" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | string;

export type SemiThemeInput = {
  modes: {
    dark: UiColorTokens;
    light: UiColorTokens;
  };
  tokenScales?: any;
  tokens: UiThemePhysicalTokens;
};

export type StrokeRecipe = {
  opacityToken: ThemeOpacityToken;
  toneToken: keyof UiColorTokens | string;
  widthToken: ThemeBorderToken | SemiLevel | string;
  styleToken?: string;
};

export type ResolvedStrokeRecipe = StrokeRecipe & {
  color: string;
  opacity: number;
  width: number;
};

export type GlassRecipe = {
  blurToken: SemiLevel | string;
  borderOpacityToken: ThemeOpacityToken;
  noiseToken: SemiLevel | string;
  opacityToken: ThemeOpacityToken;
  stroke: StrokeRecipe;
  tintOpacityToken: ThemeOpacityToken;
};

export type ResolvedGlassRecipe = GlassRecipe & {
  blur: number;
  borderOpacity: number;
  noise: number;
  opacity: number;
  stroke: ResolvedStrokeRecipe;
  tintOpacity: number;
};

export type GradientStopRecipe = {
  colorToken: keyof UiColorTokens | string;
  position: number;
};

export type ResolvedGradientStopRecipe = GradientStopRecipe & {
  color: string;
};

export type GradientRecipe = {
  angleToken: SemiLevel | string;
  directionToken: "diagonalBackward" | "diagonalForward" | "horizontal" | "vertical" | string;
  fromPositionToken: SemiLevel | string;
  intensityToken: SemiLevel | string;
  opacityToken: ThemeOpacityToken;
  stops: GradientStopRecipe[];
  toPositionToken: SemiLevel | string;
};

export type ResolvedGradientRecipe = GradientRecipe & {
  cssImage: string;
  direction: string;
  fromPosition: number;
  intensity: number;
  opacity: number;
  stops: ResolvedGradientStopRecipe[];
  toPosition: number;
};

export type ElevationRecipe = {
  colorToken: keyof UiColorTokens | string;
  level: SemiLevel | string;
  opacityToken?: ThemeOpacityToken;
};

export type ResolvedElevationRecipe = ElevationRecipe & {
  blur: number;
  color: string;
  native: { blur: number; color: string; opacity: number; x: number; y: number };
  opacity: number;
  shadow: string;
  spread: number;
  x: number;
  y: number;
};

export type SurfaceAppearance = "glass" | "gradient" | "outline" | "soft" | "solid" | "transparent";
export type SurfaceMaterial = "acrylic" | "flat" | "glass" | "mica" | "smoke";
export type SurfaceTone = "accent" | "danger" | "neutral" | "primary" | "success" | "warning";

export type SurfaceAppearanceRecipe = {
  bgOpacityToken: ThemeOpacityToken;
  borderOpacityToken: ThemeOpacityToken;
  material: SurfaceMaterial | string;
  useGlass?: boolean;
  useGradient?: boolean;
  useToneSurface?: boolean;
};

export type SurfaceToneRecipe = {
  bgToken: keyof UiColorTokens | string;
  borderToken: keyof UiColorTokens | string;
  fgToken: keyof UiColorTokens | string;
  gradientFromToken: keyof UiColorTokens | string;
  gradientToToken: keyof UiColorTokens | string;
  softBgToken: keyof UiColorTokens | string;
  stateToneToken?: string;
};

export type SurfaceRecipe = {
  glassLevel?: SemiLevel | string;
  gradientLevel?: SemiLevel | string;
  innerElevationLevel: SemiLevel | string;
  outerElevationLevel: SemiLevel | string;
  radiusToken: ThemeRadiusToken;
  strokeLevel: SemiLevel | string;
};

export type ResolvedSurfaceRecipe = SurfaceRecipe & {
  appearance: SurfaceAppearance;
  bg: string;
  bgOpacity: number;
  color: string;
  foregroundToken: keyof UiColorTokens | string;
  glass?: ResolvedGlassRecipe;
  gradient?: ResolvedGradientRecipe;
  gradientBg?: string;
  innerElevation: ResolvedElevationRecipe;
  material: SurfaceMaterial | string;
  outerElevation: ResolvedElevationRecipe;
  radius: number;
  stroke: ResolvedStrokeRecipe;
  tone: SurfaceTone;
  interaction: {
    background: number;
    border: number;
    borderWidth: number;
    duration: number;
    lift: number;
    scale: number;
    shadow: number;
  };
};

export type SurfaceRecipeOverride = Partial<SurfaceRecipe>;
export type SurfaceResolveOptions = {
  appearance?: SurfaceAppearance;
  overrides?: SurfaceRecipeOverride;
  tone?: SurfaceTone;
};

export type TextRecipe = {
  fontToken: string;
  letterSpacingToken: SemiLevel | string;
  lineHeightToken: SemiLevel | string;
  sizeToken: SemiLevel | string;
  toneToken: keyof UiColorTokens | string;
  weightToken: string;
};

export type ResolvedTextRecipe = TextRecipe & {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
};

export type IconRecipe = {
  fillToken: keyof UiColorTokens | "none" | string;
  sizeToken: SemiLevel | string;
  strokeToken: ThemeBorderToken | SemiLevel | string;
  toneToken: keyof UiColorTokens | string;
};

export type ResolvedIconRecipe = IconRecipe & {
  color: string;
  fill: string;
  size: number;
  strokeWidth: number;
};

export type StateLayerRecipe = {
  hoverOpacityToken: ThemeOpacityToken;
  hoverToneToken: keyof UiColorTokens | string;
  pressedOpacityToken: ThemeOpacityToken;
  pressedToneToken: keyof UiColorTokens | string;
  selectedOpacityToken: ThemeOpacityToken;
  selectedToneToken: keyof UiColorTokens | string;
};

export type ResolvedStateLayerRecipe = StateLayerRecipe & {
  hoverColor: string;
  hoverOpacity: number;
  pressedColor: string;
  pressedOpacity: number;
  selectedColor: string;
  selectedOpacity: number;
};

export type FocusRingRecipe = {
  offsetToken: SemiLevel | string;
  radiusToken: ThemeRadiusToken;
  toneToken: keyof UiColorTokens | string;
  widthToken: ThemeBorderToken | SemiLevel | string;
};

export type ResolvedFocusRingRecipe = FocusRingRecipe & {
  color: string;
  offset: number;
  radius: number;
  width: number;
};

export type MotionRecipe = {
  durationToken: SemiLevel | string;
  easingToken: "bounce" | "emphasized" | "standard" | string;
  pressedScaleToken: SemiLevel | string;
};

export type ResolvedMotionRecipe = MotionRecipe & {
  durationMs: number;
  easing: string;
  pressedScale: number;
};

export type DisabledRecipe = {
  opacityToken: ThemeOpacityToken;
  toneToken: keyof UiColorTokens | string;
};

export type ResolvedDisabledRecipe = DisabledRecipe & {
  color: string;
  opacity: number;
};

export type SemiComposedConfig = {
  disabled: Record<SemiLevel, DisabledRecipe>;
  focusRing: Record<SemiLevel, FocusRingRecipe>;
  glass: Record<SemiLevel, GlassRecipe>;
  gradient: Record<SemiLevel, Omit<GradientRecipe, "stops">>;
  innerElevation: Record<SemiLevel, ElevationRecipe>;
  icon: Record<SemiLevel, IconRecipe>;
  motion: Record<SemiLevel, MotionRecipe>;
  outerElevation: Record<SemiLevel, ElevationRecipe>;
  stateLayer: Record<SemiLevel, StateLayerRecipe>;
  stroke: Record<SemiLevel, StrokeRecipe>;
  surface: Record<SemiLevel, SurfaceRecipe>;
  surfaceAppearance: Record<SurfaceAppearance, SurfaceAppearanceRecipe>;
  surfaceTone: Record<SurfaceTone, SurfaceToneRecipe>;
  text: Record<SemiLevel, TextRecipe>;
};
