import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";

export interface SurfaceProps {
  appearance?: "soft" | "solid" | "transparent";
  children?: ReactNode;
  padding?: "xs" | "sm" | "md" | "lg";
  style?: any;
  tone?: "neutral" | "primary";
}

const paddingTokenMap = { xs: "space2xs", sm: "spaceXs", md: "spaceMd", lg: "spaceLg" } as const;

export const Surface: React.FC<SurfaceProps> = ({ appearance = "solid", children, padding, style, tone = "neutral" }) => {
  const { designSystem, hosts } = useUi();
  const state = appearance === "transparent" ? "inactive" : appearance === "soft" && tone === "primary" ? "active" : "default";
  const paddingValue = padding ? designSystem.theme.tokens.spacing?.[paddingTokenMap[padding]] : undefined;

  return <hosts.View style={mergeStyles(designSystem.primitives.Surface?.states[state], { padding: paddingValue }, style)}>{children}</hosts.View>;
};
