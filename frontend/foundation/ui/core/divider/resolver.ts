import {
  resolveMotionRecipe,
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveStrokeRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_DIVIDER_CONFIG } from "./defaults";
import type { DividerConfig, DividerResolveOptions, ResolvedDividerRecipe } from "./contract";

export const resolveDividerConfig = (overrides?: Partial<DividerConfig>): DividerConfig => ({
  defaults: {
    ...DEFAULT_DIVIDER_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_DIVIDER_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveDividerRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  dividerOverrides?: Partial<DividerConfig>,
  options?: DividerResolveOptions,
): ResolvedDividerRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveDividerConfig(dividerOverrides);
  const level = options?.level ?? config.defaults.level;
  const divider = config.recipes[level];
  const strokeRecipe = resolveStrokeRecipe(semi.stroke[divider.strokeLevel], themeResult);

  return {
    ...divider,
    level,
    motionRecipe: resolveMotionRecipe(semi.motion[divider.motion], themeResult),
    opacity: strokeRecipe.opacity,
    orientation: options?.orientation ?? config.defaults.orientation,
    spacing: resolveSemiSpacing(themeResult.tokens.spacing, divider.spacingToken),
    strokeRecipe,
    width: options?.width ?? config.defaults.width,
  };
};
