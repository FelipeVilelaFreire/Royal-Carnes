import type { UiColorTokens, UiThemeConfig } from "../../tokens";
import type { UiSizeRecipes } from "../../semi-composed/core";
import type { BadgeConfig } from "./badge";
import type { ButtonConfig } from "./button";
import type { CardConfig } from "./card";
import type { DropdownPickerConfig } from "./dropdown-picker";
import type { DividerConfig } from "./divider";
import type { ColorFieldConfig, FieldConfig } from "./field";
import type { UiIconConfig } from "./icon";
import type { UiLayoutConfig } from "./layout";
import type { SegmentedControlConfig } from "./segmented-control";
import type { SelectConfig } from "./select";
import type { UiTextConfig } from "./text";

export type { UiColorTokens, UiThemeConfig } from "../../tokens";

export type UiComponentDensity = "compact" | "comfortable" | "spacious";
export type UiSurfaceAppearance = "glass" | "outline" | "soft" | "solid" | "transparent";
export type UiSurfaceBorderEdges = "all" | "bottom" | "horizontal" | "left" | "none" | "right" | "top" | "vertical";
export type UiSurfaceGradientPreset = "none";
export type UiSurfaceShadowMode = "inner" | "none" | "outer";
export type UiSurfaceTone = "accent" | "danger" | "neutral" | "primary" | "success" | "warning";

export type UiSurfaceInteraction = {
  background: number;
  border: number;
  borderWidth: number;
  duration: number;
  lift: number;
  scale: number;
  shadow: number;
};

export type UiSurfaceConfig = {
  appearance: UiSurfaceAppearance;
  borderEdges: UiSurfaceBorderEdges;
  gradient: UiSurfaceGradientPreset;
  interaction: UiSurfaceInteraction;
  shadowMode: UiSurfaceShadowMode;
  tone: UiSurfaceTone;
  [key: string]: unknown;
};

export type SurfaceUiConfig = {
  badge: BadgeConfig;
  button: ButtonConfig;
  card: CardConfig;
  colorField: ColorFieldConfig;
  componentDensity: UiComponentDensity;
  divider: DividerConfig;
  dropdownPicker: DropdownPickerConfig;
  field: FieldConfig;
  focusRing: boolean;
  icon: UiIconConfig;
  layout: UiLayoutConfig;
  segmentedControl: SegmentedControlConfig;
  select: SelectConfig;
  sizeRecipes?: UiSizeRecipes;
  surface: UiSurfaceConfig;
  text: UiTextConfig;
  theme?: UiThemeConfig;
};

export type FoundationUiConfig = Omit<SurfaceUiConfig, "theme"> & {
  theme: UiThemeConfig;
};

export type LegacyThemeConfig = Partial<UiColorTokens> & {
  mode?: "dark" | "light" | "system";
};
