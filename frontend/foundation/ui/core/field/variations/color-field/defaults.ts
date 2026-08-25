import { COLOR_FIELD_LEVELS, type ColorFieldConfig, type ColorFieldLevel } from "./contract";

const compactLevel = (level: ColorFieldLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : level;
const previewHeight = (level: ColorFieldLevel) => level === "2xs" || level === "xs" ? "md" : level === "sm" ? "lg" : "xl";
const surfaceLevel = (level: ColorFieldLevel) => level === "2xs" ? "xs" : level;

export const DEFAULT_COLOR_FIELD_CONFIG: ColorFieldConfig = {
  defaults: {
    level: "xs",
    preview: "card",
    width: "full",
  },
  recipes: Object.fromEntries(COLOR_FIELD_LEVELS.map((level) => [
    level,
    {
      contentGapToken: "2xs",
      fieldLevel: level,
      previewMode: "card",
      preview: {
        appearance: "outline",
        heightToken: previewHeight(level),
        surfaceLevel: surfaceLevel(level),
        tone: "neutral",
      },
      valueText: compactLevel(level),
    },
  ])) as ColorFieldConfig["recipes"],
};
