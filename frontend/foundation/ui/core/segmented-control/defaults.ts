import { SEGMENTED_CONTROL_LEVELS, type SegmentedControlConfig, type SegmentedControlLevel } from "./contract";

const compactLevel = (level: SegmentedControlLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : level;
const trackLevel = (level: SegmentedControlLevel) => level === "2xs" ? "xs" : level;
const trackPadding = (level: SegmentedControlLevel) => level === "2xs" || level === "xs" ? "2xs" : level === "sm" ? "xs" : "sm";

export const DEFAULT_SEGMENTED_CONTROL_CONFIG: SegmentedControlConfig = {
  defaults: {
    level: "xs",
    variant: "panel",
    width: "content",
  },
  recipes: Object.fromEntries(SEGMENTED_CONTROL_LEVELS.map((level) => [
    level,
    {
      track: {
        appearance: "soft",
        gapToken: "2xs",
        paddingToken: trackPadding(level),
        surfaceLevel: trackLevel(level),
        tone: "neutral",
      },
      option: {
        align: "center",
        appearance: "transparent",
        level: compactLevel(level),
        tone: "neutral",
        width: "content",
      },
      activeOption: {
        align: "center",
        appearance: "solid",
        level: compactLevel(level),
        tone: "primary",
        width: "content",
      },
    },
  ])) as SegmentedControlConfig["recipes"],
  variants: {
    panel: {},
    inline: {
      track: {
        appearance: "transparent",
        gapToken: "2xs",
        paddingToken: "2xs",
        surfaceLevel: "2xs",
        tone: "neutral",
      },
      option: {
        minWidthToken: "lg",
        width: "content",
      },
      activeOption: {
        minWidthToken: "lg",
        width: "content",
      },
    },
  },
};
