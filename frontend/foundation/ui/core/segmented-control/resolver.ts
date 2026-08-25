import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveSurfaceRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_SEGMENTED_CONTROL_CONFIG } from "./defaults";
import type {
  ResolvedSegmentedControlRecipe,
  SegmentedControlButtonSelection,
  SegmentedControlConfig,
  SegmentedControlResolveOptions,
  SegmentedControlVariant,
  SegmentedControlVariantRecipe,
} from "./contract";

const mergeVariantRecipe = (
  base: SegmentedControlVariantRecipe,
  override?: SegmentedControlVariantRecipe,
): SegmentedControlVariantRecipe => ({
  activeOption: {
    ...base.activeOption,
    ...override?.activeOption,
  },
  option: {
    ...base.option,
    ...override?.option,
  },
  track: {
    ...base.track,
    ...override?.track,
  },
});

export const resolveSegmentedControlConfig = (
  overrides?: Partial<SegmentedControlConfig>,
): SegmentedControlConfig => ({
  defaults: {
    ...DEFAULT_SEGMENTED_CONTROL_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_SEGMENTED_CONTROL_CONFIG.recipes,
    ...overrides?.recipes,
  },
  variants: {
    panel: mergeVariantRecipe(DEFAULT_SEGMENTED_CONTROL_CONFIG.variants.panel, overrides?.variants?.panel),
    inline: mergeVariantRecipe(DEFAULT_SEGMENTED_CONTROL_CONFIG.variants.inline, overrides?.variants?.inline),
  },
});

export const resolveSegmentedControlRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  segmentedControlOverrides?: Partial<SegmentedControlConfig>,
  options?: SegmentedControlResolveOptions,
): ResolvedSegmentedControlRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveSegmentedControlConfig(segmentedControlOverrides);
  const level = options?.level ?? config.defaults.level;
  const variant: SegmentedControlVariant = options?.variant ?? config.defaults.variant;
  const baseRecipe = config.recipes[level];
  const variantRecipe = config.variants[variant];
  const recipe = {
    activeOption: {
      ...baseRecipe.activeOption,
      ...variantRecipe.activeOption,
    },
    option: {
      ...baseRecipe.option,
      ...variantRecipe.option,
    },
    track: {
      ...baseRecipe.track,
      ...variantRecipe.track,
    },
  };
  const resolveOption = (selection: SegmentedControlButtonSelection) => ({
    ...selection,
    minWidth: selection.minWidthToken ? themeResult.tokens.dimensions.minWidth[selection.minWidthToken] : undefined,
  });

  return {
    ...recipe,
    activeOption: resolveOption(recipe.activeOption),
    gap: resolveSemiSpacing(themeResult.tokens.spacing, recipe.track.gapToken),
    level,
    option: resolveOption(recipe.option),
    padding: resolveSemiSpacing(themeResult.tokens.spacing, recipe.track.paddingToken),
    trackSurfaceRecipe: resolveSurfaceRecipe(semi.surface[recipe.track.surfaceLevel], semi, themeResult, {
      appearance: recipe.track.appearance,
      tone: recipe.track.tone,
    }),
    variant,
    width: options?.width ?? config.defaults.width,
  };
};
