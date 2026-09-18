const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function formatPostalCodeBR(value: string): string {
  const digits = digitsOnly(value).slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}
