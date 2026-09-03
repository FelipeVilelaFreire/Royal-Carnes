"use client";

import React, { useEffect, useState } from "react";
import { BoxIcon, FlameIcon, UserIcon, TruckIcon, StoreIcon, SettingsIcon } from "@foundation/ui/Icon/AppIcons";
import { themeSpacingDefault, themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface BottomTabBarProps {
  config?: any;
  items: Array<{ key: string; label: string; icon?: string; iconName?: string; routePath: string }>;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  config,
  items = [],
  activePath = "/",
  onNavigate
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile || (config && config.enabled === false) || !items || items.length === 0) {
    return null;
  }

  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);

  const itemGap = config?.itemGapToken ? (themeSpacingDefault as any)[config.itemGapToken] || "4px" : "4px";

  const renderIcon = (item: BottomTabBarProps["items"][0], isActive: boolean) => {
    const color = isActive ? themeColors.primary : themeColors.textMuted;
    if (item.iconName === "flame") return <FlameIcon size={20} color={color} />;
    if (item.iconName === "box") return <BoxIcon size={20} color={color} />;
    if (item.key === "mySubscription" || item.iconName === "user") return <UserIcon size={20} color={color} />;
    if (item.key === "tracking" || item.iconName === "truck") return <TruckIcon size={20} color={color} />;
    if (item.key === "catalog" || item.iconName === "store") return <StoreIcon size={20} color={color} />;
    if (item.key === "settings" || item.iconName === "settings") return <SettingsIcon size={20} color={color} />;
    return <UserIcon size={20} color={color} />;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: themeColors.surfaceContainer || themeColors.surface,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${themeColors.border}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -10px 25px rgba(0,0,0,0.8)",
        boxSizing: "border-box"
      }}
    >
      {items.map((item) => {
        const isActive = activePath === item.routePath;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate && onNavigate(item.routePath)}
            style={{
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: itemGap,
              color: isActive ? themeColors.primary : themeColors.textMuted,
              cursor: "pointer",
              fontSize: "10px",
              fontWeight: "700",
              minWidth: 0,
              maxWidth: "84px",
              flex: "1 1 0",
              minHeight: "52px",
              padding: "6px 4px",
              borderRadius: "14px",
              boxSizing: "border-box",
              background: isActive ? "rgba(255, 198, 101, 0.1)" : "transparent"
            }}
          >
            {renderIcon(item, isActive)}
            <span
              style={{
                display: "block",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: 1.15,
                maxHeight: "24px"
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
