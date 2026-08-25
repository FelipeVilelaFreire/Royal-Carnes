import type { UiSurfaceRecipeTokens } from "../themeBindings";

/** Canonical material compositions; Theme supplies only referenced raw tokens. */
export const DEFAULT_SURFACE_RECIPES = {
  solid: {
    "2xs": { innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "xs", stateLayer: "none", stroke: "none" }, xs: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "sm", stateLayer: "2xs", stroke: "none" },
    sm: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceSm", radiusToken: "md", stateLayer: "xs", stroke: "2xs" }, md: { innerElevation: "none", outerElevation: "2xs", paddingToken: "spaceMd", radiusToken: "md", stateLayer: "sm", stroke: "xs" },
    lg: { innerElevation: "none", outerElevation: "xs", paddingToken: "spaceLg", radiusToken: "lg", stateLayer: "md", stroke: "sm" }, xl: { innerElevation: "none", outerElevation: "sm", paddingToken: "spaceXl", radiusToken: "xl", stateLayer: "lg", stroke: "md" },
    "2xl": { innerElevation: "none", outerElevation: "md", paddingToken: "space2xl", radiusToken: "2xl", stateLayer: "xl", stroke: "lg" }, "3xl": { innerElevation: "none", outerElevation: "lg", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "xl" },
  },
  soft: {
    "2xs": { innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "xs", stateLayer: "none", stroke: "none" }, xs: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "sm", stateLayer: "2xs", stroke: "2xs" },
    sm: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceSm", radiusToken: "md", stateLayer: "xs", stroke: "xs" }, md: { innerElevation: "none", outerElevation: "2xs", paddingToken: "spaceMd", radiusToken: "lg", stateLayer: "sm", stroke: "sm" },
    lg: { innerElevation: "none", outerElevation: "xs", paddingToken: "spaceLg", radiusToken: "xl", stateLayer: "md", stroke: "md" }, xl: { innerElevation: "none", outerElevation: "sm", paddingToken: "spaceXl", radiusToken: "2xl", stateLayer: "lg", stroke: "lg" },
    "2xl": { innerElevation: "none", outerElevation: "md", paddingToken: "space2xl", radiusToken: "3xl", stateLayer: "xl", stroke: "xl" }, "3xl": { innerElevation: "none", outerElevation: "lg", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "2xl" },
  },
  outline: {
    "2xs": { innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "xs", stateLayer: "none", stroke: "2xs" }, xs: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "sm", stateLayer: "2xs", stroke: "xs" },
    sm: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceSm", radiusToken: "md", stateLayer: "xs", stroke: "sm" }, md: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceMd", radiusToken: "md", stateLayer: "sm", stroke: "md" },
    lg: { innerElevation: "none", outerElevation: "2xs", paddingToken: "spaceLg", radiusToken: "lg", stateLayer: "md", stroke: "lg" }, xl: { innerElevation: "none", outerElevation: "xs", paddingToken: "spaceXl", radiusToken: "xl", stateLayer: "lg", stroke: "xl" },
    "2xl": { innerElevation: "none", outerElevation: "sm", paddingToken: "space2xl", radiusToken: "2xl", stateLayer: "xl", stroke: "2xl" }, "3xl": { innerElevation: "none", outerElevation: "md", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "3xl" },
  },
  transparent: {
    "2xs": { innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "none", stateLayer: "none", stroke: "none" }, xs: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "xs", stateLayer: "2xs", stroke: "none" },
    sm: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceSm", radiusToken: "sm", stateLayer: "xs", stroke: "none" }, md: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceMd", radiusToken: "md", stateLayer: "sm", stroke: "none" },
    lg: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceLg", radiusToken: "lg", stateLayer: "md", stroke: "none" }, xl: { innerElevation: "none", outerElevation: "none", paddingToken: "spaceXl", radiusToken: "xl", stateLayer: "lg", stroke: "2xs" },
    "2xl": { innerElevation: "none", outerElevation: "none", paddingToken: "space2xl", radiusToken: "2xl", stateLayer: "xl", stroke: "xs" }, "3xl": { innerElevation: "none", outerElevation: "none", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "sm" },
  },
  glass: {
    "2xs": { glassLevel: "2xs", innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "xs", stateLayer: "none", stroke: "none" }, xs: { glassLevel: "xs", innerElevation: "2xs", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "sm", stateLayer: "2xs", stroke: "2xs" },
    sm: { glassLevel: "sm", innerElevation: "2xs", outerElevation: "xs", paddingToken: "spaceSm", radiusToken: "md", stateLayer: "xs", stroke: "xs" }, md: { glassLevel: "md", innerElevation: "xs", outerElevation: "sm", paddingToken: "spaceMd", radiusToken: "lg", stateLayer: "sm", stroke: "sm" },
    lg: { glassLevel: "lg", innerElevation: "xs", outerElevation: "md", paddingToken: "spaceLg", radiusToken: "xl", stateLayer: "md", stroke: "md" }, xl: { glassLevel: "xl", innerElevation: "sm", outerElevation: "lg", paddingToken: "spaceXl", radiusToken: "2xl", stateLayer: "lg", stroke: "lg" },
    "2xl": { glassLevel: "2xl", innerElevation: "sm", outerElevation: "xl", paddingToken: "space2xl", radiusToken: "3xl", stateLayer: "xl", stroke: "xl" }, "3xl": { glassLevel: "3xl", innerElevation: "md", outerElevation: "3xl", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "2xl" },
  },
  gradient: {
    "2xs": { gradientLevel: "2xs", innerElevation: "none", outerElevation: "none", paddingToken: "space2xs", radiusToken: "xs", stateLayer: "none", stroke: "none" }, xs: { gradientLevel: "xs", innerElevation: "none", outerElevation: "none", paddingToken: "spaceXs", radiusToken: "sm", stateLayer: "2xs", stroke: "2xs" },
    sm: { gradientLevel: "sm", innerElevation: "none", outerElevation: "2xs", paddingToken: "spaceSm", radiusToken: "md", stateLayer: "xs", stroke: "xs" }, md: { gradientLevel: "md", innerElevation: "none", outerElevation: "xs", paddingToken: "spaceMd", radiusToken: "lg", stateLayer: "sm", stroke: "sm" },
    lg: { gradientLevel: "lg", innerElevation: "none", outerElevation: "sm", paddingToken: "spaceLg", radiusToken: "xl", stateLayer: "md", stroke: "md" }, xl: { gradientLevel: "xl", innerElevation: "none", outerElevation: "md", paddingToken: "spaceXl", radiusToken: "2xl", stateLayer: "lg", stroke: "lg" },
    "2xl": { gradientLevel: "2xl", innerElevation: "none", outerElevation: "lg", paddingToken: "space2xl", radiusToken: "3xl", stateLayer: "xl", stroke: "xl" }, "3xl": { gradientLevel: "3xl", innerElevation: "none", outerElevation: "xl", paddingToken: "space3xl", radiusToken: "3xl", stateLayer: "2xl", stroke: "2xl" },
  },
} satisfies UiSurfaceRecipeTokens;

export const DEFAULT_SURFACE_RECIPE = DEFAULT_SURFACE_RECIPES.solid.md;
