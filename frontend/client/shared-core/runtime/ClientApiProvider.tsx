import React, { createContext, useContext, type ReactNode } from "react";
import type { ApiClientConfig } from "../../../shared-core";

const ClientApiContext = createContext<ApiClientConfig | null>(null);

export interface ClientApiProviderProps {
  children: ReactNode;
  config: ApiClientConfig;
}

export const ClientApiProvider: React.FC<ClientApiProviderProps> = ({ children, config }) => (
  <ClientApiContext.Provider value={config}>{children}</ClientApiContext.Provider>
);

export function useClientApiConfig(): ApiClientConfig {
  const config = useContext(ClientApiContext);
  if (!config) throw new Error("Client API consumers must be rendered inside ClientApiProvider.");
  return config;
}
