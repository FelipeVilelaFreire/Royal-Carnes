import React from "react";
import { Icon } from "../Icon";
import { Surface } from "../Surface";
import { Text } from "../Text";
import { mergeStyles, useUi } from "../context";

export interface InputProps {
  accessibilityLabel?: string;
  iconIntent?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  style?: any;
  value?: string;
}

export const Input: React.FC<InputProps> = ({
  accessibilityLabel,
  iconIntent,
  onChangeText,
  placeholder,
  style,
  value = "",
}) => {
  const { designSystem, hosts } = useUi();
  const TextInput = (hosts as any).TextInput;
  const inputStyle = mergeStyles(
    designSystem.primitives.Input?.states.default,
    style,
  );

  if (TextInput) {
    return (
      <TextInput
        accessibilityLabel={accessibilityLabel}
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
