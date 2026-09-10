import React from "react";
import { mergeStyles, useUi } from "./context";

export interface BackgroundProps {
  children?: React.ReactNode;
  pattern?: "glassFlow" | "glass" | "solid" | "none";
  style?: any;
}

export const Background: React.FC<BackgroundProps> = ({ children, pattern = "solid", style }) => {
  const { designSystem, hosts } = useUi();
  const state = pattern === "none" ? "inactive" : pattern === "solid" ? "default" : "active";

  return (
    <hosts.View style={mergeStyles(designSystem.primitives.Background?.states[state], style)}>
      {children}
    </hosts.View>
  );
};
