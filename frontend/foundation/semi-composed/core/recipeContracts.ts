/**
 * Recipe grammar belongs to Semi-composed.  Theme provides values addressed by
 * these names, but never decides which values compose a visual recipe.
 */
export const UI_RECIPE_LEVELS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
export type UiRecipeLevel = (typeof UI_RECIPE_LEVELS)[number];
export type UiBorderToken = "none" | UiRecipeLevel;
export type UiOpacityToken = "none" | UiRecipeLevel | "invisible" | "subtle" | "muted" | "disabled" | "hover" | "pressed" | "loading" | "overlay" | "scrim" | "glass" | "opaque";
export type UiSpacingToken = "base" | "space3xs" | "space2xs" | "spaceXs" | "spaceSm" | "spaceMd" | "spaceLg" | "spaceXl" | "space2xl" | "space3xl" | "controlGap" | "fieldGap" | "sectionGap" | "grid";
export type UiRadiusToken = "none" | UiRecipeLevel | "full";
export type UiElevationToken = "none" | UiRecipeLevel;
export type UiBlurToken = "none" | UiRecipeLevel;
export type UiGlassLevel = UiRecipeLevel;

export type UiGradientColorToken = "primary" | "success" | "warning" | "danger" | "surface" | "surfaceMuted";
export type UiGradientDirection = "135deg" | "180deg" | "90deg" | "45deg";
export type UiGradientLevel = UiRecipeLevel;
export type UiGradientLevelRecipe = { fromOpacity: number; fromOpacityToken?: UiOpacityToken; fromPosition: number; fromPositionToken?: UiOpacityToken; intensity: number; intensityToken?: UiOpacityToken; toOpacity: number; toOpacityToken?: UiOpacityToken; toPosition: number; toPositionToken?: UiOpacityToken };
export type UiGradientRecipe = { direction: UiGradientDirection; from: UiGradientColorToken; fromOpacity: number; level?: UiGradientLevel; to: UiGradientColorToken; toOpacity: number };
export type UiGradientTokens = Record<UiGradientLevel, UiGradientLevelRecipe> & { brand: UiGradientRecipe; brandSoft: UiGradientRecipe; success: UiGradientRecipe; warning: UiGradientRecipe; danger: UiGradientRecipe };

export type UiOverlayLevel = UiRecipeLevel;
export type UiOverlayRecipe = { blurToken?: UiBlurToken; borderToken?: UiBorderToken; innerElevation?: UiElevationToken; opacityToken?: UiOpacityToken; outerElevation?: UiElevationToken };
export type UiOverlayTokens = Record<UiOverlayLevel, UiOverlayRecipe>;
export type UiStrokeLevel = UiRecipeLevel;
export type UiStrokeRecipe = { borderToken?: UiBorderToken; opacityToken?: UiOpacityToken };
export type UiStrokeTokens = Record<UiStrokeLevel, UiStrokeRecipe>;
export type UiMotionRecipeLevel = UiRecipeLevel;
export type UiMotionRecipe = { durationToken?: UiMotionRecipeLevel; easingToken?: UiMotionRecipeLevel; liftToken?: UiMotionRecipeLevel; rotationToken?: UiMotionRecipeLevel; scaleDirection?: "down" | "up"; scaleToken?: UiMotionRecipeLevel; springToken?: UiMotionRecipeLevel };
export type UiMotionRecipeTokens = Record<UiMotionRecipeLevel, UiMotionRecipe>;
export type UiInteractionRecipe = { background: number; border: number; borderWidth: number; duration: number; lift: number; scale: number; shadow: number };
export type UiInteractionLevel = "none" | UiRecipeLevel;
export type UiInteractionTokens = Record<"none" | "soft" | "border" | "lift" | "shadow" | "emphasis" | "focus" | "pressed", UiInteractionRecipe> & { levels: { base: Record<UiInteractionLevel, Pick<UiInteractionRecipe, "background" | "border" | "borderWidth">>; depth: Record<UiInteractionLevel, Pick<UiInteractionRecipe, "shadow">>; transform: Record<UiInteractionLevel, { lift: "none" | "distanceSm" | "distanceMd" | "distanceLg"; rotation: number; scale: number }>; time: Record<UiInteractionLevel, { duration: "durationInstant" | "durationFast" | "durationNormal" | "durationSlow" | "durationSlower"; easing: "entrance" | "exit" | "standard" }> } };
export type UiDividerLevel = UiRecipeLevel;
export type UiDividerRecipe = { motion?: UiMotionRecipeLevel; opacityToken?: UiOpacityToken; radiusToken?: UiRadiusToken; spacingToken?: UiSpacingToken; stroke?: UiStrokeLevel };
export type UiDividerTokens = Record<UiDividerLevel, UiDividerRecipe>;
export type UiFocusRingLevel = UiRecipeLevel;
export type UiFocusRingRecipe = { blurToken?: UiBlurToken; offsetToken?: UiSpacingToken; opacityToken?: UiOpacityToken; stroke?: UiStrokeLevel };
export type UiFocusRingTokens = Record<UiFocusRingLevel, UiFocusRingRecipe>;
export type UiStateLayerLevel = UiRecipeLevel;
export type UiStateLayerRecipe = { backgroundOpacityToken?: UiOpacityToken; motion?: UiStateLayerLevel | "none"; outerElevation?: UiElevationToken; stroke?: UiStrokeLevel };
export type UiStateLayerTokens = Record<UiStateLayerLevel, UiStateLayerRecipe>;
export type UiDisabledLevel = UiRecipeLevel;
export type UiDisabledRecipe = { opacityToken?: UiOpacityToken; stroke?: UiStrokeLevel };
export type UiDisabledTokens = Record<UiDisabledLevel, UiDisabledRecipe>;

export type UiAmbientEffectRecipeRef = "none" | `glassCursor.${UiRecipeLevel}` | `auroraBlur.${UiRecipeLevel}`;
export type UiSurfaceRecipeMaterial = "solid" | "soft" | "outline" | "transparent" | "glass" | "gradient";
export type UiSurfaceRecipeLevel = UiRecipeLevel;
export type UiSurfaceRecipe = { ambientEffect?: UiAmbientEffectRecipeRef; glassLevel?: UiGlassLevel | "none"; gradientLevel?: UiGradientLevel | "none"; innerElevation?: UiElevationToken; outerElevation?: UiElevationToken; paddingToken?: UiSpacingToken; radiusToken?: UiRadiusToken; stateLayer?: UiStateLayerLevel | "none"; stroke?: UiStrokeLevel | "none" };
export type UiSurfaceRecipeTokens = Record<UiSurfaceRecipeMaterial, Record<UiSurfaceRecipeLevel, UiSurfaceRecipe>>;
export type UiSurfaceAppearanceToken = "solid" | "soft" | "glass" | "outline" | "transparent";
export type UiSurfacePreset = { appearance: UiSurfaceAppearanceToken; blur: number; blurToken?: UiBlurToken; borderTone?: number; borderToken?: UiBorderToken; elevation: string; innerElevation?: string; opacity: number; opacityToken?: UiOpacityToken };
export type UiSurfaceTokens = { available: string[]; presets: Record<string, UiSurfacePreset> };

export type UiDropdownPanelLevel = UiRecipeLevel;
export type UiDropdownPanel = { layerToken?: UiDropdownPanelLevel | "none"; motion?: UiMotionRecipeLevel | "none"; offsetToken?: UiSpacingToken; overlay?: UiOverlayLevel | "none"; safeAreaToken?: UiSpacingToken; surfaceLevel?: UiSurfaceRecipeLevel };
export type UiDropdownPanelTokens = Record<UiDropdownPanelLevel, UiDropdownPanel>;
export type UiListboxLevel = UiRecipeLevel;
export type UiListboxTextLevel = "body" | "label" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type UiListbox = { disabled?: UiDisabledLevel | "none"; focusRing?: UiFocusRingLevel | "none"; gapToken?: UiSpacingToken; iconLevel?: UiMotionRecipeLevel; motion?: UiMotionRecipeLevel | "none"; stateLayer?: UiStateLayerLevel | "none"; textLevel?: UiListboxTextLevel };
export type UiListboxTokens = Record<UiListboxLevel, UiListbox>;
export type UiListboxOption = { disabled?: UiDisabledLevel | "none"; focusRing?: UiFocusRingLevel | "none"; gapToken?: UiSpacingToken; iconLevel?: UiMotionRecipeLevel; paddingToken?: UiSpacingToken; stateLayer?: UiStateLayerLevel | "none"; surfaceLevel?: UiSurfaceRecipeLevel; textLevel?: UiListboxTextLevel };
export type UiListboxOptionTokens = Record<UiListboxLevel, UiListboxOption>;

export type UiBackgroundRecipeMaterial = "plain" | "gradient" | "glass" | "image" | "pattern";
export type UiBackgroundRecipeLevel = UiRecipeLevel;
export type UiBackgroundRecipe = { ambientEffect?: UiAmbientEffectRecipeRef; blurToken?: UiBlurToken; glassLevel?: UiGlassLevel | "none"; gradientLevel?: UiGradientLevel | "none"; motion?: UiMotionRecipeLevel | "none"; overlay?: UiOverlayLevel | "none"; pattern?: "none" | "noise" | "grid" | "dots" | "waves"; patternOpacityToken?: UiOpacityToken; patternScale?: UiMotionRecipeLevel | "none" };
export type UiBackgroundRecipeTokens = Record<UiBackgroundRecipeMaterial, Record<UiBackgroundRecipeLevel, UiBackgroundRecipe>>;
export type UiAmbientEffectRecipeMaterial = "glassCursor" | "auroraBlur";
export type UiAmbientEffectRecipeLevel = UiRecipeLevel;
export type UiAmbientEffectRecipe = { bloomToken?: UiRecipeLevel; chromaToken?: UiRecipeLevel; fadeToken?: UiRecipeLevel; flowDirection?: "up" | "down" | "left" | "right" | "diagonalUp" | "diagonalDown" | "radial" | "orbital"; flowToken?: UiRecipeLevel; glassLevel?: UiGlassLevel | "none"; intensityToken?: UiOpacityToken; layer?: "background" | "surface" | "overlay"; motion?: UiMotionRecipeLevel | "none"; noiseToken?: UiRecipeLevel; overlay?: UiOverlayLevel | "none"; palette?: "brandAurora" | "coolAurora" | "warmAurora" | "successAurora" | "dangerAurora" | "monoAurora"; sizeToken?: UiRecipeLevel };
export type UiAmbientEffectRecipeTokens = Record<UiAmbientEffectRecipeMaterial, Record<UiAmbientEffectRecipeLevel, UiAmbientEffectRecipe>>;
export type UiFieldRecipeLevel = UiRecipeLevel;
export type UiFieldRecipe = { controlGap?: UiRecipeLevel | "control" | "field" | "section" | "grid"; feedbackIcon?: UiFieldRecipeLevel | "none"; labelText?: UiListboxTextLevel; metaGap?: UiRecipeLevel | "control" | "field" | "section" | "grid"; metaLayout?: "between" | "stack"; metaText?: UiListboxTextLevel };
export type UiFieldRecipeTokens = Record<UiFieldRecipeLevel, UiFieldRecipe>;

export const glassPresetKey = (level: UiGlassLevel) => `glass${level === "2xs" ? "2xs" : level === "2xl" ? "2xl" : level === "3xl" ? "3xl" : level[0].toUpperCase() + level.slice(1)}`;
