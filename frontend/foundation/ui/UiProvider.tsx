"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { injectThemeTokens } from "../tokens";
import { resolveSurfaceUiConfig, type ResolvedUiConfig, type SurfaceUiConfig } from "./core";

const UiConfigContext = createContext<ResolvedUiConfig | null>(null);

export interface UiProviderProps {
  children: React.ReactNode;
  config?: SurfaceUiConfig;
}

export const UiProvider: React.FC<UiProviderProps> = ({ children, config }) => {
  const resolved = useMemo(() => resolveSurfaceUiConfig(config), [config]);
  const target = resolved.theme?.surface === "admin" ? "admin" : "client";

  useEffect(() => {
    injectThemeTokens(target, resolved.theme as any);
  }, [resolved.theme, target]);

  return (
    <UiConfigContext.Provider value={resolved}>
      <div style={{ background: "var(--theme--color-background)", color: "var(--theme--color-text)", minHeight: "100vh" }}>
        {children}
      </div>
    </UiConfigContext.Provider>
  );
};

export const useUiConfig = (): ResolvedUiConfig => {
  const context = useContext(UiConfigContext);
  if (!context) {
    return resolveSurfaceUiConfig();
  }
  return context;
};
