import React from "react";
import { AppShellRuntime } from "./AppShellRuntime";
import { clientAppShellConfig } from "../shared-core/client/primecutclub";

export interface AppShellProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePath = "/", onNavigate }) => {
  return (
    <AppShellRuntime mode="client" config={clientAppShellConfig} activePath={activePath} onNavigate={onNavigate}>
      {children}
    </AppShellRuntime>
  );
};
