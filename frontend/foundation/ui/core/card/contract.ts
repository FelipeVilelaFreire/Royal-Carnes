import type { ResolvedSurfaceRecipe, SemiLevel, SurfaceAppearance, SurfaceRecipeOverride, SurfaceTone } from "../../../semi-composed/core/contract";

export const CARD_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type CardLevel = (typeof CARD_LEVELS)[number];
export type CardWidth = "content" | "full";

export type CardSurfaceSelection = {
  level: SemiLevel;
  overrides?: SurfaceRecipeOverride;
};

export type CardSemanticDefaults = {
  appearance: SurfaceAppearance;
  level: CardLevel;
  tone: SurfaceTone;
  width: CardWidth;
};

export type CardRecipe = {
  gapToken: SemiLevel;
  paddingToken: SemiLevel;
  surface: CardSurfaceSelection;
};

export type CardConfig = {
  defaults: CardSemanticDefaults;
  recipes: Record<CardLevel, CardRecipe>;
};

export type CardResolveOptions = {
  appearance?: SurfaceAppearance;
  level?: CardLevel;
  surfaceLevel?: SemiLevel;
  surfaceOverrides?: SurfaceRecipeOverride;
  tone?: SurfaceTone;
  width?: CardWidth;
};

export type ResolvedCardRecipe = CardRecipe & {
  appearance: SurfaceAppearance;
  gap: number;
  level: CardLevel;
  padding: number;
  surfaceRecipe: ResolvedSurfaceRecipe;
  tone: SurfaceTone;
  width: CardWidth;
};
