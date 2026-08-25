import type {
  ResolvedDisabledRecipe,
  ResolvedFocusRingRecipe,
  ResolvedIconRecipe,
  ResolvedMotionRecipe,
  ResolvedStateLayerRecipe,
  ResolvedSurfaceRecipe,
  ResolvedTextRecipe,
  SemiLevel,
  SurfaceRecipeOverride,
  SurfaceTone,
} from "../../../semi-composed/core/contract";

export const BUTTON_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export const BUTTON_TONES = ["neutral", "primary", "success", "warning", "danger"] as const;
export const BUTTON_APPEARANCES = ["solid", "soft", "outline", "transparent", "glass"] as const;
export type ButtonLevel = (typeof BUTTON_LEVELS)[number];
export type ButtonTone = SurfaceTone;
export type ButtonAppearance = (typeof BUTTON_APPEARANCES)[number];
export type ButtonWidth = "content" | "full";

export type ButtonSurfaceSelection = {
  level: SemiLevel;
  overrides?: SurfaceRecipeOverride;
};

export type ButtonSemanticDefaults = {
  appearance: ButtonAppearance;
  level: ButtonLevel;
  tone: ButtonTone;
};

export type ButtonRecipe = {
  heightToken: SemiLevel;
  minWidthToken: SemiLevel;
  gapToken: SemiLevel;
  paddingXToken: SemiLevel;
  paddingYToken: SemiLevel;
  text: SemiLevel;
  icon: SemiLevel;
  surface: ButtonSurfaceSelection;
  stateLayer: SemiLevel;
  focusRing: SemiLevel;
  motion: SemiLevel;
  disabled: SemiLevel;
};

export type ButtonConfig = {
  defaults: ButtonSemanticDefaults;
  recipes: Record<ButtonLevel, ButtonRecipe>;
};

export type ButtonResolveOptions = {
  appearance?: ButtonAppearance;
  level?: ButtonLevel;
  surfaceLevel?: SemiLevel;
  surfaceOverrides?: SurfaceRecipeOverride;
  tone?: ButtonTone;
};

export type ResolvedButtonRecipe = ButtonRecipe & {
  appearance: ButtonAppearance;
  disabledRecipe: ResolvedDisabledRecipe;
  focusRingRecipe: ResolvedFocusRingRecipe;
  gap: number;
  height: number;
  iconRecipe: ResolvedIconRecipe;
  level: ButtonLevel;
  minWidth: number;
  motionRecipe: ResolvedMotionRecipe;
  paddingX: number;
  paddingY: number;
  stateLayerRecipe: ResolvedStateLayerRecipe;
  surfaceRecipe: ResolvedSurfaceRecipe;
  textRecipe: ResolvedTextRecipe;
  tone: ButtonTone;
};
