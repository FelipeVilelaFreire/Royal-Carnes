import type { DropdownPickerLevel, DropdownPickerOption } from "../dropdown-picker";
import type { FieldLevel, FieldWidth } from "../field";

export const SELECT_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type SelectLevel = (typeof SELECT_LEVELS)[number];
export type SelectWidth = FieldWidth;
export type SelectOption = DropdownPickerOption;

export type SelectRecipe = {
  dropdownPickerLevel: DropdownPickerLevel;
  fieldLevel: FieldLevel;
};

export type SelectConfig = {
  defaults: {
    level: SelectLevel;
    width: SelectWidth;
  };
  recipes: Record<SelectLevel, SelectRecipe>;
};

export type SelectResolveOptions = {
  level?: SelectLevel;
  width?: SelectWidth;
};

export type ResolvedSelectRecipe = SelectRecipe & {
  level: SelectLevel;
  width: SelectWidth;
};
