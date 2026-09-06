import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { resolveNativeUiManifest, type NativeFoundationDesignSystem } from "../../../../foundation/native";
import type { NativeAppShellHostComponents } from "../../../../foundation/shells/app-shell/native";

export interface UiProviderProps {
  children: ReactNode;
  designSystem?: NativeFoundationDesignSystem;
  hosts: NativeAppShellHostComponents;
  mode?: "dark" | "light";
}

export interface UiContextValue {
  designSystem: NativeFoundationDesignSystem;
  hosts: NativeAppShellHostComponents;
  mode: "dark" | "light";
}

const UiContext = createContext<UiContextValue | null>(null);

export const UiProvider: React.FC<UiProviderProps> = ({ children, designSystem, hosts, mode = "dark" }) => {
  const value = useMemo<UiContextValue>(
    () => ({
      designSystem: designSystem || resolveNativeUiManifest({ mode }),
      hosts,
      mode,
    }),
    [designSystem, hosts, mode],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const value = useContext(UiContext);
  if (!value) {
    throw new Error("Mobile UI components must be rendered inside UiProvider.");
  }
  return value;
};

export const mergeStyles = (...styles: Array<any>) => Object.assign({}, ...styles.filter(Boolean));
