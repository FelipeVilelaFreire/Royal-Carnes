import { resolveThemePhysicalTokens, type UiColorTokens, type UiSpacingTokens, type UiThemePhysicalTokens } from "../../tokens";
import type {
  DisabledRecipe,
  ElevationRecipe,
  FocusRingRecipe,
  GlassRecipe,
  GradientRecipe,
  IconRecipe,
  MotionRecipe,
  ResolvedDisabledRecipe,
  ResolvedElevationRecipe,
  ResolvedFocusRingRecipe,
  ResolvedGlassRecipe,
  ResolvedGradientRecipe,
  ResolvedIconRecipe,
  ResolvedMotionRecipe,
  ResolvedStateLayerRecipe,
  ResolvedStrokeRecipe,
  ResolvedSurfaceRecipe,
  ResolvedTextRecipe,
  SemiComposedConfig,
  SemiLevel,
  SemiThemeInput,
  StateLayerRecipe,
  StrokeRecipe,
  SurfaceAppearance,
  SurfaceRecipe,
  SurfaceRecipeOverride,
  SurfaceResolveOptions,
  TextRecipe,
  ThemeOpacityToken,
} from "./contract";
import { DEFAULT_SEMI_COMPOSED_CONFIG } from "./defaults";

export type ResolvedSemiTheme = {
  colors: UiColorTokens;
  tokens: UiThemePhysicalTokens;
};

export const resolveSemiTheme = (theme: SemiThemeInput): ResolvedSemiTheme => {
  if (!theme || !theme.modes) {
    const fallbackColors = (theme as any)?.colors || {
      primary: "#D4AF37",
      background: "#121212",
      surface: "#1E1E1E",
      border: "rgba(255,255,255,0.1)",
      text: "#F5F5F5",
      textMuted: "#A0A0A0"
    };
    return {
      colors: fallbackColors,
      tokens: resolveThemePhysicalTokens(theme?.tokens),
    };
  }
  const mode = (theme as any)?.defaultMode || "dark";
  const colors = theme.modes[mode as keyof typeof theme.modes] || theme.modes.dark || theme.modes.light;
  return {
    colors,
    tokens: resolveThemePhysicalTokens(theme.tokens),
  };
};

export const resolveSemiComposedConfig = (overrides?: Partial<SemiComposedConfig>): SemiComposedConfig => {
  if (!overrides) return DEFAULT_SEMI_COMPOSED_CONFIG;
  return {
    ...DEFAULT_SEMI_COMPOSED_CONFIG,
    ...overrides,
    disabled: { ...DEFAULT_SEMI_COMPOSED_CONFIG.disabled, ...overrides.disabled },
    focusRing: { ...DEFAULT_SEMI_COMPOSED_CONFIG.focusRing, ...overrides.focusRing },
    glass: { ...DEFAULT_SEMI_COMPOSED_CONFIG.glass, ...overrides.glass },
    gradient: { ...DEFAULT_SEMI_COMPOSED_CONFIG.gradient, ...overrides.gradient },
    innerElevation: { ...DEFAULT_SEMI_COMPOSED_CONFIG.innerElevation, ...overrides.innerElevation },
    icon: { ...DEFAULT_SEMI_COMPOSED_CONFIG.icon, ...overrides.icon },
    motion: { ...DEFAULT_SEMI_COMPOSED_CONFIG.motion, ...overrides.motion },
    outerElevation: { ...DEFAULT_SEMI_COMPOSED_CONFIG.outerElevation, ...overrides.outerElevation },
    stateLayer: { ...DEFAULT_SEMI_COMPOSED_CONFIG.stateLayer, ...overrides.stateLayer },
    stroke: { ...DEFAULT_SEMI_COMPOSED_CONFIG.stroke, ...overrides.stroke },
    surface: { ...DEFAULT_SEMI_COMPOSED_CONFIG.surface, ...overrides.surface },
    surfaceAppearance: { ...DEFAULT_SEMI_COMPOSED_CONFIG.surfaceAppearance, ...overrides.surfaceAppearance },
    surfaceTone: { ...DEFAULT_SEMI_COMPOSED_CONFIG.surfaceTone, ...overrides.surfaceTone },
    text: { ...DEFAULT_SEMI_COMPOSED_CONFIG.text, ...overrides.text },
  };
};

const sizeKey = (level: SemiLevel) => level === "2xs" ? "size2xs" : level === "2xl" ? "size2xl" : level === "3xl" ? "size3xl" : `size${level[0].toUpperCase()}${level.slice(1)}` as keyof UiThemePhysicalTokens["typography"];
const lineKey = (level: SemiLevel) => level === "2xs" ? "lineHeight2xs" : level === "2xl" ? "lineHeight2xl" : level === "3xl" ? "lineHeight3xl" : `lineHeight${level[0].toUpperCase()}${level.slice(1)}` as keyof UiThemePhysicalTokens["typography"];
const letterKey = (level: SemiLevel) => level === "2xs" ? "letterSpacing2xs" : level === "2xl" ? "letterSpacing2xl" : level === "3xl" ? "letterSpacing3xl" : `letterSpacing${level[0].toUpperCase()}${level.slice(1)}` as keyof UiThemePhysicalTokens["typography"];
const spacingKey = (level: SemiLevel) => level === "2xs" ? "space2xs" : level === "2xl" ? "space2xl" : level === "3xl" ? "space3xl" : `space${level[0].toUpperCase()}${level.slice(1)}` as keyof UiSpacingTokens;
export const resolveSemiSpacing = (spacing: UiSpacingTokens, level: SemiLevel): number => Number(spacing?.[spacingKey(level)] || 0);

const opacityValue = (tokens: UiThemePhysicalTokens, token: ThemeOpacityToken) => {
  if (!tokens || !tokens.opacity) {
    if (token === "opaque" || token === "100") return 1;
    if (token === "invisible" || token === "0") return 0;
    const num = Number(token);
    return isNaN(num) ? 1 : num / 100;
  }
  const val = tokens.opacity[token];
  if (val !== undefined) return Number(val) / 100;
  if (token === "opaque") return 1;
  if (token === "invisible") return 0;
  const num = Number(token);
  return isNaN(num) ? 1 : num / 100;
};

const shadow = (elevation: UiThemePhysicalTokens["elevation"][keyof UiThemePhysicalTokens["elevation"]], color: string, opacity: number) =>
  !elevation || (elevation.blur <= 0 && elevation.y <= 0) ? "none" : `${elevation.x}px ${elevation.y}px ${elevation.blur}px ${elevation.spread}px color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;

export const resolveTextRecipe = (recipe: TextRecipe, theme: ResolvedSemiTheme): ResolvedTextRecipe => ({
  ...recipe,
  color: theme?.colors?.[recipe.toneToken] || "#F5F5F5",
  fontFamily: String(theme?.tokens?.typography?.[recipe.fontToken] || "sans-serif"),
  fontSize: Number(theme?.tokens?.typography?.[sizeKey(recipe.sizeToken as SemiLevel)] || 16),
  fontWeight: Number(theme?.tokens?.typography?.[recipe.weightToken] || 400),
  lineHeight: Number(theme?.tokens?.typography?.[lineKey(recipe.lineHeightToken as SemiLevel)] || 24),
  letterSpacing: Number(theme?.tokens?.typography?.[letterKey(recipe.letterSpacingToken as SemiLevel)] || 0),
});

export const resolveIconRecipe = (recipe: IconRecipe, theme: ResolvedSemiTheme): ResolvedIconRecipe => ({
  ...recipe,
  color: theme?.colors?.[recipe.toneToken] || "inherit",
  fill: recipe.fillToken === "none" ? "none" : theme?.colors?.[recipe.fillToken] || "none",
  size: theme?.tokens?.dimensions?.icon?.[recipe.sizeToken] || 16,
  strokeWidth: Math.max(1, theme?.tokens?.borders?.[recipe.strokeToken] || 2),
});

export const resolveStrokeRecipe = (recipe: StrokeRecipe, theme: ResolvedSemiTheme): ResolvedStrokeRecipe => ({
  ...recipe,
  color: theme?.colors?.[recipe.toneToken] || "rgba(255,255,255,0.1)",
  opacity: opacityValue(theme.tokens, recipe.opacityToken),
  width: theme?.tokens?.borders?.[recipe.widthToken] || 1,
});

export const resolveElevationRecipe = (recipe: ElevationRecipe, theme: ResolvedSemiTheme): ResolvedElevationRecipe => {
  const level = theme?.tokens?.elevation?.[recipe.level] || { opacity: 100, native: { blur: 0, color: "#000000", opacity: 0.1, x: 0, y: 2 }, x: 0, y: 2, blur: 4, spread: 0 };
  const opacity = recipe.opacityToken ? opacityValue(theme.tokens, recipe.opacityToken) : (level.opacity || 100) / 100;
  const color = theme?.colors?.[recipe.colorToken] || "#000000";
  return { ...recipe, color, native: level.native || { blur: 0, color: "#000000", opacity: 0.1, x: 0, y: 2 }, opacity, x: level.x || 0, y: level.y || 0, blur: level.blur || 0, spread: level.spread || 0, shadow: shadow(level, color, opacity) };
};

export const resolveStateLayerRecipe = (recipe: StateLayerRecipe, theme: ResolvedSemiTheme): ResolvedStateLayerRecipe => ({
  ...recipe,
  hoverColor: theme?.colors?.[recipe.hoverToneToken] || "transparent",
  hoverOpacity: opacityValue(theme.tokens, recipe.hoverOpacityToken),
  pressedColor: theme?.colors?.[recipe.pressedToneToken] || "transparent",
  pressedOpacity: opacityValue(theme.tokens, recipe.pressedOpacityToken),
  selectedColor: theme?.colors?.[recipe.selectedToneToken] || "transparent",
  selectedOpacity: opacityValue(theme.tokens, recipe.selectedOpacityToken),
});

export const resolveFocusRingRecipe = (recipe: FocusRingRecipe, theme: ResolvedSemiTheme): ResolvedFocusRingRecipe => ({
  ...recipe,
  color: theme?.colors?.[recipe.toneToken] || "#D4AF37",
  offset: resolveSemiSpacing(theme.tokens?.spacing, recipe.offsetToken as SemiLevel),
  radius: theme?.tokens?.radius?.[recipe.radiusToken] || 8,
  width: theme?.tokens?.borders?.[recipe.widthToken] || 2,
});

export const resolveMotionRecipe = (recipe: MotionRecipe, theme: ResolvedSemiTheme): ResolvedMotionRecipe => ({
  ...recipe,
  durationMs: Number(theme?.tokens?.motion?.[recipe.durationToken] || 200),
  easing: String(theme?.tokens?.motion?.[recipe.easingToken] || "ease"),
  pressedScale: Number(theme?.tokens?.motion?.[recipe.pressedScaleToken] || 98) / 100,
});

export const resolveDisabledRecipe = (recipe: DisabledRecipe, theme: ResolvedSemiTheme): ResolvedDisabledRecipe => ({
  ...recipe,
  color: theme?.colors?.[recipe.toneToken] || "#666666",
  opacity: opacityValue(theme.tokens, recipe.opacityToken),
});

export const resolveGlassRecipe = (recipe: GlassRecipe, theme: ResolvedSemiTheme): ResolvedGlassRecipe => {
  const fallback = recipe || DEFAULT_SEMI_COMPOSED_CONFIG.glass.md;
  return {
    ...fallback,
    blur: theme?.tokens?.glass?.blur?.[fallback.blurToken] || 16,
    borderOpacity: (theme?.tokens?.glass?.borderOpacity?.[fallback.borderOpacityToken] || 10) / 100,
    noise: theme?.tokens?.glass?.noise?.[fallback.noiseToken] ?? 0,
    opacity: (theme?.tokens?.glass?.opacity?.[fallback.blurToken] || 80) / 100 || opacityValue(theme.tokens, fallback.opacityToken),
    stroke: resolveStrokeRecipe(fallback.stroke || DEFAULT_SEMI_COMPOSED_CONFIG.stroke.md, theme),
    tintOpacity: (theme?.tokens?.glass?.tintOpacity?.[fallback.tintOpacityToken] || 20) / 100,
  };
};

export const resolveGradientRecipe = (recipe: GradientRecipe, theme: ResolvedSemiTheme): ResolvedGradientRecipe => {
  const fallback = recipe || { fromPositionToken: "xs", toPositionToken: "xl", angleToken: "md", intensityToken: "md", opacityToken: "opaque", directionToken: "horizontal", stops: [] };
  const fromPosition = theme?.tokens?.gradient?.fromPosition?.[fallback.fromPositionToken] || 0;
  const toPosition = theme?.tokens?.gradient?.toPosition?.[fallback.toPositionToken] || 100;
  const stops = (fallback.stops || []).map((stop, index) => ({
    ...stop,
    color: theme?.colors?.[stop.colorToken] || "#D4AF37",
    position: index === 0 ? fromPosition : index === (fallback.stops.length - 1) ? toPosition : stop.position,
  }));
  const directions = {
    diagonalBackward: "45deg",
    diagonalForward: "135deg",
    horizontal: "90deg",
    vertical: "180deg",
  } as const;
  const direction = `${theme?.tokens?.gradient?.angle?.[fallback.angleToken] ?? Number.parseFloat(directions[fallback.directionToken as keyof typeof directions] || "90deg")}deg`;
  const intensity = (theme?.tokens?.gradient?.intensity?.[fallback.intensityToken] || 100) / 100;
  const opacity = (theme?.tokens?.gradient?.opacity?.[fallback.angleToken] || 100) / 100 || opacityValue(theme.tokens, fallback.opacityToken);
  return {
    ...fallback,
    direction,
    fromPosition,
    intensity,
    opacity,
    stops,
    toPosition,
    cssImage: `linear-gradient(${direction}, ${stops.map((stop) => `color-mix(in srgb, ${stop.color} ${Math.round(intensity * opacity * 100)}%, transparent) ${stop.position}%`).join(", ")})`,
  };
};

export const resolveSurfaceRecipe = (
  recipe: SurfaceRecipe,
  config: SemiComposedConfig,
  theme: ResolvedSemiTheme,
  options?: SurfaceResolveOptions | SurfaceRecipeOverride,
): ResolvedSurfaceRecipe => {
  const baseRecipe = recipe || DEFAULT_SEMI_COMPOSED_CONFIG.surface.md;
  const safeConfig = config || DEFAULT_SEMI_COMPOSED_CONFIG;
  const hasSemanticOptions = Boolean(options && ("tone" in options || "appearance" in options || "overrides" in options));
  const semantic = hasSemanticOptions ? options as SurfaceResolveOptions : { overrides: options as SurfaceRecipeOverride | undefined };
  const next = { ...baseRecipe, ...semantic.overrides };
  const tone = semantic.tone ?? "neutral";
  const appearance = semantic.appearance ?? "solid";
  const toneRecipe = safeConfig.surfaceTone?.[tone] || DEFAULT_SEMI_COMPOSED_CONFIG.surfaceTone.neutral;
  const appearanceRecipe = safeConfig.surfaceAppearance?.[appearance] || DEFAULT_SEMI_COMPOSED_CONFIG.surfaceAppearance.solid;
  
  const glassRecipeInput = next.glassLevel ? safeConfig.glass?.[next.glassLevel as SemiLevel] || DEFAULT_SEMI_COMPOSED_CONFIG.glass.md : undefined;
  const glass = appearanceRecipe.useGlass && glassRecipeInput ? resolveGlassRecipe(glassRecipeInput, theme) : undefined;
  
  const gradientRecipeInput = next.gradientLevel ? safeConfig.gradient?.[next.gradientLevel as SemiLevel] || DEFAULT_SEMI_COMPOSED_CONFIG.gradient.md : undefined;
  const gradient = appearanceRecipe.useGradient && gradientRecipeInput ? resolveGradientRecipe({
    ...gradientRecipeInput,
    stops: [
      { colorToken: toneRecipe.gradientFromToken, position: 0 },
      { colorToken: toneRecipe.gradientToToken, position: 100 },
    ],
  }, theme) : undefined;

  const bgToken = appearanceRecipe.useToneSurface ? toneRecipe.softBgToken : toneRecipe.bgToken;
  const bgOpacity = opacityValue(theme.tokens, appearanceRecipe.bgOpacityToken);
  const foregroundToken = appearance === "solid" || appearance === "glass" || appearance === "gradient" || appearance === "soft"
    ? toneRecipe.fgToken
    : tone === "neutral" ? toneRecipe.fgToken : toneRecipe.bgToken;

  const strokeRecipeInput = next.strokeLevel ? safeConfig.stroke?.[next.strokeLevel as SemiLevel] || DEFAULT_SEMI_COMPOSED_CONFIG.stroke.md : DEFAULT_SEMI_COMPOSED_CONFIG.stroke.md;
  const stroke = resolveStrokeRecipe({
    ...strokeRecipeInput,
    toneToken: toneRecipe.borderToken,
    opacityToken: appearanceRecipe.borderOpacityToken,
  }, theme);

  const outerElevInput = next.outerElevationLevel ? safeConfig.outerElevation?.[next.outerElevationLevel as SemiLevel] || { level: "none", colorToken: "border" } : { level: "none", colorToken: "border" };
  const innerElevInput = next.innerElevationLevel ? safeConfig.innerElevation?.[next.innerElevationLevel as SemiLevel] || { level: "none", colorToken: "border" } : { level: "none", colorToken: "border" };

  return {
    ...next,
    appearance,
    bg: appearance === "outline" || appearance === "transparent" ? "transparent" : theme?.colors?.[bgToken] || "#1E1E1E",
    bgOpacity,
    color: theme?.colors?.[foregroundToken] || "#F5F5F5",
    foregroundToken,
    gradientBg: gradient?.cssImage,
    material: appearanceRecipe.material,
    radius: theme?.tokens?.radius?.[next.radiusToken] || 12,
    stroke,
    outerElevation: resolveElevationRecipe(outerElevInput, theme),
    innerElevation: resolveElevationRecipe(innerElevInput, theme),
    tone,
    glass,
    gradient,
    interaction: {
      background: 1,
      border: 1,
      borderWidth: 1,
      duration: 200,
      lift: 2,
      scale: 0.98,
      shadow: 1,
    },
  };
};
