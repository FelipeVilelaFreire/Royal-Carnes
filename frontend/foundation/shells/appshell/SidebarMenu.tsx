"use client";

import React, { useState } from "react";
import { themeColorsDefault } from "../../tokens/theme.tokens";
import { FlameIcon, StoreIcon, TruckIcon, UserIcon, SettingsIcon } from "../../ui/Icon/AppIcons";

export interface SidebarMenuProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  items: Array<{ key: string; label: string; routePath?: string; icon?: string; iconName?: string }>;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  config,
  brandName = "ROYAL PRIME ADMIN",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  items = [],
  activePath = "/",
  onNavigate
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(Boolean(config?.defaultCollapsed));

  const expandedCols = config?.expandedCols || 3;
  const collapsedCols = config?.collapsedCols || 1;
  const currentCols = isCollapsed ? collapsedCols : expandedCols;
  const sidebarWidthRatio = `${(currentCols / 20) * 100}%`;

  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const renderIcon = (item: any, isActive: boolean) => {
    const color = isActive ? themeColors.primary : themeColors.textMuted;
    if (item.iconName === "flame" || item.key === "dashboard") return <FlameIcon size={20} color={color} />;
    if (item.iconName === "store" || item.key === "cortes") return <StoreIcon size={20} color={color} />;
    if (item.iconName === "truck" || item.key === "caixas") return <TruckIcon size={20} color={color} />;
    if (item.iconName === "user" || item.key === "socios") return <UserIcon size={20} color={color} />;
    if (item.iconName === "settings" || item.key === "configuracoes") return <SettingsIcon size={20} color={color} />;
    return <FlameIcon size={20} color={color} />;
  };

  const renderBrandLogo = () => {
    if (brandLogo && (brandLogo.includes("/") || brandLogo.includes("."))) {
      return <img src={brandLogo} alt={brandName} style={{ height: "32px", width: "auto", borderRadius: "8px", objectFit: "contain" }} />;
    }
    return <FlameIcon size={24} color={themeColors.primary} />;
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        width: sidebarWidthRatio,
        minWidth: isCollapsed ? "72px" : "260px",
        maxWidth: isCollapsed ? "90px" : "320px",
        background: themeColors.surface,
        borderRight: `1px solid ${themeColors.border}`,
        padding: isCollapsed ? "24px 12px" : "28px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
        zIndex: 90,
        flexShrink: 0
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Topo / Header Limpo da Sidebar com Imagem da Logo ROYAL PRIME */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            paddingBottom: "20px",
            borderBottom: `1px solid ${themeColors.border}`,
            gap: "10px"
          }}
        >
          {renderBrandLogo()}
          {!isCollapsed && (
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: themeColors.text,
                fontWeight: "800",
                fontSize: "16px",
                letterSpacing: "1px",
                whiteSpace: "nowrap"
              }}
            >
              {brandName}
            </span>
          )}
        </div>

        {/* Links de Navegacao pelas Colunas */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item) => {
            const isActive = activePath === item.routePath;
            return (
              <a
                key={item.key}
                href={item.routePath}
                onClick={(e) => {
                  if (onNavigate && item.routePath) {
                    e.preventDefault();
                    onNavigate(item.routePath);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                style={{
                  color: isActive ? themeColors.primary : themeColors.textMuted,
                  fontSize: "14px",
                  fontWeight: isActive ? "700" : "500",
                  textDecoration: "none",
                  padding: isCollapsed ? "14px 0" : "14px 18px",
                  borderRadius: "16px",
                  background: isActive ? "rgba(0, 229, 255, 0.12)" : "transparent",
                  border: isActive ? `1px solid ${themeColors.border}` : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  gap: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                {renderIcon(item, isActive)}
                {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Roda-pe da Sidebar: Perfil do Operador Admin & Botao de Collapse */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "20px", borderTop: `1px solid ${themeColors.border}` }}>
        {config?.showUserProfile && config?.userProfile && !isCollapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "16px",
              background: themeColors.surfaceContainer || themeColors.surface,
              border: `1px solid ${themeColors.border}`
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(0, 229, 255, 0.12)",
                border: `1px solid ${themeColors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: themeColors.primary,
                fontWeight: "700",
                fontSize: "14px",
                flexShrink: 0
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{ fontSize: "14px", color: themeColors.text, fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {config.userProfile.name}
              </span>
              <span style={{ fontSize: "11px", color: themeColors.primary, fontWeight: "600" }}>
                {config.userProfile.badge}
              </span>
            </div>
          </div>
        )}

        {/* Botao de Collapse do AppShell Contract */}
        {config?.collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "transparent",
              border: `1px solid ${themeColors.border}`,
              borderRadius: "12px",
              color: themeColors.textMuted,
              padding: "10px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease"
            }}
          >
            {isCollapsed ? "»" : "« Recolher Menu"}
          </button>
        )}
      </div>
    </aside>
  );
};
