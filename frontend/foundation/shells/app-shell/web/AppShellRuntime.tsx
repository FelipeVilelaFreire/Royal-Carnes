"use client";

import React, { useMemo, useState } from "react";
import {
  resolveAppShellModel,
  type AppShellBrand,
  type AppShellConfig,
  type AppShellMode,
  type AppShellNavigationItem,
} from "../foundation";
import { AppShellBottomTabBar } from "./AppShellBottomTabBar";
import { AppShellDrawer } from "./AppShellDrawer";
import { AppShellFooter } from "./AppShellFooter";
import { AppShellHeader } from "./AppShellHeader";
import { AppShellSidebar } from "./AppShellSidebar";
import { ScreenContent } from "./ScreenContent";
import styles from "../AppShell.module.css";

export interface AppShellRuntimeProps {
  activePath?: string;
  brand?: AppShellBrand;
  brandLogo?: string;
  brandName?: string;
  children: React.ReactNode;
  config?: AppShellConfig;
  mode?: AppShellMode | string;
  navItems?: AppShellNavigationItem[];
  navigation?: AppShellNavigationItem[];
  onNavigate?: (path: string) => void;
  rightSlot?: React.ReactNode;
  routesMap?: Record<string, string>;
}

export const AppShellRuntime: React.FC<AppShellRuntimeProps> = ({
  activePath = "/",
  brand,
  brandLogo,
  brandName,
  children,
  config,
  mode,
  navItems,
  navigation,
  onNavigate,
  rightSlot,
  routesMap,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(Boolean(config?.sidebar?.defaultCollapsed));
  const model = useMemo(
    () => resolveAppShellModel({
      activePath,
      brand,
      brandLogo,
      brandName,
      config,
      isSidebarCollapsed,
      mode,
      navItems,
      navigation,
      routesMap,
    }),
    [activePath, brand, brandLogo, brandName, config, isSidebarCollapsed, mode, navItems, navigation, routesMap]
  );

  return (
    <div className={[styles.shell, model.sidebarEnabled ? styles.shellWithSidebar : ""].filter(Boolean).join(" ")} style={model.cssVars as React.CSSProperties}>
      <AppShellSidebar
        config={config}
        isCollapsed={isSidebarCollapsed}
        model={model}
        onNavigate={onNavigate}
        onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
      />
      <div className={styles.body}>
        <AppShellHeader
          drawerEnabled={config?.drawer?.enabled !== false}
          model={model}
          onNavigate={onNavigate}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          rightSlot={rightSlot}
          surfaceStyle={config?.header?.surfaceStyle}
        />
        <ScreenContent offsetBottom={model.contentOffsetBottom} offsetTop={model.contentOffsetTop}>
          {children}
        </ScreenContent>
        <AppShellFooter model={model} onNavigate={onNavigate} />
      </div>
      <AppShellDrawer
        config={config}
        isOpen={isDrawerOpen}
        model={model}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={onNavigate}
      />
      <AppShellBottomTabBar model={model} onNavigate={onNavigate} />
    </div>
  );
};
