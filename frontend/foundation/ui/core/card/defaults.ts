import { CARD_LEVELS, type CardConfig, type CardLevel } from "./contract";

const surfaceLevel = (level: CardLevel) => level === "2xs" ? "xs" : level;
const paddingLevel = (level: CardLevel) => level === "2xs" || level === "xs" ? "xs" : level;
const gapLevel = (level: CardLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : "sm";

export const DEFAULT_CARD_CONFIG: CardConfig = {
  defaults: {
    appearance: "solid",
    level: "md",
    tone: "neutral",
    width: "full",
  },
  recipes: Object.fromEntries(CARD_LEVELS.map((level) => [
    level,
    {
      gapToken: gapLevel(level),
      paddingToken: paddingLevel(level),
      surface: {
        level: surfaceLevel(level),
      },
    },
  ])) as CardConfig["recipes"],
};
