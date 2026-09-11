export type DropdownPickerAppearance = "solid" | "glass" | "soft" | "outline" | string;
export type UiLayerTokens = Record<string, string>;

export const DROPDOWN_PICKER_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type DropdownPickerLevel = (typeof DROPDOWN_PICKER_LEVELS)[number] | string;

export type DropdownPickerOption = {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: any;
  [key: string]: any;
};

export interface DropdownPickerConfig {
  defaults: {
    appearance?: DropdownPickerAppearance;
    level?: DropdownPickerLevel;
    placement?: string;
    width?: string;
    tone?: string;
    [key: string]: any;
  };
  recipes?: Record<string, any>;
}

export type DropdownPickerResolveOptions = {
  appearance?: DropdownPickerAppearance;
  level?: DropdownPickerLevel;
  placement?: string;
  tone?: string;
  width?: string;
  [key: string]: any;
};

export type ResolvedDropdownPickerRecipe = any;
