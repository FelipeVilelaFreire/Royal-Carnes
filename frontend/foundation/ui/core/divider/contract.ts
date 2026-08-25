import type {
  ResolvedMotionRecipe,
  ResolvedStrokeRecipe,
  SemiElevationLevel,
  SemiLevel,
} from "../../../semi-composed/core/contract";

export const DIVIDER_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export const DIVIDER_ORIENTATIONS = ["horizontal", "vertical"] as const;

export type DividerLevel = (typeof DIVIDER_LEVELS)[number];
export type DividerOrientation = (typeof DIVIDER_ORIENTATIONS)[number];
export type DividerWidth = "content" | "full";

export type DividerSemanticDefaults = {
  level: DividerLevel;
  orientation: DividerOrientation;
  width: DividerWidth;
};

export type DividerRecipe = {
  motion: SemiLevel;
  spacingToken: SemiLevel;
  strokeLevel: SemiElevationLevel;
};

export type DividerConfig = {
  defaults: DividerSemanticDefaults;
  recipes: Record<DividerLevel, DividerRecipe>;
};

export type DividerResolveOptions = {
  level?: DividerLevel;
  orientation?: DividerOrientation;
  width?: DividerWidth;
};

export type ResolvedDividerRecipe = DividerRecipe & {
  level: DividerLevel;
  motionRecipe: ResolvedMotionRecipe;
  opacity: number;
  orientation: DividerOrientation;
  spacing: number;
  strokeRecipe: ResolvedStrokeRecipe;
  width: DividerWidth;
};
