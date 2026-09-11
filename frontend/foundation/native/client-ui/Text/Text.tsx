import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface TextProps {
  children?: ReactNode;
  style?: any;
  tone?: "danger" | "inherit" | "muted" | "primary" | "success" | "warning";
  variant?: "body" | "caption" | "h1" | "h2" | "h3";
  weight?: "bold" | "regular" | "semibold";
}

const variantTokenMap = {
  body: { size: "sizeMd", lineHeight: "lineHeightMd" },
  caption: { size: "sizeXs", lineHeight: "lineHeightXs" },
  h1: { size: "size2xl", lineHeight: "lineHeight2xl" },
  h2: { size: "sizeXl", lineHeight: "lineHeightXl" },
  h3: { size: "sizeLg", lineHeight: "lineHeightLg" },
} as const;

const toneTokenMap = {
  danger: "statusCanceled",
  inherit: undefined,
  muted: "textMuted",
  primary: "primary",
  success: "statusActive",
  warning: "statusPaused",
} as const;

const weightTokenMap = {
  bold: "bold",
  regular: "regular",
  semibold: "semibold",
} as const;

export const Text: React.FC<TextProps> = ({
  children,
  style,
  tone = "inherit",
  variant = "body",
  weight = "regular",
}) => {
  const { designSystem, hosts } = useUi();
  const HostText = hosts.Text;
  const base = designSystem.primitives.Text?.states.default;
  const colors = designSystem.theme.colors;
  const typography = designSystem.theme.tokens.typography || {};
  const variantTokens = variantTokenMap[variant];
  const toneToken = toneTokenMap[tone];
  const textStyle = {
    color: toneToken ? colors[toneToken] : base?.color,
    fontSize: typography[variantTokens.size],
    fontWeight: typography[weightTokenMap[weight]],
    lineHeight: typography[variantTokens.lineHeight],
  };

  return (
    <HostText style={mergeStyles(base, textStyle, style)}>
      {children}
    </HostText>
  );
};
