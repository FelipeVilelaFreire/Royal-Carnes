"use client";

import React from "react";
import { useUiConfig } from "../UiProvider";

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

const variantDefaults: Record<UiTextVariant, { family: string; size: string; lineHeight: string; weight: string }> = {
  h1: { family: "headingFamily", size: "size3xl", lineHeight: "lineHeight3xl", weight: "bold" },
  h2: { family: "headingFamily", size: "size2xl", lineHeight: "lineHeight2xl", weight: "bold" },
  h3: { family: "headingFamily", size: "sizeXl", lineHeight: "lineHeightXl", weight: "semibold" },
  body: { family: "bodyFamily", size: "sizeMd", lineHeight: "lineHeightMd", weight: "regular" },
  caption: { family: "bodyFamily", size: "sizeXs", lineHeight: "lineHeightXs", weight: "regular" },
};

const cssLength = (value: string) => `var(--theme--typography-${value})`;
const cssWeight = (value: string) => `var(--theme--typography-${value})`;
const cssColor = (tone?: string) => tone === "inherit" ? "inherit" : `var(--theme--color-${tone || "text"}, var(--theme--color-text))`;

export const Text: React.FC<TextProps> = ({
  as,
  variant = "body",
  font,
  size,
  weight,
  tone,
  lineHeight,
  letterSpacing,
  children,
  style,
  ...props
}) => {
  const ui = useUiConfig();
  const textDefaults = (ui.text || {}) as Record<string, any>;
  const recipe = variantDefaults[variant];
  const Component = as || (variant === "h1" ? "h1" : variant === "h2" ? "h2" : variant === "h3" ? "h3" : "p");

  const defaultStyles: React.CSSProperties = {
    color: cssColor(tone || textDefaults[`${variant}Tone`] || textDefaults.defaults?.tone),
    fontFamily: font || cssLength(recipe.family),
    fontSize: size || cssLength(recipe.size),
    fontWeight: weight || cssWeight(recipe.weight),
    letterSpacing: letterSpacing || cssLength(recipe.size.replace("size", "letterSpacing")),
    lineHeight: lineHeight || cssLength(recipe.lineHeight),
    margin: 0,
    ...style
  };

  return (
    <Component {...props} style={defaultStyles}>
      {children}
    </Component>
  );
};
