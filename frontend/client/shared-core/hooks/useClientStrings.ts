import { clientPtBR } from "../locales/pt-BR";

export type ClientStrings = typeof clientPtBR;

export function useClientStrings() {
  return clientPtBR;
}
