import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { resolveNativeUiManifest } from "../ui";
import type { NativeFoundationDesignSystem } from "../types";

export type NativeHostComponentProps = Record<string, any> & { children?: ReactNode };
export type NativeHostComponent = React.ComponentType<NativeHostComponentProps>;

export interface FoundationHostComponents {
  Pressable: NativeHostComponent;
  Text: NativeHostComponent;
  TextInput?: NativeHostComponent;
  View: NativeHostComponent;
}

interface NativeUiContextValue {
  designSystem: NativeFoundationDesignSystem;
  hosts: FoundationHostComponents;
}

const NativeUiContext = createContext<NativeUiContextValue | null>(null);

export interface UiProviderProps {
  children: ReactNode;
  designSystem?: NativeFoundationDesignSystem;
  hosts: FoundationHostComponents;
  mode?: "dark" | "light";
}

export const UiProvider: React.FC<UiProviderProps> = ({ children, designSystem, hosts, mode = "dark" }) => {
  const value = useMemo<NativeUiContextValue>(
    () => ({ designSystem: designSystem || resolveNativeUiManifest({ mode }), hosts }),
    [designSystem, hosts, mode],
  );

  return <NativeUiContext.Provider value={value}>{children}</NativeUiContext.Provider>;
};

export const useUi = () => {
  const value = useContext(NativeUiContext);
  if (!value) throw new Error("Native Foundation primitives must be rendered inside UiProvider.");
  return value;
};

export const mergeStyles = (...styles: Array<any>) => Object.assign({}, ...styles.filter(Boolean));
