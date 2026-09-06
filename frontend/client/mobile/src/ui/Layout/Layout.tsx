import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface LayoutProps {
  children?: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  style?: any;
}

export const Stack: React.FC<LayoutProps> = ({ children, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { flexDirection: "column" }, style)}>
      {children}
    </View>
  );
};

export const Inline: React.FC<LayoutProps> = ({ children, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { flexDirection: "row" }, style)}>
      {children}
    </View>
  );
};

export const Container: React.FC<LayoutProps> = ({ children, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View style={mergeStyles(designSystem.primitives.Layout?.states.default, { width: "100%" }, style)}>
      {children}
    </View>
  );
};
