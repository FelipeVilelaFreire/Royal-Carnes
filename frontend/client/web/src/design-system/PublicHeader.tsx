"use client";

import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon, FlameIcon } from "./Icons";
import { Button } from "./Button";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface PublicHeaderProps {
  themeMode?: "light" | "dark";
  onToggleTheme?: () => void;
  onNavigate?: (path: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
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

  const publicNavItems = [
    { label: "A Loja", href: "#clube" },
    { label: "Catálogos", href: "#selecao" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Produtos", href: "#assinaturas" },
    { label: "FAQ", href: "#faq" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        width: "100%",
        background: isDark
          ? isScrolled ? "rgba(11, 9, 8, 0.96)" : "rgba(11, 9, 8, 0.85)"
          : isScrolled ? "rgba(252, 251, 247, 0.96)" : "rgba(252, 251, 247, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${tokens.border}`,
        boxShadow: isScrolled
          ? isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.6)"
            : "0 8px 32px rgba(0, 0, 0, 0.08)"
          : "none",
        transition: "all 0.3s ease"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          padding: isScrolled ? "12px 40px" : "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          boxSizing: "border-box"
        }}
      >
        {/* Esquerda: Logo Royal Carnes */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none"
          }}
        >
          <FlameIcon size={26} color={tokens.copper} />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: "700",
              color: tokens.text,
              letterSpacing: "-0.02em",
              lineHeight: 1
            }}
          >
            ROYAL CARNES
          </span>
        </a>

        {/* Centro: Nav Links da Landing Page (Scroll suave por Âncora) */}
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
          {publicNavItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: tokens.textMuted,
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = tokens.copper)}
              onMouseLeave={(e) => (e.currentTarget.style.color = tokens.textMuted)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Direita: Dark/Light Mode, Entrar no Portal & Botão Seja Sócio */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Dark / Light Toggle */}
          <Button
            variant="outline"
            size="sm"
            isDark={isDark}
            onClick={toggleTheme}
            style={{ borderRadius: "9999px", padding: "6px 14px" }}
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

          {/* Entrar no Portal -> Direciona para /home */}
          <button
            onClick={() => onNavigate ? onNavigate("/home") : (window.location.href = "/home")}
            style={{
              background: "transparent",
              border: "none",
              color: tokens.text,
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Entrar no Portal
          </button>

          {/* Seja Sócio CTA */}
          <a
            href="#assinaturas"
            onClick={(e) => handleNavClick(e, "#assinaturas")}
            style={{
              background: tokens.copper,
              color: "#FFFFFF",
              borderRadius: "9999px",
              padding: "10px 22px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(184, 115, 51, 0.35)",
              transition: "transform 0.2s ease"
            }}
          >
            Ver Produtos
          </a>
        </div>
      </div>
    </header>
  );
};
