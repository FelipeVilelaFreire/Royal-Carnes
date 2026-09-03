import React from "react";
import { AppShellRuntime } from "./AppShellRuntime";

export interface AppShellProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
  config?: any;
  brandName?: string;
  brandLogo?: string;
  navItems?: any[];
  routesMap?: Record<string, string>;
  rightSlot?: React.ReactNode;
  mode?: "client" | "admin";
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activePath = "/",
  onNavigate,
  config,
  brandName,
  brandLogo,
  navItems,
  routesMap,
  rightSlot,
  mode
}) => {
  const effectiveConfig = config || { navigation: [], routes: {}, mode: "client" };
  const effectiveMode = mode || (config?.mode as "admin" | "client") || "client";

  return (
    <AppShellRuntime
      mode={effectiveMode}
      config={effectiveConfig}
      brandName={brandName}
      brandLogo={brandLogo}
      navItems={navItems}
      routesMap={routesMap}
      activePath={activePath}
      onNavigate={onNavigate}
      rightSlot={rightSlot}
    >
      {children}
    </AppShellRuntime>
  );
};
