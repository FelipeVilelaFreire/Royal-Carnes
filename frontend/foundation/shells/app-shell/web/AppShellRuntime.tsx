"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { UiProvider } from "../../../ui";
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
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(Boolean(config?.sidebar?.defaultCollapsed));

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const model = useMemo(
    () => resolveAppShellModel({
      activePath,
      brand,
      brandLogo,
      brandName,
      config,
      isMobileScreen,
      isSidebarCollapsed,
      mode,
      navItems,
      navigation,
      routesMap,
    }),
    [activePath, brand, brandLogo, brandName, config, isMobileScreen, isSidebarCollapsed, mode, navItems, navigation, routesMap]
  );

  return (
    <UiProvider config={{ theme: config?.theme } as any}>
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
          drawerEnabled={config?.drawer?.enabled !== false && config?.header?.drawerTrigger !== false}
          headerConfig={config?.header}
          model={model}
          onNavigate={onNavigate}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          rightSlot={rightSlot}
          surfaceStyle={config?.header?.surfaceStyle}
        />
        <ScreenContent layout={model.currentLayout.content} offsetBottom={model.contentOffsetBottom} offsetTop={model.contentOffsetTop}>
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
    </UiProvider>
  );
};
