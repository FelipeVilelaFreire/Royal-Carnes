import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface SurfaceProps {
  appearance?: "glass" | "outline" | "soft" | "solid" | "transparent";
  children?: ReactNode;
  style?: any;
  tone?: "danger" | "neutral" | "primary" | "success" | "warning";
}

export const Surface: React.FC<SurfaceProps> = ({ appearance = "solid", children, style, tone = "neutral" }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;
  const state = appearance === "transparent"
    ? "inactive"
    : appearance === "soft" && tone === "primary"
      ? "active"
      : "default";

  return (
    <View style={mergeStyles(designSystem.primitives.Surface?.states[state], style)}>
      {children}
    </View>
  );
};
