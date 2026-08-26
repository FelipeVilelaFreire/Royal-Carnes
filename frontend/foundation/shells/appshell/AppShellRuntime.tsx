"use client";

import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import { Drawer } from "./Drawer";
import { Footer } from "./Footer";
import { BottomTabBar } from "./BottomTabBar";
import { SidebarMenu } from "./SidebarMenu";
import { ScreenContent } from "./ScreenContent";
import { clientRoutes } from "../../../client/shared-core/manifests/routes";
import { themeColorsDefault } from "../../tokens/theme.tokens";

export interface AppShellRuntimeProps {
  mode?: "client" | "admin";
  config?: any;
  brandName?: string;
  brandLogo?: string;
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
  rightSlot?: React.ReactNode;
  navItems?: any[];
  routesMap?: Record<string, string>;
}

export const AppShellRuntime: React.FC<AppShellRuntimeProps> = ({
  mode = "client",
  config,
  brandName = "ROYAL PRIME",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  children,
  activePath = "/",
  onNavigate,
  rightSlot,
  navItems = [],
  routesMap
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resolve cores dinamicamente a partir do manifesto da surface (config.theme.colors)
  const activeThemeColors = config?.theme?.colors || (mode === "admin" || config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const sidebarEnabled = Boolean(config?.sidebar?.enabled);
  const headerEnabled = config?.header?.enabled !== false;
  const footerEnabled = config?.footer?.enabled !== false;
  const mobileHeaderDisabled = Boolean(config?.header?.mobile?.enabled === false);
  const contentOffsetTop = headerEnabled && !(isMobileScreen && mobileHeaderDisabled)
    ? config?.header?.contentOffsetTop || "76px"
    : "0px";
  const contentOffsetBottom = isMobileScreen && config?.bottomTabBar?.enabled !== false
    ? config?.bottomTabBar?.contentOffsetBottom || "76px"
    : "0px";

  const sidebarItems = navItems.map((item) => {
    const resolvedPath =
      item.routePath ||
      item.path ||
      (routesMap && item.routeKey && routesMap[item.routeKey]) ||
      (item.routeKey && (clientRoutes as any)[item.routeKey]) ||
      (item.key === "dashboard" ? "/" : `/${item.key}`);

    return {
      key: item.key,
      label: item.label,
      icon: item.icon,
      iconName: item.iconName,
      routePath: resolvedPath
    };
  });

  if (mode === "admin" || sidebarEnabled) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: activeThemeColors.background,
          color: activeThemeColors.text,
          transition: "background 0.3s ease, color 0.3s ease"
        }}
      >
        {/* Menu Lateral no Desktop */}
        <SidebarMenu
          config={{ ...config?.sidebar, theme: config?.theme, mode }}
          brandName={brandName}
          brandLogo={brandLogo}
          items={sidebarItems}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
          {headerEnabled && (
            <Header
              config={{ ...config?.header, theme: config?.theme, mode }}
              brandName={brandName}
              brandLogo={brandLogo}
              rightSlot={rightSlot}
              navItems={sidebarItems}
              activePath={activePath}
              onNavigate={onNavigate}
              onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            />
          )}

          <ScreenContent style={{ paddingTop: contentOffsetTop, paddingBottom: contentOffsetBottom }}>{children}</ScreenContent>

          {footerEnabled && (
            <Footer
              config={{ ...config?.footer, theme: config?.theme, mode }}
              brandName={brandName}
              brandLogo={brandLogo}
              onNavigate={onNavigate}
            />
          )}
        </div>

        {/* Drawer no Mobile */}
        <Drawer
          config={{ ...config?.drawer, theme: config?.theme, mode }}
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          brandName={brandName}
          brandLogo={brandLogo}
          navItems={sidebarItems}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        {/* BottomTabBar no Mobile */}
        <BottomTabBar
          config={{ ...config?.bottomTabBar, theme: config?.theme, mode }}
          items={sidebarItems}
          activePath={activePath}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // Layout Padrao da Landing Page / Portal
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: activeThemeColors.background,
        color: activeThemeColors.text,
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {headerEnabled && (
        <Header
          config={{ ...config?.header, theme: config?.theme, mode }}
          brandName={brandName}
          brandLogo={brandLogo}
          rightSlot={rightSlot}
          navItems={sidebarItems}
          activePath={activePath}
          onNavigate={onNavigate}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        />
      )}

      <Drawer
        config={{ ...config?.drawer, theme: config?.theme, mode }}
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        brandName={brandName}
        brandLogo={brandLogo}
        navItems={sidebarItems}
        activePath={activePath}
        onNavigate={onNavigate}
      />

      <ScreenContent style={{ paddingTop: contentOffsetTop, paddingBottom: contentOffsetBottom }}>{children}</ScreenContent>

      {footerEnabled && (
        <Footer
          config={{ ...config?.footer, theme: config?.theme, mode }}
          brandName={brandName}
          brandLogo={brandLogo}
          onNavigate={onNavigate}
        />
      )}

      <BottomTabBar
        config={{ ...config?.bottomTabBar, theme: config?.theme, mode }}
        items={sidebarItems}
        activePath={activePath}
        onNavigate={onNavigate}
      />
    </div>
  );
};
