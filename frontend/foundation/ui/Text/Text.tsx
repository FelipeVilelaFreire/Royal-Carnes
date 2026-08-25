"use client";

import React from "react";
import { themeColorsDefault } from "../../tokens/theme.tokens";

export type UiTextVariant = "h1" | "h2" | "h3" | "body" | "caption";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: UiTextVariant;
  font?: string;
  size?: string;
  weight?: string;
  tone?: string;
  lineHeight?: string;
  letterSpacing?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  as,
  variant = "body",
  font,
  size,
  weight,
  tone,
  children,
  style,
  ...props
}) => {
  const Component = as || (variant === "h1" ? "h1" : variant === "h2" ? "h2" : variant === "h3" ? "h3" : "p");

  const defaultStyles: React.CSSProperties = {
    fontFamily: font || "inherit",
    color: tone === "inherit" ? "inherit" : themeColorsDefault.dark.text,
    margin: 0,
    ...style
  };

  return (
    <Component {...props} style={defaultStyles}>
      {children}
    </Component>
  );
};
