"use client";

import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./Icons";
import { Button } from "./Button";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface PortalHeaderProps {
  activeTab?: "cortes" | "minha-caixa" | "hero";
  themeMode?: "light" | "dark";
  onToggleTheme?: () => void;
  onNavigate?: (path: string) => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeTab = "hero",
  themeMode: propThemeMode,
  onToggleTheme,
  onNavigate
}) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("royal_prime_theme");
    if (stored === "dark" || stored === "light") {
      setThemeMode(stored);
    } else if (propThemeMode) {
      setThemeMode(propThemeMode);
    }

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
  }, [propThemeMode]);

  const toggleTheme = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextMode);
    localStorage.setItem("royal_prime_theme", nextMode);
    window.dispatchEvent(new Event("royal_theme_changed"));
    if (onToggleTheme) onToggleTheme();
  };

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const navItems = [
    { key: "hero", label: "Início", path: "/" },
    { key: "cortes", label: "Cortes", path: "/cortes" },
    { key: "minha-caixa", label: "Royal Box", path: "/minha-caixa" }
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
          padding: isScrolled ? "10px 40px" : "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxSizing: "border-box"
        }}
      >
        {/* Esquerda: Logo Royal Carnes */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
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
        </div>

        {/* Centro: Links de Navegação Centralizados */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)"
          }}
          className="hidden md:flex"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <span
                key={item.key}
                onClick={() => onNavigate ? onNavigate(item.path) : (window.location.href = item.path)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.12em",
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

        {/* Direita: Dark/Light & Perfil */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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

          <div
            onClick={() => onNavigate ? onNavigate("/minha-caixa") : (window.location.href = "/minha-caixa")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer"
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9GX9-wSgnhxVigO2yvOzh-a_61c_vrpYnTl2axgfjJ5HRsI2-DMGw074me7DD73uL0qoFDTU3TfGPWx1GtaW2Ae5dT-b-QYhOhnF6lux4f4QHDmYWMS4QaOo12oFF0T4zHN7ubPcdfOwWhVdZhS_EJpJBG_BZJ6b2XzhUYVQmgsBdMsuz7PjZdupV1Gji0Pr0-p0R1uShZtfS_c_zZrl1vqBZkFFrPqQGIduN0fLricgKByJM7_Va"
              alt="Felipe"
              style={{
                width: isScrolled ? "32px" : "36px",
                height: isScrolled ? "32px" : "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `1px solid ${tokens.border}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "600", color: tokens.text }}>
              Olá, Felipe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
