import type {
  ResolvedSurfaceRecipe,
  ResolvedTextRecipe,
  SemiLevel,
  SurfaceAppearance,
  SurfaceTone,
} from "../../../../../semi-composed/core/contract";
import type { FieldLevel, FieldWidth } from "../../contract";

export const COLOR_FIELD_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type ColorFieldLevel = (typeof COLOR_FIELD_LEVELS)[number];
export type ColorFieldWidth = FieldWidth;
export type ColorFieldPreview = "bar" | "card";

export type ColorFieldPreviewSelection = {
  appearance: SurfaceAppearance;
  heightToken: SemiLevel;
  surfaceLevel: SemiLevel;
  tone: SurfaceTone;
};

export type ColorFieldRecipe = {
  contentGapToken: SemiLevel;
  fieldLevel: FieldLevel;
  preview: ColorFieldPreviewSelection;
  previewMode: ColorFieldPreview;
  valueText: SemiLevel;
};

export type ColorFieldConfig = {
  defaults: {
    level: ColorFieldLevel;
    preview: ColorFieldPreview;
    width: ColorFieldWidth;
  };
  recipes: Record<ColorFieldLevel, ColorFieldRecipe>;
};

export type ColorFieldResolveOptions = {
  level?: ColorFieldLevel;
  preview?: ColorFieldPreview;
  width?: ColorFieldWidth;
};

export type ResolvedColorFieldRecipe = ColorFieldRecipe & {
  contentGap: number;
  level: ColorFieldLevel;
  previewHeight: number;
  previewSurfaceRecipe: ResolvedSurfaceRecipe;
  valueTextRecipe: ResolvedTextRecipe;
  width: ColorFieldWidth;
};
