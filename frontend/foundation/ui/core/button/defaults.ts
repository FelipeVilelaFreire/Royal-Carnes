import { BUTTON_LEVELS, type ButtonConfig, type ButtonLevel } from "./contract";

const surfaceLevel = (level: ButtonLevel) => level === "2xs" ? "xs" : level;

export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  defaults: {
    appearance: "solid",
    level: "md",
    tone: "neutral",
  },
  recipes: Object.fromEntries(BUTTON_LEVELS.map((level) => [
    level,
    {
      heightToken: level,
      minWidthToken: level,
      gapToken: level,
      paddingXToken: surfaceLevel(level),
      paddingYToken: level === "2xs" || level === "xs" ? "2xs" : "xs",
      text: level,
      icon: level,
      surface: {
        level: surfaceLevel(level),
      },
      stateLayer: surfaceLevel(level),
      focusRing: surfaceLevel(level),
      motion: surfaceLevel(level),
      disabled: surfaceLevel(level),
    },
  ])) as ButtonConfig["recipes"],
};
