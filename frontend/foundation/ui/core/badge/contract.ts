import type {
  ResolvedSurfaceRecipe,
  ResolvedTextRecipe,
  SemiLevel,
  SurfaceAppearance,
  SurfaceRecipeOverride,
  SurfaceTone,
  ThemeRadiusToken,
} from "../../../semi-composed/core/contract";

export const BADGE_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type BadgeLevel = (typeof BADGE_LEVELS)[number];
export type BadgeShape = "circle" | "pill" | "rounded";
export type BadgeWidth = "content" | "full";
export type BadgeTextTone = "danger" | "default" | "inherit" | "primary" | "success" | "warning";

export type BadgeSurfaceSelection = {
  level: SemiLevel;
  overrides?: SurfaceRecipeOverride;
};

export type BadgeSemanticDefaults = {
  appearance: SurfaceAppearance;
  level: BadgeLevel;
  shape: BadgeShape;
  tone: SurfaceTone;
  width: BadgeWidth;
};

export type BadgeRecipe = {
  paddingXToken: SemiLevel;
  paddingYToken: SemiLevel;
  radiusToken: ThemeRadiusToken;
  sizeToken: SemiLevel;
  surface: BadgeSurfaceSelection;
  text: SemiLevel;
};

export type BadgeConfig = {
  defaults: BadgeSemanticDefaults;
  recipes: Record<BadgeLevel, BadgeRecipe>;
};

export type BadgeResolveOptions = {
  appearance?: SurfaceAppearance;
  level?: BadgeLevel;
  shape?: BadgeShape;
  surfaceLevel?: SemiLevel;
  surfaceOverrides?: SurfaceRecipeOverride;
  tone?: SurfaceTone;
  width?: BadgeWidth;
};

export type ResolvedBadgeRecipe = BadgeRecipe & {
  appearance: SurfaceAppearance;
  blockSize?: number;
  inlineSize?: number;
  level: BadgeLevel;
  paddingX: number;
  paddingY: number;
  radius: number;
  shape: BadgeShape;
  surfaceRecipe: ResolvedSurfaceRecipe;
  textRecipe: ResolvedTextRecipe;
  textTone: BadgeTextTone;
  tone: SurfaceTone;
  width: BadgeWidth;
};
