"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { AppearanceEditor } from "./AppearanceEditor";
import { Background, UiProvider } from "../../../ui/web";
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
  const shellRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const mobileBreakpoint = config?.layout?.mobileBreakpoint || "48em";
  const mobileQuery = `(max-width: ${mobileBreakpoint})`;
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(mobileQuery).matches
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(Boolean(config?.sidebar?.defaultCollapsed));
  const [themeMode, setThemeMode] = useState<string>(() => config?.theme?.defaultMode || "dark");
  const [appearanceEditorOpen, setAppearanceEditorOpen] = useState(false);
  const [appearanceDraft, setAppearanceDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = config?.theme?.modeStorageKey;
    if (!storageKey) return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored && config?.theme?.modes?.[stored]) {
      setThemeMode(stored);
    }
  }, [config?.theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileQuery);
    const handleResize = () => setIsMobileScreen(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [mobileQuery]);

  useEffect(() => {
    let frameId = 0;
    const activationRatio = Number(config?.header?.scrollActivationViewportRatio ?? 1 / 12);
    const resetRatio = Number(config?.header?.scrollResetViewportRatio ?? 1 / 48);
    const transitionRatio = Number(config?.header?.scrollTransitionViewportRatio ?? 1 / 6);

    const updateScrolledState = () => {
      frameId = 0;
      const scrollDistance = Math.max(window.innerHeight * transitionRatio, 1);
      const progress = Math.max(0, Math.min(1, window.scrollY / scrollDistance));
      shellRef.current?.style.setProperty("--app-shell-header-scroll-progress", progress.toFixed(3));

      setIsScrolled((current) => {
        const next = current ? window.scrollY > window.innerHeight * resetRatio : window.scrollY > window.innerHeight * activationRatio;
        return next === current ? current : next;
      });
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateScrolledState);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [config?.header?.scrollActivationViewportRatio, config?.header?.scrollResetViewportRatio, config?.header?.scrollTransitionViewportRatio]);

  const resolvedConfig = useMemo(() => {
    if (!config?.theme?.modes?.[themeMode]) return config;
    const editor = config.theme.appearanceEditor;
    const findOption = (group: string) => editor?.[group]?.find((option: any) => option.id === appearanceDraft[group]) || editor?.[group]?.[0];
    const palette = findOption("paletteOptions");
    const font = findOption("fontOptions");
    const radius = findOption("radiusOptions");
    const border = findOption("borderOptions");
    const glass = findOption("glassOptions");
    return {
      ...config,
      theme: {
        ...config.theme,
        colors: { ...config.theme.modes[themeMode], ...palette?.colors },
        tokens: {
          ...config.theme.tokens,
          typography: { ...config.theme.tokens?.typography, ...font?.tokens },
          radius: { ...config.theme.tokens?.radius, ...radius?.tokens },
          borders: { ...config.theme.tokens?.borders, ...border?.tokens },
          glass: { ...config.theme.tokens?.glass, ...glass?.tokens },
        },
      },
      visual: { ...config.visual, material: glass?.material || config.visual?.material },
    };
  }, [appearanceDraft, config, themeMode]);

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

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    Object.entries(model.cssVars).forEach(([key, value]) => {
      shell.style.setProperty(key, value);
    });
  }, [model.cssVars]);

  return (
    <UiProvider config={resolvedConfig as any}>
      <div
        className={[styles.shell, model.sidebarEnabled ? styles.shellWithSidebar : ""].filter(Boolean).join(" ")}
        data-app-shell-mode={model.effectiveMode}
        data-app-shell-material={resolvedConfig?.visual?.material}
        data-mobile-screen={isMobileScreen ? "true" : "false"}
        data-sidebar-collapsed={model.sidebarEnabled && isSidebarCollapsed ? "true" : undefined}
        ref={shellRef}
      >
      <Background background={resolvedConfig?.visual?.background} cursor={resolvedConfig?.visual?.cursor} />
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
          isScrolled={isScrolled}
          model={model}
          onNavigate={handleNavigate}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenAppearanceEditor={() => setAppearanceEditorOpen(true)}
          onThemeModeToggle={handleThemeModeToggle}
          rightSlot={rightSlot}
          surfaceStyle={resolvedConfig?.header?.surfaceStyle}
          themeMode={themeMode}
        />
        <ScreenContent layout={model.currentLayout.content}>
          {children}
        </ScreenContent>
        <AppShellFooter model={model} onNavigate={handleNavigate} />
      </div>
      <AppShellDrawer
        config={resolvedConfig}
        isMobileScreen={isMobileScreen}
        isOpen={isDrawerOpen}
        model={model}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleNavigate}
      />
      <AppShellBottomTabBar model={model} onNavigate={handleNavigate} onOpenMore={() => setIsDrawerOpen(true)} />
      {resolvedConfig?.header?.appearanceEditor?.enabled ? (
        <AppearanceEditor config={resolvedConfig.theme?.appearanceEditor} experiments={resolvedConfig.header?.appearanceEditor?.experiments} onChange={setAppearanceDraft} onClose={() => setAppearanceEditorOpen(false)} onNavigate={handleNavigate} open={appearanceEditorOpen} strings={model.strings.appearanceEditor} value={appearanceDraft} />
      ) : null}
      </div>
    </UiProvider>
  );
};
