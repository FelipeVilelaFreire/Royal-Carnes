"use client";

import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./Icons";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface PortalHeaderProps {
  activeTab?: "home" | "cortes" | "produtos" | "minha-caixa" | "hero" | "meu-clube" | "minha-conta" | "portal-home" | "portal-cortes" | "portal-minha-caixa" | "portal-minha-conta";
  themeMode?: "light" | "dark";
  onToggleTheme?: () => void;
  onNavigate?: (path: string) => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeTab = "portal-home",
  themeMode: propThemeMode,
  onToggleTheme,
  onNavigate
}) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return propThemeMode || "dark";
  });

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("royal_theme_changed", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextMode);
    localStorage.setItem("royal_prime_theme", nextMode);
    document.documentElement.style.backgroundColor = nextMode === "dark" ? "#0B0908" : "#FCFBF7";
    document.documentElement.style.color = nextMode === "dark" ? "#F5F3EF" : "#1A1A1A";
    window.dispatchEvent(new Event("royal_theme_changed"));
    if (onToggleTheme) onToggleTheme();
  };

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const navItems = [
    { key: "portal-home", label: "Home", path: "/home" },
    { key: "portal-cortes", label: "Catálogo", path: "/cortes" },
    { key: "produtos", label: "Produtos", path: "/produtos" }
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: isDark
          ? isScrolled ? "rgba(11, 9, 8, 0.96)" : "rgba(11, 9, 8, 0.9)"
          : isScrolled ? "rgba(252, 251, 247, 0.96)" : "rgba(252, 251, 247, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${tokens.border}`,
        boxShadow: isScrolled
          ? isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.5)"
            : "0 8px 32px rgba(0, 0, 0, 0.06)"
          : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          padding: isScrolled ? "12px 40px" : "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
          boxSizing: "border-box",
          height: "72px"
        }}
      >
        {/* Esquerda: Logo Royal Carnes + Divisor + Links Perfeitamente Alinhados */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", height: "100%" }}>
          {/* Logo "Royal Carnes" */}
          <span
            onClick={() => onNavigate ? onNavigate("/home") : (window.location.href = "/home")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isScrolled ? "24px" : "26px",
              fontWeight: "700",
              color: tokens.text,
              cursor: "pointer",
              letterSpacing: "-0.02em",
              lineHeight: "1",
              display: "inline-flex",
              alignItems: "center",
              margin: 0,
              padding: 0,
              transition: "font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            Royal Carnes
          </span>

          {/* Divisor Vertical Elegante */}
          <div
            className="hidden md:block"
            style={{
              width: "1px",
              height: "22px",
              background: tokens.border,
              opacity: 0.6
            }}
          />

          {/* Links da Navegação Alinhados com Efeito Pílula */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", height: "100%" }} className="hidden md:flex">
            {navItems.map((item) => {
              const isActive = activeTab === item.key ||
                (activeTab === "home" && item.key === "portal-home") ||
                (activeTab === "cortes" && item.key === "portal-cortes") ||
                (activeTab === "produtos" && item.key === "produtos") ||
                (activeTab === "minha-caixa" && item.key === "portal-minha-caixa");
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate ? onNavigate(item.path) : (window.location.href = item.path)}
                  style={{
                    height: "38px",
                    padding: "0 16px",
                    borderRadius: "9999px",
                    background: isActive ? (isDark ? "rgba(184, 115, 51, 0.15)" : "rgba(184, 115, 51, 0.1)") : "transparent",
                    border: isActive ? `1px solid ${tokens.copper}` : "1px solid transparent",
                    color: isActive ? tokens.copper : tokens.textMuted,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "500",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = tokens.text;
                      e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = tokens.textMuted;
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Direita: Dark/Light & Entrar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "100%" }}>
          {/* Dark / Light Mode Toggle Button (44px) */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              height: "42px",
              padding: "0 18px",
              borderRadius: "9999px",
              background: isDark ? "rgba(34, 31, 30, 0.7)" : "rgba(242, 241, 237, 0.7)",
              border: `1px solid ${tokens.border}`,
              color: tokens.text,
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "all 0.2s ease",
              boxSizing: "border-box"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tokens.copper;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = tokens.border;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isDark ? (
              <>
                <SunIcon size={16} color={tokens.copper} />
                <span>Light</span>
              </>
            ) : (
              <>
                <MoonIcon size={16} color={tokens.copper} />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => undefined}
            style={{
              height: "42px",
              padding: "0 20px",
              borderRadius: "9999px",
              background: tokens.copper,
              border: `1px solid ${tokens.copper}`,
              color: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: "800",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "all 0.2s ease",
              boxSizing: "border-box"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tokens.copper;
              e.currentTarget.style.filter = "brightness(1.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = tokens.copper;
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
};
