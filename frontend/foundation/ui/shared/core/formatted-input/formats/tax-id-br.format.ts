import { formatCnpj } from "./cnpj.format";
import { formatCpf } from "./cpf.format";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function formatTaxIdBR(value: string): string {
  return digitsOnly(value).length > 11 ? formatCnpj(value) : formatCpf(value);
}
