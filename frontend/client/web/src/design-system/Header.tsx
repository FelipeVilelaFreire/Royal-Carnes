"use client";

import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon, ChevronDownIcon } from "./Icons";
import { Button } from "./Button";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface PortalHeaderProps {
  activeTab?: "cortes" | "minha-caixa" | "hero" | "meu-clube" | "minha-conta" | "portal-home" | "portal-cortes" | "portal-minha-caixa" | "portal-minha-conta";
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

  // Apenas Cortes e Royal Box no menu (Início é o logo, Minha Conta é o botão de perfil)
  const navItems = [
    { key: "portal-cortes", label: "Cortes", path: "/portal-cortes" },
    { key: "portal-minha-caixa", label: "Royal Box", path: "/portal-minha-caixa" }
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
          padding: isScrolled ? "10px 40px" : "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
          boxSizing: "border-box"
        }}
      >
        {/* Esquerda: Logo Royal Carnes (Início) + Menu Lateral Esquerdo */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {/* Logo como Botão de Início */}
          <span
            onClick={() => onNavigate ? onNavigate("/portal-home") : (window.location.href = "/portal-home")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isScrolled ? "24px" : "28px",
              fontWeight: "700",
              color: tokens.text,
              cursor: "pointer",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              transition: "font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            Royal Carnes
          </span>

          {/* Links da Navegação Lateral Esquerda */}
          <nav style={{ display: "flex", alignItems: "center", gap: "24px" }} className="hidden md:flex">
            {navItems.map((item) => {
              const isActive = activeTab === item.key ||
                (activeTab === "cortes" && item.key === "portal-cortes") ||
                (activeTab === "minha-caixa" && item.key === "portal-minha-caixa");
              return (
                <span
                  key={item.key}
                  onClick={() => onNavigate ? onNavigate(item.path) : (window.location.href = item.path)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "500",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isActive ? tokens.copper : tokens.textMuted,
                    borderBottom: isActive ? `2px solid ${tokens.copper}` : "2px solid transparent",
                    paddingBottom: "4px",
                    lineHeight: 1,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </nav>
        </div>

        {/* Direita: Dark/Light & Botão de Perfil "Olá, Felipe" com Arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Dark / Light Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            isDark={isDark}
            onClick={toggleTheme}
            style={{ borderRadius: "9999px", padding: isScrolled ? "5px 12px" : "6px 14px" }}
          >
            {isDark ? (
              <>
                <SunIcon size={15} color={tokens.copper} />
                <span>Light</span>
              </>
            ) : (
              <>
                <MoonIcon size={15} color={tokens.copper} />
                <span>Dark</span>
              </>
            )}
          </Button>

          {/* Botão de Perfil com Arrow */}
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate("/portal-minha-conta") : (window.location.href = "/portal-minha-conta")}
            style={{
              background: isDark ? "rgba(34, 31, 30, 0.7)" : "rgba(242, 241, 237, 0.7)",
              border: `1px solid ${tokens.border}`,
              borderRadius: "9999px",
              padding: "6px 16px 6px 8px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "all 0.2s ease",
              boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.04)"
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
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9GX9-wSgnhxVigO2yvOzh-a_61c_vrpYnTl2axgfjJ5HRsI2-DMGw074me7DD73uL0qoFDTU3TfGPWx1GtaW2Ae5dT-b-QYhOhnF6lux4f4QHDmYWMS4QaOo12oFF0T4zHN7ubPcdfOwWhVdZhS_EJpJBG_BZJ6b2XzhUYVQmgsBdMsuz7PjZdupV1Gji0Pr0-p0R1uShZtfS_c_zZrl1vqBZkFFrPqQGIduN0fLricgKByJM7_Va"
              alt="Felipe"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `1px solid ${tokens.copper}`
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}>
              <span style={{ fontSize: "11px", color: tokens.textMuted, fontWeight: "500" }}>
                Olá, Felipe
              </span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>
                Minha Conta
              </span>
            </div>

            <ChevronDownIcon size={14} color={tokens.copper} style={{ marginLeft: "4px" }} />
          </button>
        </div>
      </div>
    </header>
  );
};
