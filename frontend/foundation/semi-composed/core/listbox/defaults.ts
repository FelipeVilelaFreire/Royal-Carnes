import type { UiListboxTokens } from "../themeBindings";

export const DEFAULT_LISTBOX_RECIPES = {
  "2xs": { disabled: "2xs", focusRing: "2xs", gapToken: "space2xs", iconLevel: "2xs", motion: "2xs", stateLayer: "none", textLevel: "caption" }, xs: { disabled: "xs", focusRing: "xs", gapToken: "space2xs", iconLevel: "xs", motion: "xs", stateLayer: "2xs", textLevel: "caption" },
  sm: { disabled: "sm", focusRing: "sm", gapToken: "spaceXs", iconLevel: "sm", motion: "sm", stateLayer: "xs", textLevel: "body" }, md: { disabled: "md", focusRing: "md", gapToken: "spaceXs", iconLevel: "md", motion: "md", stateLayer: "sm", textLevel: "body" },
  lg: { disabled: "lg", focusRing: "lg", gapToken: "spaceSm", iconLevel: "lg", motion: "lg", stateLayer: "md", textLevel: "body" }, xl: { disabled: "xl", focusRing: "xl", gapToken: "spaceMd", iconLevel: "xl", motion: "xl", stateLayer: "lg", textLevel: "label" },
  "2xl": { disabled: "2xl", focusRing: "2xl", gapToken: "spaceLg", iconLevel: "2xl", motion: "2xl", stateLayer: "xl", textLevel: "label" }, "3xl": { disabled: "3xl", focusRing: "3xl", gapToken: "spaceXl", iconLevel: "3xl", motion: "3xl", stateLayer: "2xl", textLevel: "label" },
} satisfies UiListboxTokens;
export const DEFAULT_LISTBOX_RECIPE = DEFAULT_LISTBOX_RECIPES.md;
