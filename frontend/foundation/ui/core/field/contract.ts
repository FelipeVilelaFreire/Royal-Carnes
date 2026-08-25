import type { ResolvedTextRecipe, SemiLevel, TextRecipe, ThemeColorToken } from "../../../semi-composed/core/contract";

export const FIELD_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type FieldLevel = (typeof FIELD_LEVELS)[number];
export type FieldWidth = "content" | "full";

export type FieldTextSelection = {
  level: SemiLevel;
  toneToken: ThemeColorToken;
};

export type FieldRecipe = {
  controlGapToken: SemiLevel;
  description: FieldTextSelection;
  error: FieldTextSelection;
  label: FieldTextSelection;
  textGapToken: SemiLevel;
};

export type FieldConfig = {
  defaults: {
    level: FieldLevel;
    width: FieldWidth;
  };
  recipes: Record<FieldLevel, FieldRecipe>;
};

export type FieldResolveOptions = {
  level?: FieldLevel;
  width?: FieldWidth;
};

export type ResolvedFieldRecipe = FieldRecipe & {
  controlGap: number;
  descriptionTextRecipe: ResolvedTextRecipe;
  errorTextRecipe: ResolvedTextRecipe;
  labelTextRecipe: ResolvedTextRecipe;
  level: FieldLevel;
  textGap: number;
  width: FieldWidth;
};

export type FieldResolvedTextSlot = TextRecipe & ResolvedTextRecipe;
