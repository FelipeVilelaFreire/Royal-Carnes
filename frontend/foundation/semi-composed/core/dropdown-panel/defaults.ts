import type { UiDropdownPanelTokens } from "../themeBindings";

export const DEFAULT_DROPDOWN_PANEL_RECIPES = {
  "2xs": { layerToken: "3xl", motion: "2xs", offsetToken: "space3xs", overlay: "none", safeAreaToken: "spaceXs", surfaceLevel: "2xs" }, xs: { layerToken: "3xl", motion: "xs", offsetToken: "space3xs", overlay: "none", safeAreaToken: "spaceXs", surfaceLevel: "xs" },
  sm: { layerToken: "3xl", motion: "sm", offsetToken: "space2xs", overlay: "2xs", safeAreaToken: "spaceSm", surfaceLevel: "sm" }, md: { layerToken: "3xl", motion: "md", offsetToken: "space2xs", overlay: "xs", safeAreaToken: "spaceMd", surfaceLevel: "md" },
  lg: { layerToken: "3xl", motion: "lg", offsetToken: "spaceXs", overlay: "sm", safeAreaToken: "spaceLg", surfaceLevel: "lg" }, xl: { layerToken: "3xl", motion: "xl", offsetToken: "spaceSm", overlay: "md", safeAreaToken: "spaceXl", surfaceLevel: "xl" },
  "2xl": { layerToken: "3xl", motion: "2xl", offsetToken: "spaceMd", overlay: "lg", safeAreaToken: "space2xl", surfaceLevel: "2xl" }, "3xl": { layerToken: "3xl", motion: "3xl", offsetToken: "spaceLg", overlay: "xl", safeAreaToken: "space3xl", surfaceLevel: "3xl" },
} satisfies UiDropdownPanelTokens;
export const DEFAULT_DROPDOWN_PANEL_RECIPE = DEFAULT_DROPDOWN_PANEL_RECIPES.md;
