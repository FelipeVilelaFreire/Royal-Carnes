import type { UiFoundationTokenOverrides, UiFoundationTokens, UiGradientLevel } from "./themeBindings";
import { resolveSemiComposedFoundationTokens } from "./resolveTokens";

export type UiRadiusTokenKey = keyof UiFoundationTokens["radius"];
export type UiSpacingTokenKey = keyof UiFoundationTokens["spacing"];
export type UiBorderTokenKey = Exclude<keyof UiFoundationTokens["borders"], "style">;
export type UiMotionDurationTokenKey = "duration2xs" | "durationXs" | "durationSm" | "durationMd" | "durationLg" | "durationXl" | "duration2xl" | "duration3xl" | "durationInstant" | "durationFast" | "durationNormal" | "durationSlow" | "durationSlower";
type UiElevationTokenKey = keyof UiFoundationTokens["elevation"];

export const clampRecipeScale = (value: number | undefined, fallback = 100) => Math.max(0, Math.min(300, Number.isFinite(value) ? Number(value) : fallback));
export const scaleTokenValue = (value: number, scale = 100) => Math.round(value * clampRecipeScale(scale) / 100 * 100) / 100;

export const resolveRecipeTokens = (tokens?: UiFoundationTokens | UiFoundationTokenOverrides) => resolveSemiComposedFoundationTokens(tokens as UiFoundationTokenOverrides | undefined);
export const resolveRadiusRecipe = (tokens: UiFoundationTokens, token: UiRadiusTokenKey, scale = 100) => scaleTokenValue(tokens.radius[token], scale);
export const resolveSpacingRecipe = (tokens: UiFoundationTokens, token: UiSpacingTokenKey, scale = 100) => scaleTokenValue(tokens.spacing[token], scale);
export const resolveBorderRecipe = (tokens: UiFoundationTokens, token: UiBorderTokenKey, scale = 100) => scaleTokenValue(tokens.borders[token], scale);
export const resolveMotionDurationRecipe = (tokens: UiFoundationTokens, token: UiMotionDurationTokenKey, scale = 100) => scaleTokenValue(tokens.motion[token], scale);
export const resolveGradientLevelRecipe = (tokens: UiFoundationTokens, token: UiGradientLevel = "md", scale = 100) => {
  const level = tokens.gradients[token] || tokens.gradients.md;
  const ratio = clampRecipeScale(scale) / 100;
  const fromOpacity = level.fromOpacityToken ? tokens.opacity[level.fromOpacityToken] : level.fromOpacity;
  const toOpacity = level.toOpacityToken ? tokens.opacity[level.toOpacityToken] : level.toOpacity;
  const intensity = level.intensityToken ? tokens.opacity[level.intensityToken] : level.intensity;
  const fromPosition = level.fromPositionToken ? tokens.opacity[level.fromPositionToken] : level.fromPosition;
  const toPosition = level.toPositionToken ? tokens.opacity[level.toPositionToken] : level.toPosition;
  return {
    ...level,
    fromOpacity: Math.min(100, fromOpacity * ratio),
    fromPosition: Math.min(100, fromPosition),
    intensity: Math.min(150, intensity * ratio),
    toOpacity: Math.min(100, toOpacity * ratio),
    toPosition: Math.min(100, toPosition),
  };
};
export const resolveElevationRecipe = (tokens: UiFoundationTokens, token: UiElevationTokenKey, scale = 100) => {
  const level = tokens.elevation[token];
  const ratio = clampRecipeScale(scale) / 100;
  const blur = level.blurToken ? tokens.blur[level.blurToken] : level.blur;
  const opacity = level.opacityToken ? tokens.opacity[level.opacityToken] : level.opacity;
  const innerBlur = level.innerBlurToken ? tokens.blur[level.innerBlurToken] : level.innerBlur ?? 0;
  const innerOpacity = level.innerOpacityToken ? tokens.opacity[level.innerOpacityToken] : level.innerOpacity ?? 0;
  return {
    ...level,
    x: level.x * ratio,
    y: level.y * ratio,
    blur: blur * ratio,
    spread: level.spread * ratio,
    opacity: Math.min(100, opacity * ratio),
    native: level.native * ratio,
    innerX: (level.innerX ?? 0) * ratio,
    innerY: (level.innerY ?? 0) * ratio,
    innerBlur: innerBlur * ratio,
    innerSpread: (level.innerSpread ?? 0) * ratio,
    innerOpacity: Math.min(100, innerOpacity * ratio),
  };
};

export const resolveSizedRadiusToken = (base: UiRadiusTokenKey, size: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl") => {
  if (base === "full" || base === "none") return base;
  return size;
};
