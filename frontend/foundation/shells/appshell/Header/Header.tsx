import React from "react";
import { Button } from "../../../ui/Button";
import { Text } from "../../../ui/Text";
import { themeSpacingDefault, themeColorsDefault } from "../../../tokens/theme.tokens";

export interface HeaderProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  rightSlot?: React.ReactNode;
  navItems?: Array<{ key: string; label: string; routePath: string }>;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onToggleMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  brandName = "PrimeCutClub",
  brandLogo = "🥩",
  rightSlot,
  navItems = [],
  activePath = "/",
  onNavigate,
  onToggleMobileDrawer
}) => {
  if (config && config.enabled === false) return null;

  const layoutMode = config?.layoutMode || "floating";
  const surfaceStyle = config?.surfaceStyle || "glassBlur";
  const isFloating = layoutMode === "floating";

  const topOffset = config?.floatingTopOffsetToken ? (themeSpacingDefault as any)[config.floatingTopOffsetToken] || "16px" : "16px";
  const paddingX = config?.paddingXToken ? (themeSpacingDefault as any)[config.paddingXToken] || "24px" : "24px";
  const paddingY = config?.paddingYToken ? (themeSpacingDefault as any)[config.paddingYToken] || "12px" : "12px";
  const gapLateral = config?.gapLateralToken ? (themeSpacingDefault as any)[config.gapLateralToken] || "12px" : "12px";
  const navGap = config?.navGapToken ? (themeSpacingDefault as any)[config.navGapToken] || "24px" : "24px";

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: isFloating ? topOffset : "0",
    zIndex: 100,
    width: isFloating ? `calc(100% - (${topOffset} * 2))` : "100%",
    maxWidth: "1280px",
    margin: isFloating ? "0 auto" : "0",
    background: surfaceStyle === "glassBlur" ? "rgba(20, 20, 20, 0.75)" : themeColorsDefault.dark.surface,
    backdropFilter: surfaceStyle === "glassBlur" ? "blur(16px)" : "none",
    border: `1px solid ${themeColorsDefault.dark.border}`,
    borderRadius: isFloating ? "16px" : "0px",
    padding: `${paddingY} ${paddingX}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.3s ease"
  };

  return (
    <header style={headerStyle} data-header-layout={layoutMode}>
      <div style={{ display: "flex", alignItems: "center", gap: gapLateral }}>
        {onToggleMobileDrawer && (
          <button
            onClick={onToggleMobileDrawer}
            style={{
              background: "transparent",
              border: "none",
              color: themeColorsDefault.dark.primary,
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px"
            }}
            aria-label="Abrir Menu"
          >
            ☰
          </button>
        )}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          onClick={() => onNavigate && onNavigate("/")}
        >
          <span style={{ fontSize: "22px" }}>{brandLogo}</span>
          <Text variant="h3" style={{ color: themeColorsDefault.dark.primary, margin: 0, fontWeight: "800" }}>
            {brandName}
          </Text>
        </div>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: navGap }}>
        {navItems.map((item) => {
          const isActive = activePath === item.routePath;
          return (
            <a
              key={item.key}
              href={item.routePath}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(item.routePath);
                }
              }}
              style={{
                color: isActive ? themeColorsDefault.dark.primary : themeColorsDefault.dark.text,
                fontSize: "15px",
                fontWeight: isActive ? "600" : "400",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div>
        {rightSlot || (
          <Button
            style={{ background: themeColorsDefault.dark.primary, color: "#121212", fontWeight: "700" }}
            onClick={() => onNavigate && onNavigate("/planos")}
          >
            Assinar Agora
          </Button>
        )}
      </div>
    </header>
  );
};
