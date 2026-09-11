"use client";

import React, { forwardRef, type CSSProperties } from "react";
import { resolveSemiComposedConfig, resolveSemiTheme, resolveSurfaceRecipe } from "../../../semi-composed/core";
import { useUiConfig } from "../UiProvider";
import type { UiSurfaceConfig } from "../../shared/core";
import styles from "./Surface.module.css";

export type UiSurfaceAppearance = "solid" | "glass" | "soft" | "outline" | "transparent";
export type UiSurfaceTone = "neutral" | "primary" | "secondary" | "accent";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  appearance?: UiSurfaceAppearance;
  tone?: UiSurfaceTone | string;
  recipe?: any;
  geometry?: any;
  interactive?: boolean;
  shadowMode?: string;
  surfaceOpacity?: number;
  children?: React.ReactNode;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { as: Component = "div", appearance = "solid", tone = "neutral", recipe, geometry, interactive, shadowMode, surfaceOpacity, children, className, style, ...props },
  ref
) {
  const ui = useUiConfig();
  const surfaceConfig: UiSurfaceConfig = ui.surface;
  const configuredAppearance = appearance === "solid" ? surfaceConfig.appearance || appearance : appearance;
  const configuredTone = tone === "neutral" ? surfaceConfig.tone || tone : tone;
  const resolvedRecipe = recipe || resolveSurfaceRecipe(
    resolveSemiComposedConfig().surface[(surfaceConfig.level as any) || "md"],
    resolveSemiComposedConfig(),
    resolveSemiTheme(ui.theme as any),
    { appearance: configuredAppearance as any, tone: configuredTone as any },
  );
  const resolvedAppearance = resolvedRecipe?.appearance || configuredAppearance;
  const resolvedBg = resolvedRecipe?.bg && resolvedRecipe?.bgOpacity !== undefined && resolvedRecipe.bgOpacity < 1
    ? `color-mix(in srgb, ${resolvedRecipe.bg} ${Math.round(resolvedRecipe.bgOpacity * 100)}%, transparent)`
    : resolvedRecipe?.bg;
  const surfaceStyle = {
    "--ui-surface-accent": resolvedRecipe?.stroke?.color,
    "--ui-surface-bg": resolvedRecipe?.gradientBg || resolvedBg,
    "--ui-surface-blur": resolvedRecipe?.glass?.blur ? `${resolvedRecipe.glass.blur}px` : undefined,
    "--ui-surface-border": resolvedRecipe?.stroke?.color,
    "--ui-surface-border-width": `${geometry?.borderWidth ?? resolvedRecipe?.stroke?.width ?? 1}px`,
    "--ui-surface-color": resolvedRecipe?.color,
    "--ui-surface-duration": `${resolvedRecipe?.interaction?.duration ?? 180}ms`,
    "--ui-surface-highlight-opacity": "5%",
    "--ui-surface-tint-opacity": resolvedRecipe?.glass?.tintOpacity !== undefined ? `${Math.round(resolvedRecipe.glass.tintOpacity * 100)}%` : "10%",
    "--ui-surface-padding-x": geometry?.paddingX !== undefined ? `${geometry.paddingX}px` : undefined,
    "--ui-surface-padding-y": geometry?.paddingY !== undefined ? `${geometry.paddingY}px` : undefined,
    "--ui-surface-lift": interactive ? `${resolvedRecipe?.interaction?.lift ?? 0}px` : "0",
    "--ui-surface-radius": `${geometry?.radius ?? resolvedRecipe?.radius ?? 8}px`,
    "--ui-surface-shadow": shadowMode === "inner"
      ? resolvedRecipe?.innerElevation?.shadow
      : shadowMode === "none"
        ? "none"
        : resolvedRecipe?.outerElevation?.shadow,
    opacity: surfaceOpacity,
    ...style
  } as CSSProperties;

  return (
    <Component
      {...props}
      ref={ref}
      className={[styles.surface, className].filter(Boolean).join(" ")}
      data-appearance={resolvedAppearance}
      data-interactive={interactive || undefined}
      data-tone={tone}
      style={surfaceStyle}
    >
      {children}
    </Component>
  );
});
