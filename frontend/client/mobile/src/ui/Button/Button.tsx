import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "../context";

export interface ButtonProps {
  accessibilityLabel?: string;
  appearance?: "solid" | "soft" | "outline" | "transparent";
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  onAction?: () => void;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  style?: any;
  tone?: "danger" | "neutral" | "primary" | "success" | "warning";
}

export const Button: React.FC<ButtonProps> = ({
  accessibilityLabel,
  appearance = "solid",
  children,
  disabled = false,
  icon,
  onAction,
  onPress,
  style,
  tone = "primary",
}) => {
  const { designSystem, hosts } = useUi();
  const { Pressable, Text, View } = hosts;
  const state = disabled
    ? "disabled"
    : appearance === "transparent"
      ? "inactive"
      : appearance === "soft" && tone === "primary"
        ? "active"
        : "default";
  const descriptor = designSystem.primitives.Button?.states[state] || {};
  const textStyle = descriptor.text || designSystem.primitives.Text?.states.default;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress || onAction}
      style={mergeStyles(descriptor, style)}
    >
      {icon ? <View>{icon}</View> : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
