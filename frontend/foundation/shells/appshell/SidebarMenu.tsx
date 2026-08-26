"use client";

import React, { useState } from "react";
import { themeColorsDefault } from "../../tokens/theme.tokens";
import {
  FlameIcon,
  StoreIcon,
  TruckIcon,
  UserIcon,
  SettingsIcon,
  StarIcon,
  CartIcon,
  ArrowBackIcon,
  ChevronRightIcon
} from "../../ui/Icon/AppIcons";

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
    if (item.iconName === "store" || item.key === "produtos" || item.key === "cortes") return <StoreIcon size={20} color={color} />;
    if (item.iconName === "user" || item.key === "usuarios" || item.key === "socios") return <UserIcon size={20} color={color} />;
    if (item.iconName === "star" || item.key === "assinaturas" || item.key === "subscribers") return <StarIcon size={20} color={color} />;
    if (item.iconName === "cart" || item.key === "pedidos" || item.key === "orders") return <CartIcon size={20} color={color} />;
    if (item.iconName === "truck" || item.key === "deliveries" || item.key === "caixas") return <TruckIcon size={20} color={color} />;
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
        {/* Topo da Sidebar com Logo */}
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

        {/* Links de Navegação na Sidebar */}
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
                  background: isActive ? "rgba(255, 198, 101, 0.12)" : "transparent",
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

      {/* Rodapé da Sidebar & Botão de Recolher Menu Executivo */}
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
                background: "rgba(255, 198, 101, 0.12)",
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

        {/* Botão Executivo de Recolher Menu */}
        {config?.collapsible !== false && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "rgba(255, 198, 101, 0.05)",
              border: `1px solid ${themeColors.border}`,
              borderRadius: "14px",
              color: themeColors.text,
              padding: "11px 14px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: "10px",
              transition: "all 0.2s ease"
            }}
          >
            {!isCollapsed ? (
              <>
                <ArrowBackIcon size={16} color={themeColors.primary} />
                <span style={{ fontSize: "12px", letterSpacing: "0.5px" }}>Recolher Menu</span>
              </>
            ) : (
              <ChevronRightIcon size={18} color={themeColors.primary} />
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
