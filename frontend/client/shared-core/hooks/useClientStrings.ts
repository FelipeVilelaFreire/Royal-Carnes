import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { resolveClientStrings, type ClientLocale, type ClientStrings } from "../locales";

const ClientStringsContext = createContext<ClientStrings | null>(null);

export interface ClientStringsProviderProps {
  children: ReactNode;
  locale?: ClientLocale;
}

export const ClientStringsProvider: React.FC<ClientStringsProviderProps> = ({ children, locale = "pt-BR" }) => {
  const strings = useMemo(() => resolveClientStrings(locale), [locale]);
  return React.createElement(ClientStringsContext.Provider, { value: strings }, children);
};

export function useClientStrings() {
  return useContext(ClientStringsContext) || resolveClientStrings();
}

export type { ClientLocale, ClientStrings };
