import React from "react";
import { Icon } from "../Icon";
import { Surface } from "../Surface";
import { Text } from "../Text";
import { mergeStyles, useUi } from "../context";

export interface InputProps {
  accessibilityLabel?: string;
  iconIntent?: string;
  keyboardType?: string;
  maxLength?: number;
  onBlur?: () => void;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  state?: "active" | "default";
  style?: any;
  value?: string;
}

export const Input: React.FC<InputProps> = ({
  accessibilityLabel,
  iconIntent,
  keyboardType,
  maxLength,
  onBlur,
  onChangeText,
  placeholder,
  state = "default",
  style,
  value = "",
}) => {
  const { designSystem, hosts } = useUi();
  const TextInput = (hosts as any).TextInput;
  const inputStyle = mergeStyles(
    designSystem.primitives.Input?.states[state] || designSystem.primitives.Input?.states.default,
    style,
  );

  if (TextInput) {
    return (
      <TextInput
        accessibilityLabel={accessibilityLabel}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={inputStyle}
        value={value}
      />
    );
  }

  return (
    <Surface style={inputStyle}>
      {iconIntent ? <Icon intent={iconIntent} /> : null}
      <Text>{value || placeholder}</Text>
    </Surface>
  );
};
