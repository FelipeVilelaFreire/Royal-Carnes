export type SemiLevel = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type SemiElevationLevel = "none" | SemiLevel;

export type SurfaceAppearance = "solid" | "soft" | "outline" | "transparent" | "glass" | "gradient";
export type SurfaceTone = "neutral" | "primary" | "success" | "warning" | "danger";

export interface TextRecipe {
  fontToken: string;
  sizeToken: SemiLevel;
  weightToken: string;
  lineHeightToken: SemiLevel;
  letterSpacingToken: SemiLevel;
  toneToken: string;
}

export interface IconRecipe {
  sizeToken: SemiLevel;
  strokeToken: SemiLevel;
  fillToken: string;
  toneToken: string;
}

export interface StrokeRecipe {
  widthToken: SemiElevationLevel;
  styleToken: string;
  toneToken: string;
  opacityToken: string;
}

export interface ElevationRecipe {
  level: SemiElevationLevel;
  colorToken: string;
  opacityToken?: string;
}

export interface StateLayerRecipe {
  hoverToneToken: string;
  hoverOpacityToken: string;
  pressedToneToken: string;
  pressedOpacityToken: string;
  selectedToneToken: string;
  selectedOpacityToken: string;
}

export interface FocusRingRecipe {
  widthToken: string;
  offsetToken: string;
  radiusToken: string;
  toneToken: string;
}

export interface MotionRecipe {
  durationToken: string;
  easingToken: string;
  pressedScaleToken: string;
}

export interface DisabledRecipe {
  opacityToken: string;
  toneToken: string;
  cursor: string;
}

export interface GlassRecipe {
  blurToken: SemiLevel;
  borderOpacityToken: SemiLevel;
  noiseToken: SemiLevel;
  opacityToken: string;
  stroke: StrokeRecipe;
  tintOpacityToken: SemiLevel;
}

export interface GradientRecipe {
  angleToken: SemiLevel;
  directionToken: string;
  fromPositionToken: SemiLevel;
  intensityToken: SemiLevel;
  opacityToken: string;
  stops: Array<{ colorToken: string; position: number }>;
  toPositionToken: SemiLevel;
}

export interface SurfaceRecipe {
  radiusToken: string;
  strokeLevel: SemiElevationLevel;
  outerElevationLevel: SemiElevationLevel;
  innerElevationLevel: SemiElevationLevel;
  glassLevel: SemiLevel;
  gradientLevel: SemiLevel;
}

export interface SurfaceAppearanceConfig {
  material: string;
  bgOpacityToken: string;
  borderOpacityToken: string;
  useToneSurface: boolean;
  useGradient: boolean;
  useGlass: boolean;
}

export interface SurfaceToneConfig {
  bgToken: string;
  fgToken: string;
  borderToken: string;
  stateToneToken: string;
  softBgToken: string;
  gradientFromToken: string;
  gradientToToken: string;
}

export interface SemiComposedConfig {
  text: Record<SemiLevel, TextRecipe>;
  icon: Record<SemiLevel, IconRecipe>;
  stroke: Record<SemiElevationLevel, StrokeRecipe>;
  outerElevation: Record<SemiElevationLevel, ElevationRecipe>;
  innerElevation: Record<SemiElevationLevel, ElevationRecipe>;
  stateLayer: Record<SemiLevel, StateLayerRecipe>;
  focusRing: Record<SemiLevel, FocusRingRecipe>;
  motion: Record<SemiLevel, MotionRecipe>;
  disabled: Record<SemiLevel, DisabledRecipe>;
  glass: Record<SemiLevel, GlassRecipe>;
  gradient: Record<SemiLevel, GradientRecipe>;
  surface: Record<SemiLevel, SurfaceRecipe>;
  surfaceAppearance: Record<SurfaceAppearance, SurfaceAppearanceConfig>;
  surfaceTone: Record<SurfaceTone, SurfaceToneConfig>;
}
