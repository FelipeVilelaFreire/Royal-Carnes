import React, { type ReactNode } from "react";
import { completeFormattedInputValue, formatFormattedInputValue, normalizeFormattedInputValue, type FormattedInputFormat } from "../../shared/core";
import { Input, type InputProps } from "../Input";
import { Inline } from "../Layout";
import { Text } from "../Text";

export interface FormattedInputProps extends Omit<InputProps, "onChangeText" | "value"> {
  format?: FormattedInputFormat;
  onValueChange?: (value: string) => void;
  suffix?: ReactNode;
  value?: string | null;
}

export const FormattedInput: React.FC<FormattedInputProps> = ({ format, onValueChange, suffix, value, ...props }) => {
  const control = (
    <Input
      {...props}
      keyboardType={format === "decimalBR" ? "decimal-pad" : format ? "number-pad" : props.keyboardType}
      onBlur={() => {
        if (format === "decimalBR") onValueChange?.(completeFormattedInputValue(String(value || ""), format));
      }}
      onChangeText={(nextValue) => onValueChange?.(normalizeFormattedInputValue(nextValue, format))}
      value={formatFormattedInputValue(value, format)}
    />
  );

  if (!suffix) return control;
  return <Inline gap="xs" style={{ alignItems: "center" }}>{control}<Text tone="muted" variant={format === "decimalBR" ? "body" : "caption"} weight="semibold">{suffix}</Text></Inline>;
};

export const UiFormattedInput = FormattedInput;
