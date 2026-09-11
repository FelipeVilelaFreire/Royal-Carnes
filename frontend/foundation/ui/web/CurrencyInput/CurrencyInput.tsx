"use client";

import React, { forwardRef, useEffect, useState, type FocusEvent, type InputHTMLAttributes } from "react";
import { Input, type InputProps } from "../Input";
import styles from "./CurrencyInput.module.css";

const DEFAULT_CURRENCY_LOCALES: Record<string, string> = {
  ARS: "es-AR",
  BRL: "pt-BR",
  CAD: "en-CA",
  CHF: "de-CH",
  CLP: "es-CL",
  COP: "es-CO",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  MXN: "es-MX",
  PYG: "es-PY",
  USD: "en-US",
  UYU: "es-UY",
};

export interface CurrencyInputProps extends Omit<InputProps, "defaultValue" | "onChange" | "type" | "value"> {
  allowNegative?: boolean;
  currency?: string;
  defaultValue?: number | null;
  locale?: string;
  onChange?: (valueCents: number | null) => void;
  value?: number | null;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function resolveCurrencyLocale(currency = "BRL", locale?: string): string {
  return locale || DEFAULT_CURRENCY_LOCALES[currency.toUpperCase()] || "pt-BR";
}

function centsToDigits(valueCents: number | null | undefined): string {
  if (valueCents === undefined || valueCents === null || Number.isNaN(Number(valueCents))) return "";
  return String(Math.round(Math.abs(Number(valueCents))));
}

function parseDigitsToCents(value: string, allowNegative: boolean): number | null {
  const digits = onlyDigits(value);
  if (!digits) return null;
  const sign = allowNegative && value.trim().startsWith("-") ? -1 : 1;
  return sign * Number(digits);
}

function formatCurrencyCents(
  valueCents: number | null | undefined,
  currency = "BRL",
  locale?: string,
): string {
  if (valueCents === undefined || valueCents === null || Number.isNaN(Number(valueCents))) return "";
  return new Intl.NumberFormat(resolveCurrencyLocale(currency, locale), {
    currency,
    style: "currency",
  }).format(Number(valueCents) / 100);
}

function resolveCurrencyDigits(
  previousDigits: string,
  nextDisplay: string,
  previousDisplay: string,
  allowNegative: boolean,
): string {
  const nextDigits = onlyDigits(nextDisplay);
  const previousAbsDigits = onlyDigits(previousDigits);
  const typedMinus = allowNegative && nextDisplay.includes("-") && !previousDisplay.includes("-");
  const typedPlus = allowNegative && nextDisplay.includes("+") && !previousDisplay.includes("+");
  const nextIsNegative = allowNegative && (nextDisplay.includes("-") || (previousDigits.trim() === "-" && !previousDisplay));

  if (!nextDisplay) return "";
  if (typedPlus && previousAbsDigits) return previousAbsDigits;
  if (typedMinus && previousAbsDigits) return previousDigits.trim().startsWith("-") ? previousAbsDigits : `-${previousAbsDigits}`;
  if (allowNegative && nextDisplay.trim() === "-") return "-";

  const sign = nextIsNegative ? "-" : "";
  if (nextDigits === previousAbsDigits && nextDisplay.length < previousDisplay.length) {
    const slicedDigits = previousAbsDigits.slice(0, -1);
    return slicedDigits ? `${sign}${slicedDigits}` : sign;
  }

  return nextDigits ? `${sign}${nextDigits}` : sign;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  {
    allowNegative = false,
    className,
    currency = "BRL",
    defaultValue,
    inputMode,
    locale,
    onBlur,
    onChange,
    onFocus,
    value,
    ...props
  },
  ref,
) {
  const [internalDigits, setInternalDigits] = useState(() => {
    if (value !== undefined) return centsToDigits(value);
    if (defaultValue !== undefined) return centsToDigits(defaultValue);
    return "";
  });

  useEffect(() => {
    if (value !== undefined) setInternalDigits(centsToDigits(value));
  }, [value]);

  const numericValue = value === undefined ? parseDigitsToCents(internalDigits, allowNegative) : value;
  const display = formatCurrencyCents(numericValue, currency, locale);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  };

  const handleChange: InputHTMLAttributes<HTMLInputElement>["onChange"] = (event) => {
    const nextDigits = resolveCurrencyDigits(internalDigits, event.target.value, display, allowNegative);
    setInternalDigits(nextDigits);
    onChange?.(parseDigitsToCents(nextDigits, allowNegative));
  };

  return (
    <Input
      {...props}
      className={[styles.currencyInput, className].filter(Boolean).join(" ")}
      inputMode={inputMode || (allowNegative ? "text" : "decimal")}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={ref}
      type="text"
      value={display}
    />
  );
});

export const UiCurrencyInput = CurrencyInput;
