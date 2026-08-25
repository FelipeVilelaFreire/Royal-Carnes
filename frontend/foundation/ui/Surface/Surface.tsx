"use client";

import React, { forwardRef } from "react";

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
  return (
    <Component
      {...props}
      ref={ref}
      className={className}
      style={{
        boxSizing: "border-box",
        ...style
      }}
    >
      {children}
    </Component>
  );
});
