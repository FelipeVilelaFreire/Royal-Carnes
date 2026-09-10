import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";

export interface LayoutProps {
  children?: ReactNode;
  fill?: boolean;
  fullWidth?: boolean;
  gap?: "xs" | "sm" | "md" | "lg";
  justify?: "center" | "flex-end" | "flex-start" | "space-between";
  padding?: "xs" | "sm" | "md" | "lg";
  style?: any;
}

const gapTokenMap = { xs: "space2xs", sm: "spaceXs", md: "spaceMd", lg: "spaceLg" } as const;

const resolveGap = (tokens: Record<string, any>, gap: LayoutProps["gap"]) => (gap ? tokens.spacing?.[gapTokenMap[gap]] : undefined);

export const Stack: React.FC<LayoutProps> = ({ children, fill, fullWidth, gap, justify, padding, style }) => {
  const { designSystem, hosts } = useUi();
  const spacing = designSystem.theme.tokens.spacing || {};
  return <hosts.View style={mergeStyles({ flex: fill ? 1 : undefined, flexDirection: "column", gap: resolveGap(designSystem.theme.tokens, gap), justifyContent: justify, padding: resolveGap({ spacing }, padding), width: fullWidth ? "100%" : undefined }, style)}>{children}</hosts.View>;
};

export const Inline: React.FC<LayoutProps> = ({ children, gap, style }) => {
  const { designSystem, hosts } = useUi();
  return <hosts.View style={mergeStyles({ flexDirection: "row", gap: resolveGap(designSystem.theme.tokens, gap) }, style)}>{children}</hosts.View>;
};
