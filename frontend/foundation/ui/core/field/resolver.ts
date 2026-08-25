import {
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveTextRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput, TextRecipe } from "../../../semi-composed/core/contract";
import { DEFAULT_FIELD_CONFIG } from "./defaults";
import type {
  FieldConfig,
  FieldResolveOptions,
  FieldTextSelection,
  ResolvedFieldRecipe,
} from "./contract";

export const resolveFieldConfig = (
  overrides?: Partial<FieldConfig>,
): FieldConfig => ({
  defaults: {
    ...DEFAULT_FIELD_CONFIG.defaults,
    ...overrides?.defaults,
  },
  recipes: {
    ...DEFAULT_FIELD_CONFIG.recipes,
    ...overrides?.recipes,
  },
});

const resolveFieldText = (
  selection: FieldTextSelection,
  semi: ReturnType<typeof resolveSemiComposedConfig>,
  theme: ReturnType<typeof resolveSemiTheme>,
) => {
  const base = semi.text[selection.level] as TextRecipe;
  return resolveTextRecipe({ ...base, toneToken: selection.toneToken }, theme);
};

export const resolveFieldRecipe = (
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  fieldOverrides?: Partial<FieldConfig>,
  options?: FieldResolveOptions,
): ResolvedFieldRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const config = resolveFieldConfig(fieldOverrides);
  const level = options?.level ?? config.defaults.level;
  const recipe = config.recipes[level];

  return {
    ...recipe,
    controlGap: resolveSemiSpacing(themeResult.tokens.spacing, recipe.controlGapToken),
    descriptionTextRecipe: resolveFieldText(recipe.description, semi, themeResult),
    errorTextRecipe: resolveFieldText(recipe.error, semi, themeResult),
    labelTextRecipe: resolveFieldText(recipe.label, semi, themeResult),
    level,
    textGap: resolveSemiSpacing(themeResult.tokens.spacing, recipe.textGapToken),
    width: options?.width ?? config.defaults.width,
  };
};
