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
  const resolvedSize = typeof size === "number" ? `${size}px` : `var(--theme--dimensions-icon-${size})`;
  const resolvedColor = tone === "inherit" ? "inherit" : `var(--theme--color-${tone}, currentColor)`;

  return (
    <span
      {...props}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: resolvedColor,
        fontSize: resolvedSize,
        height: resolvedSize,
        width: resolvedSize,
        ...style
      }}
    >
      {children}
    </span>
  );
};
