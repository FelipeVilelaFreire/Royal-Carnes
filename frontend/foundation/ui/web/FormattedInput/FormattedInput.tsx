"use client";

import React, { forwardRef, type ReactNode } from "react";
import { completeFormattedInputValue, formatFormattedInputValue, normalizeFormattedInputValue, type FormattedInputFormat } from "../../shared/core";
import { Input, type InputProps } from "../Input";
import { Text } from "../Text";
import styles from "./FormattedInput.module.css";

export interface FormattedInputProps extends Omit<InputProps, "onChange" | "value"> {
  format?: FormattedInputFormat;
  onValueChange?: (value: string) => void;
  suffix?: ReactNode;
  value?: string | null;
}

export const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(function FormattedInput(
  { className, format, onBlur, onValueChange, suffix, value, ...props },
  ref,
) {
  const inputClassName = [
    !suffix ? className : undefined,
    props.type === "number" ? styles.numeric : undefined,
  ].filter(Boolean).join(" ");
  const control = (
    <Input
      {...props}
      className={inputClassName}
      inputMode={format ? format === "decimalBR" ? "decimal" : "numeric" : props.inputMode}
      onBlur={(event) => {
        onBlur?.(event);
        if (format === "decimalBR") onValueChange?.(completeFormattedInputValue(event.target.value, format));
      }}
      onChange={(event) => onValueChange?.(normalizeFormattedInputValue(event.target.value, format))}
      ref={ref}
      type={format ? "text" : props.type}
      value={formatFormattedInputValue(value, format)}
    />
  );

  if (!suffix) return control;
  return (
    <span className={[styles.root, className].filter(Boolean).join(" ")}>
      <span className={styles.control}>{control}</span>
      <Text as="span" className={styles.suffix} tone="muted" variant={format === "decimalBR" ? "body" : "caption"} weight="semibold">{suffix}</Text>
    </span>
  );
});

export const UiFormattedInput = FormattedInput;
