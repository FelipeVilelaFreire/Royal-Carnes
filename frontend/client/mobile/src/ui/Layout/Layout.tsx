import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface LayoutProps {
  children?: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: any;
}

const gapTokenMap = {
  xs: "space2xs",
  sm: "spaceXs",
  md: "spaceMd",
  lg: "spaceLg",
  xl: "spaceXl",
} as const;

const resolveGap = (designSystem: ReturnType<typeof useUi>["designSystem"], gap?: LayoutProps["gap"]) => {
  if (!gap) return undefined;
  return designSystem.theme.tokens.spacing?.[gapTokenMap[gap]];
};

export const Stack: React.FC<LayoutProps> = ({ children, gap, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { flexDirection: "column", gap: resolveGap(designSystem, gap) }, style)}>
      {children}
    </View>
  );
};

export const Inline: React.FC<LayoutProps> = ({ children, gap, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { flexDirection: "row", gap: resolveGap(designSystem, gap) }, style)}>
      {children}
    </View>
  );
};

export const Container: React.FC<LayoutProps> = ({ children, gap, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { gap: resolveGap(designSystem, gap), width: "100%" }, style)}>
      {children}
    </View>
  );
};
