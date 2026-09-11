import { DEFAULT_SELECT_CONFIG } from "./defaults";
import type { ResolvedSelectRecipe, SelectConfig, SelectResolveOptions } from "./contract";

export const resolveSelectConfig = (
  overrides?: Partial<SelectConfig>,
): SelectConfig => ({
  defaults: {
    ...DEFAULT_SELECT_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_SELECT_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveSelectRecipe = (
  selectOverrides?: Partial<SelectConfig>,
  options?: SelectResolveOptions,
): ResolvedSelectRecipe => {
  const config = resolveSelectConfig(selectOverrides);
  const level = options?.level ?? config.defaults.level;
  const recipe = config.recipes[level];

  return {
    ...recipe,
    level,
    width: options?.width ?? config.defaults.width,
  };
};
