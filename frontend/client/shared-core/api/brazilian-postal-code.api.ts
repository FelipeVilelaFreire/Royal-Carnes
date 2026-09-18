export interface BrazilianPostalCodeAddress {
  city: string;
  district: string;
  state: string;
  street: string;
}

interface ViaCepResponse {
  bairro?: string;
  erro?: boolean;
  localidade?: string;
  logradouro?: string;
  uf?: string;
}

const normalizePostalCode = (value: string) => value.replace(/\D/g, "");

export async function lookupBrazilianPostalCode(
  postalCode: string,
  fetcher: typeof fetch = fetch,
): Promise<BrazilianPostalCodeAddress | null> {
  const normalizedPostalCode = normalizePostalCode(postalCode);
  if (normalizedPostalCode.length !== 8) return null;

  const response = await fetcher(`https://viacep.com.br/ws/${normalizedPostalCode}/json/`);
  if (!response.ok) throw new Error("postal_code_lookup_failed");

  const data = await response.json() as ViaCepResponse;
  if (data.erro) return null;

  return {
    city: data.localidade || "",
    district: data.bairro || "",
    state: data.uf || "",
    street: data.logradouro || "",
  };
}
