"use client";

import React, { useEffect, useState } from "react";
import { FlameIcon, BoxIcon, CartIcon, UserIcon } from "./Icons";

export interface BottomTabBarProps {
  activeTab?: "home" | "hero" | "cortes" | "minha-caixa" | "perfil" | "meu-clube" | "minha-conta";
  onNavigate?: (path: string) => void;
  isDark?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = "hero",
  onNavigate,
  isDark = false
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobileScreen) {
    return null; // NUNCA renderizar em Desktop
  }

  const colors = {
    bg: isDark ? "rgba(17, 14, 12, 0.95)" : "rgba(252, 251, 247, 0.95)",
    border: isDark ? "rgba(209, 209, 209, 0.2)" : "#D1D1D1",
    text: isDark ? "#F5F3EF" : "#1A1A1A",
    textMuted: isDark ? "#A09A92" : "#747878",
    copper: "#B87333"
  };

  const tabs = [
    { key: "hero", label: "Início", path: "/hero", icon: FlameIcon },
    { key: "cortes", label: "Cortes", path: "/cortes", icon: BoxIcon },
    { key: "minha-caixa", label: "Caixa", path: "/minha-caixa", icon: CartIcon },
    { key: "meu-clube", label: "Conta", path: "/minha-conta", icon: UserIcon }
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: colors.bg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 12px 0"
      }}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.key || (activeTab === "home" && tab.key === "hero") || (activeTab === "minha-conta" && tab.key === "meu-clube");
        const iconColor = isActive ? colors.copper : colors.textMuted;
        return (
          <div
            key={tab.key}
            onClick={() => onNavigate ? onNavigate(tab.path) : (window.location.href = tab.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              flex: 1
            }}
          >
            <IconComponent size={20} color={iconColor} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? colors.copper : colors.textMuted
              }}
            >
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
