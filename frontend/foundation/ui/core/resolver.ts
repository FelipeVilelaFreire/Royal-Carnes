import { createUiColorTokens } from "../../tokens";
import { DEFAULT_UI_FOUNDATION_TOKENS } from "../../semi-composed/core";
import { DEFAULT_BADGE_CONFIG, resolveBadgeConfig } from "./badge";
import { DEFAULT_BUTTON_CONFIG, resolveButtonConfig } from "./button";
import { DEFAULT_CARD_CONFIG, resolveCardConfig } from "./card";
import { DEFAULT_DIVIDER_CONFIG, resolveDividerConfig } from "./divider";
import { DEFAULT_DROPDOWN_PICKER_CONFIG, resolveDropdownPickerConfig } from "./dropdown-picker";
import { DEFAULT_COLOR_FIELD_CONFIG, DEFAULT_FIELD_CONFIG, resolveColorFieldConfig, resolveFieldConfig } from "./field";
import { DEFAULT_UI_ICON_CONFIG, resolveUiIconConfig } from "./icon";
import { DEFAULT_UI_LAYOUT_CONFIG } from "./layout";
import { DEFAULT_SEGMENTED_CONTROL_CONFIG, resolveSegmentedControlConfig } from "./segmented-control";
import { DEFAULT_SELECT_CONFIG, resolveSelectConfig } from "./select";
import { DEFAULT_UI_TEXT_CONFIG } from "./text";
import type { SurfaceUiConfig, UiSurfaceConfig } from "./contract";

export type ResolvedUiConfig = SurfaceUiConfig & {
  theme: NonNullable<SurfaceUiConfig["theme"]>;
};

export const DEFAULT_UI_SURFACE_INTERACTION = {
  background: 8,
  border: 35,
  borderWidth: 20,
  duration: 180,
  lift: 8,
  scale: 4,
  shadow: 20,
};

export const DEFAULT_UI_SURFACE_CONFIG: UiSurfaceConfig = {
  appearance: "solid",
  borderEdges: "all",
  gradient: "none",
  interaction: DEFAULT_UI_SURFACE_INTERACTION,
  shadowMode: "outer",
  tone: "neutral",
};

export const DEFAULT_SURFACE_UI_CONFIG: ResolvedUiConfig = {
  badge: DEFAULT_BADGE_CONFIG,
  button: DEFAULT_BUTTON_CONFIG,
  card: DEFAULT_CARD_CONFIG,
  colorField: DEFAULT_COLOR_FIELD_CONFIG,
  componentDensity: "comfortable",
  divider: DEFAULT_DIVIDER_CONFIG,
  dropdownPicker: DEFAULT_DROPDOWN_PICKER_CONFIG,
  field: DEFAULT_FIELD_CONFIG,
  focusRing: true,
  icon: DEFAULT_UI_ICON_CONFIG,
  layout: DEFAULT_UI_LAYOUT_CONFIG,
  segmentedControl: DEFAULT_SEGMENTED_CONTROL_CONFIG,
  select: DEFAULT_SELECT_CONFIG,
  surface: DEFAULT_UI_SURFACE_CONFIG,
  text: DEFAULT_UI_TEXT_CONFIG,
  theme: {
    defaultMode: "light",
    modes: {
      light: createUiColorTokens(),
    },
    tokens: DEFAULT_UI_FOUNDATION_TOKENS,
  },
};

export function resolveSurfaceUiConfig(config?: Partial<SurfaceUiConfig>): ResolvedUiConfig {
  const theme = config?.theme ?? DEFAULT_SURFACE_UI_CONFIG.theme;

  return {
    badge: resolveBadgeConfig(config?.badge),
    button: resolveButtonConfig(config?.button),
    card: resolveCardConfig(config?.card),
    colorField: resolveColorFieldConfig(config?.colorField),
    componentDensity: config?.componentDensity ?? DEFAULT_SURFACE_UI_CONFIG.componentDensity,
    divider: resolveDividerConfig(config?.divider),
    dropdownPicker: resolveDropdownPickerConfig(config?.dropdownPicker),
    field: resolveFieldConfig(config?.field),
    focusRing: config?.focusRing ?? DEFAULT_SURFACE_UI_CONFIG.focusRing,
    icon: resolveUiIconConfig(config?.icon),
    layout: {
      ...DEFAULT_UI_LAYOUT_CONFIG,
      ...config?.layout,
    },
    segmentedControl: resolveSegmentedControlConfig(config?.segmentedControl),
    select: resolveSelectConfig(config?.select),
    sizeRecipes: config?.sizeRecipes,
    surface: {
      ...DEFAULT_UI_SURFACE_CONFIG,
      ...config?.surface,
      interaction: {
        ...DEFAULT_UI_SURFACE_INTERACTION,
        ...config?.surface?.interaction,
      },
    },
    text: {
      ...DEFAULT_UI_TEXT_CONFIG,
      ...config?.text,
    },
    theme,
  };
}
