import {
  resolveDisabledRecipe,
  resolveFocusRingRecipe,
  resolveIconRecipe,
  resolveMotionRecipe,
  resolveSemiComposedConfig,
  resolveSemiSpacing,
  resolveSemiTheme,
  resolveStateLayerRecipe,
  resolveSurfaceRecipe,
  resolveTextRecipe,
} from "../../../semi-composed/core";
import type { SemiComposedConfig, SemiThemeInput } from "../../../semi-composed/core/contract";
import { DEFAULT_BUTTON_CONFIG } from "./defaults";
import type { ButtonConfig, ButtonLevel, ButtonResolveOptions, ResolvedButtonRecipe } from "./contract";

export const resolveButtonConfig = (overrides?: Partial<ButtonConfig>): ButtonConfig => ({
  defaults: { ...DEFAULT_BUTTON_CONFIG.defaults, ...overrides?.defaults },
  recipes: { ...DEFAULT_BUTTON_CONFIG.recipes, ...overrides?.recipes },
});

export const resolveButtonRecipe = (
  level: ButtonLevel | undefined,
  theme: SemiThemeInput,
  semiOverrides?: Partial<SemiComposedConfig>,
  buttonOverrides?: Partial<ButtonConfig>,
  options?: ButtonResolveOptions,
): ResolvedButtonRecipe => {
  const semi = resolveSemiComposedConfig(semiOverrides);
  const themeResult = resolveSemiTheme(theme);
  const buttonConfig = resolveButtonConfig(buttonOverrides);
  const resolvedLevel = options?.level ?? level ?? buttonConfig.defaults.level;
  const button = buttonConfig.recipes[resolvedLevel];
  const surfaceLevel = options?.surfaceLevel ?? button.surface.level;
  const surfaceOverrides = { ...button.surface.overrides, ...options?.surfaceOverrides };
  const tone = options?.tone ?? buttonConfig.defaults.tone;
  const appearance = options?.appearance ?? buttonConfig.defaults.appearance;
  const surfaceRecipe = resolveSurfaceRecipe(semi.surface[surfaceLevel], semi, themeResult, { appearance, overrides: surfaceOverrides, tone });
  return {
    ...button,
    appearance,
    height: themeResult.tokens.dimensions.height[button.heightToken],
    minWidth: themeResult.tokens.dimensions.minWidth[button.minWidthToken],
    gap: resolveSemiSpacing(themeResult.tokens.spacing, button.gapToken),
    paddingX: resolveSemiSpacing(themeResult.tokens.spacing, button.paddingXToken),
    paddingY: resolveSemiSpacing(themeResult.tokens.spacing, button.paddingYToken),
    textRecipe: resolveTextRecipe({ ...semi.text[button.text], toneToken: surfaceRecipe.foregroundToken }, themeResult),
    iconRecipe: resolveIconRecipe({ ...semi.icon[button.icon], toneToken: surfaceRecipe.foregroundToken }, themeResult),
    surface: { ...button.surface, level: surfaceLevel, overrides: surfaceOverrides },
    surfaceRecipe,
    stateLayerRecipe: resolveStateLayerRecipe(semi.stateLayer[button.stateLayer], themeResult),
    focusRingRecipe: resolveFocusRingRecipe(semi.focusRing[button.focusRing], themeResult),
    motionRecipe: resolveMotionRecipe(semi.motion[button.motion], themeResult),
    disabledRecipe: resolveDisabledRecipe(semi.disabled[button.disabled], themeResult),
    level: resolvedLevel,
    tone,
  };
};
