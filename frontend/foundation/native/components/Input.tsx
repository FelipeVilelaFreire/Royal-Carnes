import React from "react";
import { mergeStyles, useUi } from "./context";

export interface InputProps {
  accessibilityLabel?: string;
  keyboardType?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: any;
  value?: string;
}

export const Input: React.FC<InputProps> = ({
  accessibilityLabel,
  keyboardType,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  value = "",
}) => {
  const { designSystem, hosts } = useUi();
  const TextInput = hosts.TextInput;
  const inputStyle = mergeStyles(designSystem.primitives.Input?.states.default, style);

  if (!TextInput) return null;

  return (
    <TextInput
      accessibilityLabel={accessibilityLabel}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={inputStyle}
      value={value}
    />
  );
};
