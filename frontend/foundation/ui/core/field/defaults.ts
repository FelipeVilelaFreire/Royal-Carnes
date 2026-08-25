import { FIELD_LEVELS, type FieldConfig, type FieldLevel } from "./contract";

const helperLevel = (level: FieldLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : "sm";
const labelLevel = (level: FieldLevel) => level === "2xs" ? "xs" : level;
const controlGap = (level: FieldLevel) => level === "2xs" || level === "xs" ? "2xs" : "xs";

export const DEFAULT_FIELD_CONFIG: FieldConfig = {
  defaults: {
    level: "xs",
    width: "full",
  },
  recipes: Object.fromEntries(FIELD_LEVELS.map((level) => [
    level,
    {
      controlGapToken: controlGap(level),
      textGapToken: "2xs",
      label: {
        level: labelLevel(level),
        toneToken: "text",
      },
      description: {
        level: helperLevel(level),
        toneToken: "muted",
      },
      error: {
        level: helperLevel(level),
        toneToken: "danger",
      },
    },
  ])) as FieldConfig["recipes"],
};
