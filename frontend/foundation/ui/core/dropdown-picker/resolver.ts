import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveSurfaceRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_DROPDOWN_PICKER_CONFIG } from "./defaults";
import type {
  DropdownPickerConfig,
  DropdownPickerResolveOptions,
  ResolvedDropdownPickerRecipe,
} from "./contract";

export const resolveDropdownPickerConfig = (
  overrides?: Partial<DropdownPickerConfig>,
): DropdownPickerConfig => ({
  defaults: {
    ...DEFAULT_DROPDOWN_PICKER_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_DROPDOWN_PICKER_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

export const resolveDropdownPickerRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  dropdownPickerOverrides?: Partial<DropdownPickerConfig>,
  options?: DropdownPickerResolveOptions,
): ResolvedDropdownPickerRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveDropdownPickerConfig(dropdownPickerOverrides);
  const level = options?.level ?? config.defaults.level;
  const recipe = config.recipes[level];

  return {
    ...recipe,
    gap: resolveSemiSpacing(themeResult.tokens.spacing, recipe.panel.gapToken),
    layer: (themeResult.tokens as any).layers?.[recipe.panel.layerToken] || 100,
    level,
    padding: resolveSemiSpacing(themeResult.tokens.spacing, recipe.panel.paddingToken),
    panelSurfaceRecipe: resolveSurfaceRecipe(semi.surface[recipe.panel.surfaceLevel], semi, themeResult, {
      appearance: recipe.panel.appearance,
      tone: recipe.panel.tone,
    }),
    placement: options?.placement ?? config.defaults.placement,
    width: options?.width ?? config.defaults.width,
  };
};
