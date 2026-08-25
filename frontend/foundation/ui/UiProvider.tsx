"use client";

import React, { createContext, useContext, useMemo } from "react";
import { resolveSurfaceUiConfig, type ResolvedUiConfig, type SurfaceUiConfig } from "./core";

const UiConfigContext = createContext<ResolvedUiConfig | null>(null);

export interface UiProviderProps {
  children: React.ReactNode;
  config?: SurfaceUiConfig;
}

export const UiProvider: React.FC<UiProviderProps> = ({ children, config }) => {
  const resolved = useMemo(() => resolveSurfaceUiConfig(config), [config]);
  const colors = (resolved as any).tokens?.colors || (resolved as any).theme?.colors || {};

  return (
    <UiConfigContext.Provider value={resolved}>
      <div style={{ background: colors.background || "#121212", color: colors.text || "#F5F5F5", minHeight: "100vh" }}>
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
