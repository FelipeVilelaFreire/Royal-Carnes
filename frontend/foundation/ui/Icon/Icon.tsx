"use client";

import React from "react";

export type UiIconTone = "neutral" | "primary" | "secondary" | "accent" | "inherit" | string;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  appearance?: string;
  size?: any;
  state?: any;
  tone?: UiIconTone;
  children: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({
  appearance,
  size = "md",
  state,
  tone = "inherit",
  children,
  className,
  style,
  ...props
}) => {
  const pixelSize = typeof size === "number" ? size : 16;

  return (
    <span
      {...props}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: `${pixelSize}px`,
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        color: tone === "inherit" ? "inherit" : undefined,
        ...style
      }}
    >
      {children}
    </span>
  );
};
