import type { UiColorTokens } from "./contract";
import { normalizeUiSemanticSize, resolveFamilySemanticSize, type UiSemanticSize, type UiSizeRecipes, type UiSizingTokens } from "../../semi-composed/core";

export type UiIconSize = UiSemanticSize;
export type UiIconTone = "accent" | "danger" | "info" | "inverse" | "muted" | "neutral" | "primary" | "success" | "warning";
export type UiIconAppearance = "filled" | "outline";
export type UiIconState = "active" | "default" | "disabled";

/**
 * Global Icon recipe. The concrete glyph is a runtime binding supplied by the
 * consuming adapter; manifests persist only portable visual decisions.
 */
export type UiIconConfig = {
  activeFillTone: UiIconTone;
  activeStrokeTone: UiIconTone;
  appearance: UiIconAppearance;
  size: UiIconSize;
  sizeTokens?: Partial<Record<UiIconSize, UiIconSize>>;
  strokeWidth: number;
  tone: UiIconTone;
  /** @deprecated Read-only manifest compatibility. New drafts use Theme > Tamanho. */
  baseSize: number;
  /** @deprecated Read-only manifest compatibility. New drafts use Theme > Tamanho. */
  sizeScale: Record<"xs" | "sm" | "md" | "lg" | "xl", number>;
};

export const DEFAULT_UI_ICON_CONFIG: UiIconConfig = {
  activeFillTone: "primary",
  activeStrokeTone: "inverse",
  appearance: "outline",
  size: "md",
  sizeTokens: { "2xs": "2xs", xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl", "2xl": "2xl", "3xl": "3xl" },
  baseSize: 20,
  sizeScale: { xs: 60, sm: 80, md: 100, lg: 120, xl: 160 },
  strokeWidth: 2,
  tone: "neutral",
};

export function resolveUiIconConfig(config?: Partial<UiIconConfig>): UiIconConfig {
  const raw = {
    ...DEFAULT_UI_ICON_CONFIG,
    ...config,
  };
  return {
    activeFillTone: raw.activeFillTone,
    activeStrokeTone: raw.activeStrokeTone,
    appearance: raw.appearance,
    // New drafts persist a canonical semantic token. Published numeric/legacy
    // choices are compacted here before every Web and Native adapter consumes it.
    size: normalizeUiSemanticSize(raw.size),
    sizeTokens: {
      ...DEFAULT_UI_ICON_CONFIG.sizeTokens,
      ...Object.fromEntries(Object.entries(raw.sizeTokens || {}).map(([key, value]) => [normalizeUiSemanticSize(key), normalizeUiSemanticSize(value)])),
    },
    baseSize: raw.baseSize,
    sizeScale: raw.sizeScale,
    strokeWidth: Math.max(.5, Math.min(4, raw.strokeWidth)),
    tone: raw.tone,
  };
}

/** Named sizes inherit the single active company scale; a number is instance-only. */
export const resolveUiIconSize = (config: UiIconConfig, sizing: Partial<UiSizingTokens> | undefined, size?: UiIconSize | number, recipes?: UiSizeRecipes) =>
  typeof size === "number"
    ? Math.max(8, Math.min(256, size))
    : resolveFamilySemanticSize(sizing, size ? config.sizeTokens?.[size] || size : config.size, "icon", recipes);

export const resolveUiIconToneColor = (tone: UiIconTone, colors: UiColorTokens) =>
  tone === "muted" ? colors.muted
    : tone === "inverse" ? colors.textInverse
      : tone === "primary" ? colors.primary
        : tone === "accent" ? colors.accent
          : tone === "info" ? colors.info
            : tone === "success" ? colors.success
              : tone === "warning" ? colors.warning
                : tone === "danger" ? colors.danger
                  : colors.text;
