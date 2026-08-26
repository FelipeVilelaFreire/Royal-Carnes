"use client";

import React from "react";
import { Text } from "../../ui/Text";
import { themeSpacingDefault, themeColorsDefault } from "../../tokens/theme.tokens";
import { clientRoutes } from "../../../client/shared-core/manifests/routes";
import type { HeaderNavItem } from "./Header";

export interface DrawerProps {
  config?: any;
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  brandLogo?: string;
  navItems?: HeaderNavItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  config,
  isOpen,
  onClose,
  brandName = "ROYAL PRIME",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  navItems = [],
  activePath = "/",
  onNavigate
}) => {
  if ((config && config.enabled === false) || !isOpen) return null;

  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const position = config?.position || "right";
  const isRight = position === "right";

  const padding = config?.paddingToken ? (themeSpacingDefault as any)[config.paddingToken] || "24px" : "24px";
  const itemGap = config?.itemGapToken ? (themeSpacingDefault as any)[config.itemGapToken] || "16px" : "16px";

  const getItemPath = (item: HeaderNavItem): string => {
    if (item.routePath) return item.routePath;
    if (item.routeKey && (clientRoutes as any)[item.routeKey]) {
      return (clientRoutes as any)[item.routeKey];
    }
    return "#";
  };

  const handleItemClick = (e: React.MouseEvent, item: HeaderNavItem) => {
    onClose();
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
      return <img src={brandLogo} alt={brandName} style={{ height: "32px", width: "auto", borderRadius: "6px" }} />;
    }
    return <span style={{ fontSize: "24px", color: themeColors.primary }}>{brandLogo || "👑"}</span>;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: isRight ? "flex-end" : "flex-start" }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(4px)"
        }}
      />
      {/* Slide-over Drawer Panel */}
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "100%",
          background: themeColors.surfaceContainer || themeColors.surface,
          borderLeft: isRight ? `1px solid ${themeColors.border}` : "none",
          borderRight: isRight ? "none" : `1px solid ${themeColors.border}`,
          padding: padding,
          display: "flex",
          flexDirection: "column",
          gap: itemGap,
          zIndex: 210,
          boxShadow: isRight ? "-10px 0 30px rgba(0,0,0,0.5)" : "10px 0 30px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {renderBrandLogo()}
            <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: themeColors.primary, margin: 0, fontWeight: "800" }}>
              {brandName}
            </Text>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: themeColors.textMuted,
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px"
            }}
            aria-label="Fechar Drawer"
          >
            ✕
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: itemGap, marginTop: "16px" }}>
          {navItems.map((item) => {
            const targetPath = getItemPath(item);
            const isActive = targetPath !== "#" && activePath === targetPath;
            return (
              <a
                key={item.key}
                href={item.type === "scroll" ? `#${item.targetId}` : targetPath}
                onClick={(e) => handleItemClick(e, item)}
                style={{
                  color: isActive ? themeColors.primary : themeColors.text,
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: isActive ? "rgba(0, 229, 255, 0.12)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.2s ease"
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
