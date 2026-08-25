import type { UiStateLayerTokens } from "../themeBindings";

export const DEFAULT_STATE_LAYER_RECIPES = {
  "2xs": { backgroundOpacityToken: "2xs", motion: "none", outerElevation: "none", stroke: "2xs" }, xs: { backgroundOpacityToken: "xs", motion: "2xs", outerElevation: "none", stroke: "2xs" },
  sm: { backgroundOpacityToken: "sm", motion: "xs", outerElevation: "2xs", stroke: "xs" }, md: { backgroundOpacityToken: "md", motion: "sm", outerElevation: "xs", stroke: "sm" },
  lg: { backgroundOpacityToken: "lg", motion: "md", outerElevation: "sm", stroke: "md" }, xl: { backgroundOpacityToken: "xl", motion: "lg", outerElevation: "md", stroke: "lg" },
  "2xl": { backgroundOpacityToken: "2xl", motion: "xl", outerElevation: "lg", stroke: "xl" }, "3xl": { backgroundOpacityToken: "3xl", motion: "2xl", outerElevation: "xl", stroke: "2xl" },
} satisfies UiStateLayerTokens;
export const DEFAULT_STATE_LAYER_RECIPE = DEFAULT_STATE_LAYER_RECIPES.md;

/** Interaction is a composition recipe: it maps semantic intent to Theme motion values. */
export const DEFAULT_INTERACTION_RECIPES = {
  none: { background: 0, border: 0, borderWidth: 0, duration: 180, lift: 0, scale: 0, shadow: 0 },
  soft: { background: 16, border: 0, borderWidth: 0, duration: 180, lift: 0, scale: 0, shadow: 0 },
  border: { background: 0, border: 65, borderWidth: 0, duration: 180, lift: 0, scale: 0, shadow: 0 },
  lift: { background: 0, border: 0, borderWidth: 0, duration: 180, lift: 20, scale: 0, shadow: 0 },
  shadow: { background: 0, border: 0, borderWidth: 0, duration: 180, lift: 0, scale: 0, shadow: 38 },
  emphasis: { background: 12, border: 50, borderWidth: 25, duration: 180, lift: 10, scale: 8, shadow: 28 },
  focus: { background: 0, border: 80, borderWidth: 50, duration: 180, lift: 0, scale: 0, shadow: 25 },
  pressed: { background: 8, border: 50, borderWidth: 20, duration: 120, lift: 0, scale: -8, shadow: 0 },
  levels: {
    base: { none: { background: 0, border: 0, borderWidth: 0 }, "2xs": { background: 2, border: 4, borderWidth: 0 }, xs: { background: 4, border: 8, borderWidth: 4 }, sm: { background: 8, border: 16, borderWidth: 8 }, md: { background: 12, border: 24, borderWidth: 12 }, lg: { background: 16, border: 32, borderWidth: 16 }, xl: { background: 24, border: 40, borderWidth: 20 }, "2xl": { background: 32, border: 52, borderWidth: 28 }, "3xl": { background: 44, border: 64, borderWidth: 36 } },
    depth: { none: { shadow: 0 }, "2xs": { shadow: 4 }, xs: { shadow: 8 }, sm: { shadow: 16 }, md: { shadow: 24 }, lg: { shadow: 36 }, xl: { shadow: 48 }, "2xl": { shadow: 64 }, "3xl": { shadow: 80 } },
    transform: { none: { lift: "none", scale: 100, rotation: 0 }, "2xs": { lift: "none", scale: 100, rotation: 0 }, xs: { lift: "none", scale: 100, rotation: 0 }, sm: { lift: "distanceSm", scale: 101, rotation: 0 }, md: { lift: "distanceSm", scale: 101, rotation: 0 }, lg: { lift: "distanceMd", scale: 102, rotation: 0 }, xl: { lift: "distanceMd", scale: 102, rotation: 0 }, "2xl": { lift: "distanceLg", scale: 103, rotation: 0 }, "3xl": { lift: "distanceLg", scale: 104, rotation: 1 } },
    time: { none: { duration: "durationInstant", easing: "standard" }, "2xs": { duration: "durationInstant", easing: "standard" }, xs: { duration: "durationFast", easing: "standard" }, sm: { duration: "durationFast", easing: "standard" }, md: { duration: "durationNormal", easing: "standard" }, lg: { duration: "durationSlow", easing: "entrance" }, xl: { duration: "durationSlow", easing: "entrance" }, "2xl": { duration: "durationSlower", easing: "entrance" }, "3xl": { duration: "durationSlower", easing: "entrance" } },
  },
} as const;
