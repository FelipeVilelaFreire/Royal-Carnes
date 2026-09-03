"use client";

import React, { useState } from "react";
import { CartIcon, SunIcon, MoonIcon } from "@foundation/ui/Icon/AppIcons";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface HeaderMobileProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  rightSlot?: React.ReactNode;
  onNavigate?: (path: string) => void;
  onOpenDrawer?: () => void;
  showDrawerTrigger?: boolean;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  config,
  brandName = "Royal Carnes",
  rightSlot,
  onNavigate,
  onOpenDrawer,
  showDrawerTrigger = true
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : (isDarkMode ? themeColorsDefault.dark : themeColorsDefault.light));
  const copperColor = "#B87333";
  const brandRoutePath = config?.brandRoutePath || "/";

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 16px"
      }}
    >
      {/* Brand Logo */}
      <span
        onClick={() => onNavigate && onNavigate(brandRoutePath)}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          fontWeight: "700",
          color: themeColors.text,
          cursor: "pointer",
          letterSpacing: "-0.02em"
        }}
      >
        {brandName}
      </span>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {rightSlot || (
          <>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
              style={{
                background: themeColors.surfaceContainer || "#F2F1ED",
                border: `1px solid ${themeColors.border}`,
                padding: "6px 10px",
                borderRadius: "9999px",
                cursor: "pointer",
                color: themeColors.text,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {isDarkMode ? <SunIcon size={14} color={copperColor} /> : <MoonIcon size={14} color={copperColor} />}
            </button>

            <button
              title="Carrinho"
              style={{
                position: "relative",
                background: "transparent",
                border: "none",
                padding: "6px",
                cursor: "pointer",
                color: themeColors.text,
                display: "flex"
              }}
            >
              <CartIcon size={20} color={themeColors.text} />
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "7px",
                  height: "7px",
                  background: copperColor,
                  borderRadius: "50%"
                }}
              />
            </button>
          </>
        )}

        {showDrawerTrigger && onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            style={{
              background: "transparent",
              border: "none",
              color: themeColors.text,
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px"
            }}
            aria-label="Abrir Menu Mobile"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
};
