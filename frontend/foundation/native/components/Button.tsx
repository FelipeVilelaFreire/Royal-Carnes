import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";

export interface ButtonProps {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: Record<string, boolean>;
  appearance?: "solid" | "soft" | "transparent";
  children?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: any;
  tone?: "neutral" | "primary";
}

export const Button: React.FC<ButtonProps> = ({
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
  appearance = "solid",
  children,
  disabled = false,
  onPress,
  style,
  tone = "primary",
}) => {
  const { designSystem, hosts } = useUi();
  const { Pressable, Text } = hosts;
  const state = disabled
    ? "disabled"
    : appearance === "transparent"
      ? "inactive"
      : appearance === "soft" && tone === "primary"
        ? "active"
        : "default";
  const descriptor = designSystem.primitives.Button?.states[state] || {};

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={mergeStyles(descriptor, style)}
    >
      {typeof children === "string" || typeof children === "number" ? <Text style={descriptor.text}>{children}</Text> : children}
    </Pressable>
  );
};
