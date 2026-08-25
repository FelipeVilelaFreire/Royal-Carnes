import { DIVIDER_LEVELS, type DividerConfig, type DividerLevel } from "./contract";

const spacingLevel = (level: DividerLevel) => {
  if (level === "2xs" || level === "xs") return "xs";
  if (level === "sm" || level === "md") return "sm";
  if (level === "lg" || level === "xl") return "md";
  return "lg";
};

const strokeLevel = (level: DividerLevel) => {
  if (level === "2xs" || level === "xs" || level === "sm") return "2xs";
  if (level === "md" || level === "lg") return "xs";
  return "sm";
};

const motionLevel = (level: DividerLevel) => {
  if (level === "2xs" || level === "xs") return "2xs";
  if (level === "sm" || level === "md") return "xs";
  return "sm";
};

export const DEFAULT_DIVIDER_CONFIG: DividerConfig = {
  defaults: {
    level: "md",
    orientation: "horizontal",
    width: "full",
  },
  recipes: Object.fromEntries(DIVIDER_LEVELS.map((level) => [
    level,
    {
      motion: motionLevel(level),
      spacingToken: spacingLevel(level),
      strokeLevel: strokeLevel(level),
    },
  ])) as DividerConfig["recipes"],
};
