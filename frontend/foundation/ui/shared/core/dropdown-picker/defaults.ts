import { DROPDOWN_PICKER_LEVELS, type DropdownPickerConfig, type DropdownPickerLevel } from "./contract";

const compactLevel = (level: DropdownPickerLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : level;
const panelLevel = (level: DropdownPickerLevel) => level === "2xs" ? "xs" : level;
const panelPadding = (level: DropdownPickerLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : "sm";

export const DEFAULT_DROPDOWN_PICKER_CONFIG: DropdownPickerConfig = {
  defaults: {
    level: "xs",
    placement: "bottom",
    width: "full",
  },
  recipes: Object.fromEntries(DROPDOWN_PICKER_LEVELS.map((level) => [
    level,
    {
      trigger: {
        align: "start",
        appearance: "outline",
        level,
        tone: "neutral",
        width: "full",
      },
      panel: {
        appearance: "solid",
        gapToken: "2xs",
        layerToken: "dropdown",
        paddingToken: panelPadding(level),
        surfaceLevel: panelLevel(level),
        tone: "neutral",
      },
      option: {
        align: "start",
        appearance: "transparent",
        level: compactLevel(level),
        tone: "neutral",
        width: "full",
      },
      activeOption: {
        align: "start",
        appearance: "soft",
        level: compactLevel(level),
        tone: "neutral",
        width: "full",
      },
    },
  ])) as DropdownPickerConfig["recipes"],
};
