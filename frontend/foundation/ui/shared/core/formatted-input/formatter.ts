import type { FormattedInputFormat } from "./contract";
import { completeDecimalBR, formatCnpj, formatCpf, formatDecimalBR, formatPhoneBR, formatPostalCodeBR, formatTaxIdBR, normalizeDecimalBR } from "./formats";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function normalizeFormattedInputValue(value: string, format?: FormattedInputFormat): string {
  if (format === "decimalBR") return normalizeDecimalBR(value);
  if (!format) return value;
  return digitsOnly(value);
}

export function formatFormattedInputValue(value: string | null | undefined, format?: FormattedInputFormat): string {
  const source = String(value || "");
  if (format === "cpf") return formatCpf(source);
  if (format === "cnpj") return formatCnpj(source);
  if (format === "taxIdBR") return formatTaxIdBR(source);
  if (format === "phoneBR") return formatPhoneBR(source);
  if (format === "postalCodeBR") return formatPostalCodeBR(source);
  if (format === "decimalBR") return formatDecimalBR(source);
  return source;
}

export function completeFormattedInputValue(value: string, format?: FormattedInputFormat): string {
  return format === "decimalBR" ? completeDecimalBR(value) : normalizeFormattedInputValue(value, format);
}
