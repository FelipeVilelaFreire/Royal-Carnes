"use client";

import React, { useEffect, useState } from "react";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";
import { themeSpacingDefault, themeColorsDefault } from "../../tokens/theme.tokens";

export interface HeaderNavItem {
  key: string;
  label: string;
  type?: "scroll" | "route";
  targetId?: string;
  routePath?: string;
  routeKey?: string;
  icon?: string;
}

export interface HeaderProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  rightSlot?: React.ReactNode;
  navItems?: HeaderNavItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  onToggleMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  brandName = "ROYAL PRIME",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  rightSlot,
  navItems = [],
  activePath = "/",
  onNavigate,
  onToggleMobileDrawer
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (config && config.enabled === false) return null;

  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const layoutMode = config?.layoutMode || "attached";
  const surfaceStyle = config?.surfaceStyle || "glassBlur";
  const isFloating = layoutMode === "floating";

  const topOffset = config?.floatingTopOffsetToken ? (themeSpacingDefault as any)[config.floatingTopOffsetToken] || "16px" : "16px";

  const desktopDrawerPosition = config?.desktop?.drawerPosition;
  const mobileDrawerPosition = config?.mobile?.drawerPosition ?? "right";

  const showDesktopDrawerTrigger = Boolean(desktopDrawerPosition);
  const showMobileDrawerTrigger = Boolean(mobileDrawerPosition);

  if (isMobileScreen && config?.mobile?.enabled === false) {
    return null;
  }

  const headerContainerStyle: React.CSSProperties = {
    position: isFloating ? "sticky" : "fixed",
    top: isFloating ? topOffset : "0",
    left: isFloating ? "auto" : "0",
    right: isFloating ? "auto" : "0",
    zIndex: 100,
    width: isFloating ? `calc(100% - (${topOffset} * 2))` : "100%",
    maxWidth: isFloating ? "1280px" : "100%",
    margin: isFloating ? "0 auto" : "0",
    background: surfaceStyle === "glassBlur" ? (config?.mode === "admin" ? "rgba(15, 26, 48, 0.85)" : "rgba(21, 19, 18, 0.92)") : themeColors.surface,
    backdropFilter: surfaceStyle === "glassBlur" ? "blur(20px)" : "none",
    borderBottom: `1px solid ${themeColors.border}`,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: isFloating ? "16px" : "0px",
    transition: "all 0.3s ease"
  };

  return (
    <header style={headerContainerStyle} data-header-layout={layoutMode}>
      {isMobileScreen ? (
        <HeaderMobile
          config={config}
          brandName={brandName}
          brandLogo={brandLogo}
          rightSlot={rightSlot}
          onNavigate={onNavigate}
          onOpenDrawer={onToggleMobileDrawer}
          showDrawerTrigger={showMobileDrawerTrigger}
        />
      ) : (
        <HeaderDesktop
          config={config}
          brandName={brandName}
          brandLogo={brandLogo}
          rightSlot={rightSlot}
          navItems={navItems}
          activePath={activePath}
          onNavigate={onNavigate}
          onOpenDrawer={onToggleMobileDrawer}
          showDrawerTrigger={showDesktopDrawerTrigger}
        />
      )}
    </header>
  );
};
