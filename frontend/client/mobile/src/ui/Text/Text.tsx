import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface TextProps {
  children?: ReactNode;
  style?: any;
  tone?: "danger" | "inherit" | "muted" | "primary" | "success" | "warning";
  variant?: "body" | "caption" | "h1" | "h2" | "h3";
  weight?: "bold" | "regular" | "semibold";
}

export const Text: React.FC<TextProps> = ({ children, style }) => {
  const { designSystem, hosts } = useUi();
  const HostText = hosts.Text;

  return (
    <HostText style={mergeStyles(designSystem.primitives.Text?.states.default, style)}>
      {children}
    </HostText>
  );
};
