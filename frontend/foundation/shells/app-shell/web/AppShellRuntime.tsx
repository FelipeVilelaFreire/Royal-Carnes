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
  const [themeMode, setThemeMode] = useState<string>(() => config?.theme?.defaultMode || "dark");

  useEffect(() => {
    const storageKey = config?.theme?.modeStorageKey;
    if (!storageKey) return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored && config?.theme?.modes?.[stored]) {
      setThemeMode(stored);
    }
  }, [config?.theme]);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resolvedConfig = useMemo(() => {
    if (!config?.theme?.modes?.[themeMode]) return config;
    return {
      ...config,
      theme: {
        ...config.theme,
        colors: config.theme.modes[themeMode],
      },
    };
  }, [config, themeMode]);

  const handleNavigate = (path: string) => {
    if (path.startsWith("#")) {
      document.getElementById(path.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (path === activePath || (path === "/" && activePath === "/")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (onNavigate) {
      onNavigate(path);
      return;
    }

    if (path) {
      window.location.assign(path);
    }
  };

  const handleThemeModeToggle = () => {
    const modes = Object.keys(config?.theme?.modes || {});
    const nextMode = themeMode === "dark" && modes.includes("light") ? "light" : "dark";
    setThemeMode(nextMode);
    if (config?.theme?.modeStorageKey) {
      window.localStorage.setItem(config.theme.modeStorageKey, nextMode);
    }
    if (config?.theme?.modeChangeEvent) {
      window.dispatchEvent(new Event(config.theme.modeChangeEvent));
    }
  };

  const model = useMemo(
    () => resolveAppShellModel({
      activePath,
      brand,
      brandLogo,
      brandName,
      config: resolvedConfig,
      isMobileScreen,
      isSidebarCollapsed,
      mode,
      navItems,
      navigation,
      routesMap,
    }),
    [activePath, brand, brandLogo, brandName, resolvedConfig, isMobileScreen, isSidebarCollapsed, mode, navItems, navigation, routesMap]
  );

  return (
    <UiProvider config={{ theme: resolvedConfig?.theme } as any}>
      <div
        className={[styles.shell, model.sidebarEnabled ? styles.shellWithSidebar : ""].filter(Boolean).join(" ")}
        data-app-shell-mode={model.effectiveMode}
        style={model.cssVars as React.CSSProperties}
      >
      <AppShellSidebar
        config={resolvedConfig}
        isCollapsed={isSidebarCollapsed}
        model={model}
        onNavigate={handleNavigate}
        onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
      />
      <div className={styles.body}>
        <AppShellHeader
          drawerEnabled={resolvedConfig?.drawer?.enabled !== false && resolvedConfig?.header?.drawerTrigger !== false}
          headerConfig={resolvedConfig?.header}
          model={model}
          onNavigate={handleNavigate}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onThemeModeToggle={handleThemeModeToggle}
          rightSlot={rightSlot}
          surfaceStyle={resolvedConfig?.header?.surfaceStyle}
          themeMode={themeMode}
        />
        <ScreenContent layout={model.currentLayout.content} offsetBottom={model.contentOffsetBottom} offsetTop={model.contentOffsetTop}>
          {children}
        </ScreenContent>
        <AppShellFooter model={model} onNavigate={handleNavigate} />
      </div>
      <AppShellDrawer
        config={resolvedConfig}
        isOpen={isDrawerOpen}
        model={model}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleNavigate}
      />
      <AppShellBottomTabBar model={model} onNavigate={handleNavigate} />
      </div>
    </UiProvider>
  );
};
