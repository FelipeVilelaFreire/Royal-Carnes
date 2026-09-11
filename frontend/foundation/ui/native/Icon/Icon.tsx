import React from "react";
import { mergeStyles, useUi } from "../context";

export interface IconProps {
  intent?: string;
  name?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ intent, name, style }) => {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      nativeID={name || intent}
      style={mergeStyles(designSystem.primitives.Icon?.states.default, style)}
    />
  );
};
