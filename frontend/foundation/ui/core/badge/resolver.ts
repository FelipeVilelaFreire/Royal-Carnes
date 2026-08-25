import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveSurfaceRecipe,
  resolveTextRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_BADGE_CONFIG } from "./defaults";
import type { BadgeConfig, BadgeResolveOptions, BadgeTextTone, ResolvedBadgeRecipe } from "./contract";

export const resolveBadgeConfig = (overrides?: Partial<BadgeConfig>): BadgeConfig => ({
  defaults: {
    ...DEFAULT_BADGE_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_BADGE_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveBadgeRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  badgeOverrides?: Partial<BadgeConfig>,
  options?: BadgeResolveOptions,
): ResolvedBadgeRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveBadgeConfig(badgeOverrides);
  const level = options?.level ?? config.defaults.level;
  const badge = config.recipes[level];
  const shape = options?.shape ?? config.defaults.shape;
  const surfaceLevel = options?.surfaceLevel ?? badge.surface.level;
  const surfaceOverrides = {
    ...badge.surface.overrides,
    radiusToken: shape === "circle" || shape === "pill" ? "full" : badge.radiusToken,
    ...options?.surfaceOverrides,
  };
  const appearance = options?.appearance ?? config.defaults.appearance;
  const tone = options?.tone ?? config.defaults.tone;
  const size = themeResult.tokens.dimensions.height[badge.sizeToken];
  const textTone: BadgeTextTone =
    appearance === "solid" || appearance === "glass" || appearance === "gradient"
      ? "inherit"
      : tone === "success" || tone === "warning" || tone === "danger" || tone === "primary"
        ? tone
        : "default";

  return {
    ...badge,
    appearance,
    blockSize: shape === "circle" ? size : undefined,
    inlineSize: shape === "circle" ? size : undefined,
    level,
    paddingX: shape === "circle" ? 0 : resolveSemiSpacing(themeResult.tokens.spacing, badge.paddingXToken),
    paddingY: shape === "circle" ? 0 : resolveSemiSpacing(themeResult.tokens.spacing, badge.paddingYToken),
    radius: themeResult.tokens.radius[shape === "circle" || shape === "pill" ? "full" : badge.radiusToken],
    shape,
    surface: {
      ...badge.surface,
      level: surfaceLevel,
      overrides: surfaceOverrides,
    },
    surfaceRecipe: resolveSurfaceRecipe(semi.surface[surfaceLevel], semi, themeResult, {
      appearance,
      overrides: surfaceOverrides,
      tone,
    }),
    textRecipe: resolveTextRecipe(semi.text[badge.text], themeResult),
    textTone,
    tone,
    width: options?.width ?? config.defaults.width,
  };
};
