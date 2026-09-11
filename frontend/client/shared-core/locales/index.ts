import { clientDeDE } from "./de-DE";
import { clientEnUS } from "./en-US";
import { clientPtBR } from "./pt-BR";
import type { ClientLocale, ClientStrings, ClientStringsOverrides } from "./types";

const overridesByLocale: Record<ClientLocale, ClientStringsOverrides> = {
  "de-DE": clientDeDE,
  "en-US": clientEnUS,
  "pt-BR": {},
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const mergeStrings = <Base extends Record<string, any>>(base: Base, overrides: Record<string, any>): Base => {
  const result = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    result[key as keyof Base] = isRecord(base[key]) && isRecord(value)
      ? mergeStrings(base[key], value)
      : value;
  }
  return result;
};

export const resolveClientStrings = (locale: ClientLocale = "pt-BR"): ClientStrings =>
  mergeStrings(clientPtBR, overridesByLocale[locale] as Record<string, any>);

export type { ClientLocale, ClientStrings, ClientStringsOverrides } from "./types";
