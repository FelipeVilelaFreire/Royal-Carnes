import { SELECT_LEVELS, type SelectConfig } from "./contract";

export const DEFAULT_SELECT_CONFIG: SelectConfig = {
  defaults: {
    level: "xs",
    width: "full",
  },
  recipes: Object.fromEntries(SELECT_LEVELS.map((level) => [
    level,
    {
      dropdownPickerLevel: level,
      fieldLevel: level,
    },
  ])) as SelectConfig["recipes"],
};
