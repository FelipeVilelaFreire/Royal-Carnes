export function normalizeDecimalBR(value: string): string {
  const source = value.replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = source.split(".");
  const decimalPart = decimalParts.join("").slice(0, 3);
  const integer = integerPart.replace(/^0+(?=\d)/, "");

  if (!integer && !decimalPart) return "";
  if (source.includes(".")) return `${integer || "0"}.${decimalPart}`;
  return integer;
}

export function formatDecimalBR(value: string): string {
  return normalizeDecimalBR(value).replace(".", ",");
}

export function completeDecimalBR(value: string): string {
  const normalized = normalizeDecimalBR(value);
  if (!normalized) return "";
  const [integer, decimal = ""] = normalized.split(".");
  return `${integer || "0"}.${decimal.padEnd(3, "0")}`;
}
