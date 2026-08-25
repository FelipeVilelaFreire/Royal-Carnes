import type { ThemeRadiusToken } from "../../../semi-composed/core/contract";
import { BADGE_LEVELS, type BadgeConfig, type BadgeLevel } from "./contract";

const surfaceLevel = (level: BadgeLevel) => level === "2xs" ? "xs" : level;
const textLevel = (level: BadgeLevel) => level === "2xl" || level === "3xl" ? "xl" : level;
const sizeLevel = (level: BadgeLevel) => level === "2xs" ? "sm" : level === "xs" ? "md" : level === "sm" ? "lg" : level === "md" ? "xl" : level === "lg" ? "2xl" : "3xl";
const paddingXLevel = (level: BadgeLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : "sm";
const paddingYLevel = (level: BadgeLevel) => level === "2xs" || level === "xs" ? "2xs" : "xs";
const radiusToken = (level: BadgeLevel): ThemeRadiusToken => level === "2xs" || level === "xs" ? "sm" : level === "sm" ? "md" : level === "md" ? "lg" : "xl";

export const DEFAULT_BADGE_CONFIG: BadgeConfig = {
  defaults: {
    appearance: "soft",
    level: "xs",
    shape: "pill",
    tone: "primary",
    width: "content",
  },
  recipes: Object.fromEntries(BADGE_LEVELS.map((level) => [
    level,
    {
      paddingXToken: paddingXLevel(level),
      paddingYToken: paddingYLevel(level),
      radiusToken: radiusToken(level),
      sizeToken: sizeLevel(level),
      surface: {
        level: surfaceLevel(level),
      },
      text: textLevel(level),
    },
  ])) as BadgeConfig["recipes"],
};
