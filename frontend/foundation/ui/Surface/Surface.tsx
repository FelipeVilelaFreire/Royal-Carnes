"use client";

import React, { forwardRef, type CSSProperties } from "react";
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
  const surfaceStyle = {
    "--ui-surface-bg": recipe?.gradientBg || recipe?.bg,
    "--ui-surface-blur": recipe?.glass?.blur ? `${recipe.glass.blur}px` : undefined,
    "--ui-surface-border": recipe?.stroke?.color,
    "--ui-surface-border-width": `${geometry?.borderWidth ?? recipe?.stroke?.width ?? 1}px`,
    "--ui-surface-color": recipe?.color,
    "--ui-surface-duration": `${recipe?.interaction?.duration ?? 180}ms`,
    "--ui-surface-padding-x": geometry?.paddingX !== undefined ? `${geometry.paddingX}px` : undefined,
    "--ui-surface-padding-y": geometry?.paddingY !== undefined ? `${geometry.paddingY}px` : undefined,
    "--ui-surface-lift": interactive ? `${recipe?.interaction?.lift ?? 0}px` : "0",
    "--ui-surface-radius": `${geometry?.radius ?? recipe?.radius ?? 8}px`,
    "--ui-surface-shadow": shadowMode === "inner"
      ? recipe?.innerElevation?.shadow
      : shadowMode === "none"
        ? "none"
        : recipe?.outerElevation?.shadow,
    opacity: surfaceOpacity,
    ...style
  } as CSSProperties;

  return (
    <Component
      {...props}
      ref={ref}
      className={[styles.surface, className].filter(Boolean).join(" ")}
      data-appearance={appearance}
      data-interactive={interactive || undefined}
      data-tone={tone}
      style={surfaceStyle}
    >
      {children}
    </Component>
  );
});
