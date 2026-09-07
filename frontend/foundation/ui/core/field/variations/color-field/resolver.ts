import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveSurfaceRecipe,
  resolveTextRecipe,
} from "../../../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../../../semi-composed/core/contract";
import { DEFAULT_COLOR_FIELD_CONFIG } from "./defaults";
import type {
  ColorFieldConfig,
  ColorFieldResolveOptions,
  ResolvedColorFieldRecipe,
} from "./contract";

export const resolveColorFieldConfig = (overrides?: Partial<ColorFieldConfig>): ColorFieldConfig => ({
  defaults: {
    ...DEFAULT_COLOR_FIELD_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_COLOR_FIELD_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveColorFieldRecipe = (
  theme?: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  colorFieldOverrides?: Partial<ColorFieldConfig>,
  options?: ColorFieldResolveOptions,
): ResolvedColorFieldRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveColorFieldConfig(colorFieldOverrides);
  const level = options?.level ?? config.defaults.level;
  const recipe = config.recipes[level];
  const previewMode = options?.preview ?? recipe.previewMode;
  const textRecipe = semi.text[recipe.valueText];

  return {
    ...recipe,
    contentGap: resolveSemiSpacing(themeResult.tokens.spacing, recipe.contentGapToken),
    level,
    previewHeight: themeResult.tokens.dimensions.height[recipe.preview.heightToken],
    previewMode,
    previewSurfaceRecipe: resolveSurfaceRecipe(semi.surface[recipe.preview.surfaceLevel], semi, themeResult, {
      appearance: recipe.preview.appearance,
      tone: recipe.preview.tone,
    }),
    valueTextRecipe: resolveTextRecipe(textRecipe, themeResult),
    width: options?.width ?? config.defaults.width,
  };
};
