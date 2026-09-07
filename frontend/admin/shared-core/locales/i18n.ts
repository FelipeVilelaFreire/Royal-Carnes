import { useMemo } from "react";
import { adminPtBR } from "./pt-BR";

export type AdminTranslateVariables = Record<string, string | number>;
export type AdminTranslate = (
  key: string,
  fallback?: string,
  variables?: AdminTranslateVariables,
) => string;

function resolveLocaleValue(catalog: Record<string, any>, key: string, fallback?: string): string {
  if (!key) return fallback || "";
  const parts = key.split(".");
  let current: any = catalog;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return fallback !== undefined ? fallback : key;
    }
  }

  return typeof current === "string" ? current : fallback || key;
}

export function createAdminTranslate(catalog: Record<string, any> = adminPtBR): AdminTranslate {
  return (key, fallback, variables) => {
    const value = resolveLocaleValue(catalog, key, fallback);
    if (!variables) return value;
    return Object.entries(variables).reduce(
      (text, [variable, replacement]) => text.replace(`{${variable}}`, String(replacement)),
      value,
    );
  };
}

export function useAdminI18n(catalog: Record<string, any> = adminPtBR) {
  return useMemo(() => ({ t: createAdminTranslate(catalog) }), [catalog]);
}

