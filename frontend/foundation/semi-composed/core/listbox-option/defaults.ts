import type { UiListboxOptionTokens } from "../themeBindings";

export const DEFAULT_LISTBOX_OPTION_RECIPES = {
  "2xs": { disabled: "2xs", focusRing: "2xs", gapToken: "space2xs", iconLevel: "2xs", paddingToken: "space2xs", stateLayer: "none", surfaceLevel: "2xs", textLevel: "caption" }, xs: { disabled: "xs", focusRing: "xs", gapToken: "space2xs", iconLevel: "xs", paddingToken: "spaceXs", stateLayer: "2xs", surfaceLevel: "xs", textLevel: "caption" },
  sm: { disabled: "sm", focusRing: "sm", gapToken: "spaceXs", iconLevel: "sm", paddingToken: "spaceSm", stateLayer: "xs", surfaceLevel: "sm", textLevel: "body" }, md: { disabled: "md", focusRing: "md", gapToken: "spaceXs", iconLevel: "md", paddingToken: "spaceSm", stateLayer: "sm", surfaceLevel: "md", textLevel: "body" },
  lg: { disabled: "lg", focusRing: "lg", gapToken: "spaceSm", iconLevel: "lg", paddingToken: "spaceMd", stateLayer: "md", surfaceLevel: "lg", textLevel: "body" }, xl: { disabled: "xl", focusRing: "xl", gapToken: "spaceMd", iconLevel: "xl", paddingToken: "spaceLg", stateLayer: "lg", surfaceLevel: "xl", textLevel: "label" },
  "2xl": { disabled: "2xl", focusRing: "2xl", gapToken: "spaceLg", iconLevel: "2xl", paddingToken: "spaceXl", stateLayer: "xl", surfaceLevel: "2xl", textLevel: "label" }, "3xl": { disabled: "3xl", focusRing: "3xl", gapToken: "spaceXl", iconLevel: "3xl", paddingToken: "space2xl", stateLayer: "2xl", surfaceLevel: "3xl", textLevel: "label" },
} satisfies UiListboxOptionTokens;
export const DEFAULT_LISTBOX_OPTION_RECIPE = DEFAULT_LISTBOX_OPTION_RECIPES.md;
