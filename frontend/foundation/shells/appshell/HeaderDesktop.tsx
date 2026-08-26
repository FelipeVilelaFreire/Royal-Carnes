"use client";

import React from "react";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";
import { themeSpacingDefault, themeColorsDefault } from "../../tokens/theme.tokens";
import { clientRoutes } from "../../../client/shared-core/manifests/routes";
import { SearchIcon, UserIcon } from "../../ui/Icon/AppIcons";
import type { HeaderNavItem } from "./Header";

export interface HeaderDesktopProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  rightSlot?: React.ReactNode;
  navItems?: HeaderNavItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  onOpenDrawer?: () => void;
  showDrawerTrigger?: boolean;
}

export const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
  config,
  brandName = "ROYAL PRIME",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  rightSlot,
  navItems = [],
  activePath = "/",
  onNavigate,
  onOpenDrawer,
  showDrawerTrigger = false
}) => {
  const isMinimal = Boolean(config?.minimalTopbar);
  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const paddingX = config?.paddingXToken ? (themeSpacingDefault as any)[config.paddingXToken] || "24px" : "24px";
  const paddingY = config?.paddingYToken ? (themeSpacingDefault as any)[config.paddingYToken] || "12px" : "12px";
  const gapLateral = config?.gapLateralToken ? (themeSpacingDefault as any)[config.gapLateralToken] || "12px" : "12px";
  const navGap = config?.navGapToken ? (themeSpacingDefault as any)[config.navGapToken] || "28px" : "28px";
  const navAlignment = config?.navAlignment || "center";
  const brandRoutePath = config?.brandRoutePath || "/";
  const brandKicker = config?.brandKicker;
  const brandSurface = config?.brandSurface === "none" ? "transparent" : themeColors.surfaceContainer || themeColors.surface;
  const brandBorder = config?.brandSurface === "none" ? "transparent" : themeColors.border;

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: navGap,
    marginLeft: navAlignment === "right" ? "auto" : navAlignment === "left" ? "10px" : "0",
    marginRight: navAlignment === "center" ? "auto" : "0"
  };

  const getItemPath = (item: HeaderNavItem): string => {
    if (item.routePath) return item.routePath;
    if (item.routeKey && (clientRoutes as any)[item.routeKey]) {
      return (clientRoutes as any)[item.routeKey];
    }
    return "#";
  };

  const handleItemClick = (e: React.MouseEvent, item: HeaderNavItem) => {
    if (item.type === "scroll" && item.targetId) {
      e.preventDefault();
      const element = document.getElementById(item.targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const targetPath = getItemPath(item);
      if (targetPath && targetPath !== "#") {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(targetPath);
        }
      }
    }
  };

  const renderBrandLogo = () => {
    if (brandLogo && (brandLogo.includes("/") || brandLogo.includes("."))) {
      return <img src={brandLogo} alt={brandName} style={{ height: "34px", width: "34px", borderRadius: "10px", objectFit: "cover" }} />;
    }
    return <span style={{ fontSize: "22px", color: themeColors.primary }}>{brandLogo || "RP"}</span>;
  };

  if (isMinimal) {
    return (
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 32px",
          borderBottom: `1px solid ${themeColors.border}`,
          background: themeColors.surface,
          backdropFilter: "blur(12px)"
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          onClick={() => onNavigate ? onNavigate(brandRoutePath) : (window.location.href = brandRoutePath)}
        >
          {renderBrandLogo()}
          <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: themeColors.text, margin: 0, fontSize: "18px", fontWeight: "800" }}>
            {brandName}
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config?.showSearch !== false && (
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Buscar..."
                style={{
                  background: themeColors.surfaceContainer || themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "20px",
                  padding: "8px 16px 8px 36px",
                  color: themeColors.text,
                  fontSize: "13px",
                  outline: "none",
                  width: "220px"
                }}
              />
              <span style={{ position: "absolute", left: "12px", display: "inline-flex", color: themeColors.textMuted }}>
                <SearchIcon size={14} />
              </span>
            </div>
          )}

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(0, 229, 255, 0.12)",
              border: `1px solid ${themeColors.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => onNavigate && onNavigate("/meu-clube")}
          >
            <UserIcon size={18} color={themeColors.primary} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "100%",
        padding: `${paddingY} ${paddingX}`,
        overflow: "hidden",
        minHeight: "76px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: gapLateral, minWidth: 0 }}>
        {showDrawerTrigger && onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            style={{
              background: "transparent",
              border: "none",
              color: themeColors.primary,
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px"
            }}
            aria-label="Abrir Menu Drawer Desktop"
          >
            ☰
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              padding: "7px 13px 7px 7px",
              borderRadius: "16px",
              border: `1px solid ${brandBorder}`,
              background: brandSurface,
              boxShadow: `0 12px 30px ${themeColors.background}`,
              flexShrink: 0
            }}
            onClick={() => onNavigate ? onNavigate(brandRoutePath) : (window.location.href = brandRoutePath)}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                background: themeColors.primary,
                boxSizing: "border-box"
              }}
            >
              {renderBrandLogo()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
              <Text
                variant="h3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: themeColors.text,
                  margin: 0,
                  fontWeight: "800",
                  letterSpacing: "1px",
                  fontSize: "18px",
                  lineHeight: 1.1
                }}
              >
                {brandName}
              </Text>
              {brandKicker && (
                <span
                  style={{
                    color: themeColors.primary,
                    fontSize: "10px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                    lineHeight: 1
                  }}
                >
                  {brandKicker}
                </span>
              )}
            </div>
          </div>

          <nav style={navStyle}>
            {navItems.filter((item: any) => !item.hideInHeader).map((item) => {
              const targetPath = getItemPath(item);
              const isActive = targetPath !== "#" && activePath === targetPath;
              return (
                <a
                  key={item.key}
                  href={item.type === "scroll" ? `#${item.targetId}` : targetPath}
                  onClick={(e) => handleItemClick(e, item)}
                  style={{
                    color: isActive ? themeColors.primary : themeColors.textMuted,
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    padding: "10px 0",
                    borderBottom: isActive ? `2px solid ${themeColors.primary}` : "2px solid transparent",
                    whiteSpace: "nowrap"
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div>
        {rightSlot || (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Button
              appearance="outline"
              tone="neutral"
              size="sm"
              onClick={() => onNavigate ? onNavigate("/home") : (window.location.href = "/home")}
            >
              Já sou Sócio
            </Button>
            <Button
              appearance="solid"
              tone="primary"
              size="sm"
              onClick={() => {
                const el = document.getElementById("assinaturas");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else if (onNavigate) onNavigate("/#assinaturas");
                else window.location.href = "/#assinaturas";
              }}
            >
              Seja Sócio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
