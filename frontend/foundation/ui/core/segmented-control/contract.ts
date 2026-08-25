import type { ResolvedSurfaceRecipe, SemiLevel, SurfaceAppearance, SurfaceTone } from "../../../semi-composed/core/contract";
import type { ButtonAppearance, ButtonLevel, ButtonTone, ButtonWidth } from "../button";

export const SEGMENTED_CONTROL_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export const SEGMENTED_CONTROL_VARIANTS = ["panel", "inline"] as const;
export type SegmentedControlLevel = (typeof SEGMENTED_CONTROL_LEVELS)[number];
export type SegmentedControlVariant = (typeof SEGMENTED_CONTROL_VARIANTS)[number];
export type SegmentedControlWidth = "content" | "full";

export type SegmentedControlOption = {
  disabled?: boolean;
  iconKey?: string;
  key: string;
  label: string;
};

export type SegmentedControlButtonSelection = {
  align: "center" | "end" | "start";
  appearance: ButtonAppearance;
  level: ButtonLevel;
  minWidthToken?: SemiLevel;
  tone: ButtonTone;
  width: ButtonWidth;
};

export type ResolvedSegmentedControlButtonSelection = SegmentedControlButtonSelection & {
  minWidth?: number;
};

export type SegmentedControlTrackSelection = {
  appearance: SurfaceAppearance;
  gapToken: SemiLevel;
  paddingToken: SemiLevel;
  surfaceLevel: SemiLevel;
  tone: SurfaceTone;
};

export type SegmentedControlRecipe = {
  activeOption: SegmentedControlButtonSelection;
  option: SegmentedControlButtonSelection;
  track: SegmentedControlTrackSelection;
};

export type SegmentedControlVariantRecipe = {
  activeOption?: Partial<SegmentedControlButtonSelection>;
  option?: Partial<SegmentedControlButtonSelection>;
  track?: Partial<SegmentedControlTrackSelection>;
};

export type SegmentedControlConfig = {
  defaults: {
    level: SegmentedControlLevel;
    variant: SegmentedControlVariant;
    width: SegmentedControlWidth;
  };
  recipes: Record<SegmentedControlLevel, SegmentedControlRecipe>;
  variants: Record<SegmentedControlVariant, SegmentedControlVariantRecipe>;
};

export type SegmentedControlResolveOptions = {
  level?: SegmentedControlLevel;
  variant?: SegmentedControlVariant;
  width?: SegmentedControlWidth;
};

export type ResolvedSegmentedControlRecipe = Omit<SegmentedControlRecipe, "activeOption" | "option"> & {
  activeOption: ResolvedSegmentedControlButtonSelection;
  gap: number;
  level: SegmentedControlLevel;
  option: ResolvedSegmentedControlButtonSelection;
  padding: number;
  trackSurfaceRecipe: ResolvedSurfaceRecipe;
  variant: SegmentedControlVariant;
  width: SegmentedControlWidth;
};
