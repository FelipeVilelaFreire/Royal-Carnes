const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function formatPhoneBR(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{1,4})(\d{1,4})/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{1,5})(\d{1,4})/, "($1) $2-$3");
}
