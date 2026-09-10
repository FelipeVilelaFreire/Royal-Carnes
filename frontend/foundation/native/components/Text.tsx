import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";

export interface TextProps {
  children?: ReactNode;
  style?: any;
  tone?: "danger" | "inherit" | "muted" | "primary";
  variant?: "body" | "caption" | "h3";
}

const variantTokenMap = {
  body: { size: "sizeMd", lineHeight: "lineHeightMd" },
  caption: { size: "sizeXs", lineHeight: "lineHeightXs" },
  h3: { size: "sizeLg", lineHeight: "lineHeightLg" },
} as const;

const toneTokenMap = { danger: "statusCanceled", inherit: undefined, muted: "textMuted", primary: "primary" } as const;

export const Text: React.FC<TextProps> = ({ children, style, tone = "inherit", variant = "body" }) => {
  const { designSystem, hosts } = useUi();
  const base = designSystem.primitives.Text?.states.default;
  const typography = designSystem.theme.tokens.typography || {};
  const variantTokens = variantTokenMap[variant];
  const toneToken = toneTokenMap[tone];
  const textStyle = {
    color: toneToken ? designSystem.theme.colors[toneToken] : base?.color,
    fontSize: typography[variantTokens.size],
    lineHeight: typography[variantTokens.lineHeight],
  };

  return <hosts.Text style={mergeStyles(base, textStyle, style)}>{children}</hosts.Text>;
};
