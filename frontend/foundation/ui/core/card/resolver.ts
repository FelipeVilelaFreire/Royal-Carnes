import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveSurfaceRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_CARD_CONFIG } from "./defaults";
import type { CardConfig, CardResolveOptions, ResolvedCardRecipe } from "./contract";

export const resolveCardConfig = (overrides?: Partial<CardConfig>): CardConfig => ({
  defaults: {
    ...DEFAULT_CARD_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_CARD_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveCardRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  cardOverrides?: Partial<CardConfig>,
  options?: CardResolveOptions,
): ResolvedCardRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveCardConfig(cardOverrides);
  const level = options?.level ?? config.defaults.level;
  const card = config.recipes[level];
  const surfaceLevel = options?.surfaceLevel ?? card.surface.level;
  const surfaceOverrides = { ...card.surface.overrides, ...options?.surfaceOverrides };
  const appearance = options?.appearance ?? config.defaults.appearance;
  const tone = options?.tone ?? config.defaults.tone;

  return {
    ...card,
    appearance,
    gap: resolveSemiSpacing(themeResult.tokens.spacing, card.gapToken),
    level,
    padding: resolveSemiSpacing(themeResult.tokens.spacing, card.paddingToken),
    surface: {
      ...card.surface,
      level: surfaceLevel,
      overrides: surfaceOverrides,
    },
    surfaceRecipe: resolveSurfaceRecipe(semi.surface[surfaceLevel], semi, themeResult, {
      appearance,
      overrides: surfaceOverrides,
      tone,
    }),
    tone,
    width: options?.width ?? config.defaults.width,
  };
};
