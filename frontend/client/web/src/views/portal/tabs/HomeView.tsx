"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, Button, Card, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import {
  SparklesIcon,
  BoxIcon,
  TruckIcon,
  CutMeatIcon,
  FlameIcon,
  SpicesIcon,
  KnifeIcon,
  OfferTagIcon,
  CheckIcon
} from "../../../design-system/Icons";

export interface HomeViewProps {
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => window.removeEventListener("royal_theme_changed", handleThemeChange);
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  // Catálogo de cortes no carrossel de destaques
  const carouselCuts = [
    {
      id: "cut-picanha",
      name: "Picanha",
      badge: "PREMIUM",
      category: "bovinos",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFx-cum7Pmdl0jxpfO6ZMNahphCsJmC3bZLEYL9uXQpf9LGLLU86t0vAfI1RLha0XWMfnrtDZM72dZ5LangN0Tqs_4cBku0PmVx--t6ctEAe_4OMC5rheAIW_z4ZoHSb9QpvzQyyZQiLNBAPjdHuBepLTioldf8FddIGrDh-TkgZ78WSti2dYPdIoW_SvtlRwdc_qEFyfo21CXu0UkTJ5q0nIocPYC0LmPwZAn7REBjx2dE78jIFKO"
    },
    {
      id: "cut-contra-file",
      name: "Contra-filé",
      badge: "BASIC",
      category: "bovinos",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmoAKNgINl84lgaDXQQMY10eHWag1vjb9FlAPi7WbPU11YEuzylj3tK9ZOXPHvhCJujlKhWhqdx5iftZFUsl7NqvRIsSOco_9HH67NBzMMmB7QLYtDcyEIg8K_DljhMKMNQlzrIrTc1ezpccnbYj__jcc7dUNM7rvnKyml2bD-Wnab208_JTKL4vKXIXzaG59zoi5MYDzlxJVa0OV3AAaNe7tt5Qa9Yi1P9oqNbdYnTXyFxynl9XE0"
    },
    {
      id: "cut-ancho",
      name: "Ancho",
      badge: "PREMIUM",
      category: "bovinos",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrwo5a5C1yXe4DDO5bHpDaK9E15BAP5AWHNKqG9h5lkOTyp_o26U8-EHuxbSLRaW4_aY5t-AeCvn6vYQIwQQONsC9AA7obU2-8oCI3-8T8pszLFgiHt7_s_h8pwHhwL6HDDGHOX_wTX8p7ycOY1B2qviQpl5mXPWl2mG8nLr5davVq1BTaU5TjIYNCDRGEnEM-JK4WAC4vkeIsPW3owmo97MPjGOE8G5c47vandEwK8A7G6p9axUaz"
    },
    {
      id: "cut-chorizo",
      name: "Chorizo",
      badge: "BASIC",
      category: "bovinos",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAxz-tCXv_JtQ6q-q4ufiZf4v2zEcncyLK-ieaQSQYowGYexHLZFTSh1FJaIYuhMv0Nrz6pljONrw_bkIFA0y5GbSVhQPkgKoeDO6xOxVnTtHpEkhX6KQ6423P95EVub77woM3Bbs3TVcdGeZuQ3USERFQNP-iT2k0WKImAU1bBSTGrgydHvMKCsD5M0sUpfst2LkSR5Tmuqn7CG0MANW4CFSWhcnKIlAFVLp69lPW2SFoWvAs8-od"
    },
    {
      id: "cut-prime-rib",
      name: "Prime Rib",
      badge: "PRO",
      category: "dryaged",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIXtzrw8OeP9W6p5piQtoiLcwb9geitGyrKC_36Y_lf6Ous3RjLPC6YKz8hTYHEpAPKyRPfb4LHvd-nBz4nZAFic_7r8kKBlW-zlWrko0jRKhANzGoKdyfKCmLYRQhs2EeQbdWZqSXc3wP-de-x4oXV-p98PJVqJo6hoYt7lD-ywby4jTiGfK5HQSzqyGnBTyRVXQdFAXOhuZB01CotzQHbLJy96oiEngSafy2WhbU_a3SObDlaRzX"
    },
    {
      id: "cut-dry-aged",
      name: "Dry Aged",
      badge: "PRO",
      category: "dryaged",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHT08F9OZwhl7MZbh8owgEAVc01FGhIuGslLP2FI0SpzSoI15rm634UnIOl6msRlzAZUJefVMS7iplvy3MaN13cKbxRQzq58f-w2iwOrFsfaaVQv9Ioa8VhBwcW0ydwXgeuSMG5auUw2lmirtMzG6UzrHiiDGG4X_wdJYPidraXTrrXnh2xqTPbNV8Vgl66Rug44cWbPascOteTG_tOWqpiRT-hp1wbxvxjaFB4rCEb1RkDpEIFcUW"
    }
  ];

  const filteredCarouselCuts = carouselCuts.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "cortes") return item.category === "bovinos";
    if (selectedCategory === "kits") return item.badge === "PREMIUM" || item.badge === "PRO";
    if (selectedCategory === "promocoes") return item.badge === "BASIC";
    return true;
  });

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: tokens.background,
        color: tokens.text,
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Header Único Logado */}
      <PortalHeader
        activeTab="portal-home"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      <main style={{ flex: 1, width: "100%" }}>
        {/* 2. Compact Hero Section */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "32px",
            boxSizing: "border-box",
            flexWrap: "wrap"
          }}
        >
          <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "48px",
                fontWeight: "700",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
                color: tokens.text
              }}
            >
              O seu churrasco.<br />Do seu jeito.
            </h1>
            <p style={{ fontSize: "18px", lineHeight: "1.5", color: tokens.textMuted, margin: 0 }}>
              Três formas de viver a experiência Royal.
            </p>
          </div>

          <div
            style={{
              flex: "1 1 340px",
              height: "260px",
              borderRadius: "16px",
              overflow: "hidden",
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              position: "relative"
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSUCErJ5al47iG2R7n3TtPJ_W_gCVM_xtZvVHGrfd2mQAfUSHaRfBVZitok3YroHEiv-lz9eVpnGWE3_y0YKshyQYsCx22uQ-BZz4jfXcIn4CKmtwQbdHLCjOFvZacW9lmu_noOUtJD2KLWkCs6lNMEyC2uGdUqgkvx7YlLC8nQq6oZCdiIzvQ3U-sKpX7etMvdvZG99jv8FDouBGDjTmt_hEsynceOkpuY8k8dIJ-uNv96Vx1d3jZ"
              alt="High-quality raw meat cut"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </section>

        {/* 3. PRIMARY SECTION - Escolha sua experiência Royal */}
        <section
          style={{
            background: tokens.surfaceContainer,
            borderTop: `1px solid ${tokens.border}`,
            borderBottom: `1px solid ${tokens.border}`,
            padding: "64px 32px"
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "32px",
                fontWeight: "700",
                textAlign: "center",
                margin: "0 0 40px 0",
                color: tokens.text
              }}
            >
              Escolha sua experiência Royal
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px"
              }}
            >
              {/* Card 1: Assinatura */}
              <Card
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(184, 115, 51, 0.15)",
                    border: `1px solid ${tokens.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px"
                  }}
                >
                  <SparklesIcon size={32} color={tokens.copper} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 12px 0", color: tokens.text }}>
                  ASSINATURA
                </h3>
                <p style={{ fontSize: "16px", fontWeight: "600", color: tokens.textMuted, margin: "0 0 20px 0" }}>
                  Sua seleção Royal todos os meses.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", fontSize: "14px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>Planos: Basic, Premium, Pro</li>
                  <li>A partir de R$ 300/mês</li>
                </ul>
                <div style={{ marginTop: "auto", width: "100%" }}>
                  <Button variant="primary" size="md" isDark={isDark} style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-conta")}>
                    Conhecer assinatura
                  </Button>
                </div>
              </Card>

              {/* Card 2: Royal Box */}
              <Card
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderColor: tokens.copper
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(184, 115, 51, 0.15)",
                    border: `1px solid ${tokens.copper}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px"
                  }}
                >
                  <BoxIcon size={32} color={tokens.copper} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 12px 0", color: tokens.text }}>
                  ROYAL BOX
                </h3>
                <p style={{ fontSize: "16px", fontWeight: "600", color: tokens.textMuted, margin: "0 0 20px 0" }}>
                  Monte sua própria caixa.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", fontSize: "14px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>Carnes, Carvão, Utensílios, Temperos, Preparação</li>
                  <li>Pagamento mensal · Frete grátis</li>
                </ul>
                <div style={{ marginTop: "auto", width: "100%" }}>
                  <Button variant="primary" size="md" isDark={isDark} style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-caixa")}>
                    Montar minha Box
                  </Button>
                </div>
              </Card>

              {/* Card 3: Royal Delivery */}
              <Card
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  padding: "32px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(184, 115, 51, 0.15)",
                    border: `1px solid ${tokens.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px"
                  }}
                >
                  <TruckIcon size={32} color={tokens.copper} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 12px 0", color: tokens.text }}>
                  ROYAL DELIVERY
                </h3>
                <p style={{ fontSize: "16px", fontWeight: "600", color: tokens.textMuted, margin: "0 0 20px 0" }}>
                  Você escolhe. Nós entregamos.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", fontSize: "14px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <li>Compra avulsa · Frete calculated</li>
                </ul>
                <div style={{ marginTop: "auto", width: "100%" }}>
                  <Button variant="primary" size="md" isDark={isDark} style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-caixa")}>
                    Montar pedido
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. SECTION - O que você procura? */}
        <section
          style={{
            width: "100%",
            background: tokens.background,
            borderBottom: `1px solid ${tokens.border}`,
            padding: "36px 0"
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: "0 0 24px 0", color: tokens.text, textAlign: "left" }}>
              O que você procura?
            </h2>

            <div
              style={{
                display: "flex",
                gap: "24px",
                overflowX: "auto",
                paddingBottom: "8px"
              }}
            >
              <button
                onClick={() => setSelectedCategory(selectedCategory === "cortes" ? "all" : "cortes")}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: selectedCategory === "cortes" ? tokens.copper : tokens.surfaceContainer, border: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  <CutMeatIcon size={26} color={selectedCategory === "cortes" ? "#FFFFFF" : tokens.copper} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: selectedCategory === "cortes" ? tokens.copper : tokens.text }}>
                  Cortes
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === "kits" ? "all" : "kits")}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: selectedCategory === "kits" ? tokens.copper : tokens.surfaceContainer, border: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  <FlameIcon size={26} color={selectedCategory === "kits" ? "#FFFFFF" : tokens.copper} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: selectedCategory === "kits" ? tokens.copper : tokens.text }}>
                  Kits & Combos
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === "temperos" ? "all" : "temperos")}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: selectedCategory === "temperos" ? tokens.copper : tokens.surfaceContainer, border: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  <SpicesIcon size={26} color={selectedCategory === "temperos" ? "#FFFFFF" : tokens.copper} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: selectedCategory === "temperos" ? tokens.copper : tokens.text }}>
                  Temperos
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === "utensilios" ? "all" : "utensilios")}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: selectedCategory === "utensilios" ? tokens.copper : tokens.surfaceContainer, border: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  <KnifeIcon size={26} color={selectedCategory === "utensilios" ? "#FFFFFF" : tokens.copper} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: selectedCategory === "utensilios" ? tokens.copper : tokens.text }}>
                  Utensílios
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory(selectedCategory === "promocoes" ? "all" : "promocoes")}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: selectedCategory === "promocoes" ? tokens.copper : tokens.surfaceContainer, border: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  <OfferTagIcon size={26} color={selectedCategory === "promocoes" ? "#FFFFFF" : "#EF4444"} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#EF4444" }}>
                  Promoções
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. SECTION - Cortes em Destaque Carousel */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "48px 32px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Conheça nossos cortes
            </h2>
            <button
              onClick={() => navigateTo("/portal-cortes")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: tokens.copper,
                cursor: "pointer"
              }}
            >
              Ver catálogo completo ➔
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              paddingBottom: "16px",
              scrollSnapType: "x mandatory"
            }}
          >
            {filteredCarouselCuts.map((cut) => (
              <Card
                key={cut.id}
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  minWidth: "220px",
                  padding: "20px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  scrollSnapAlign: "start"
                }}
                onClick={() => navigateTo("/portal-cortes")}
              >
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: tokens.textMuted, background: tokens.surfaceContainer, padding: "4px 10px", borderRadius: "4px", marginBottom: "16px", alignSelf: "flex-start" }}>
                  {cut.badge}
                </span>

                <div style={{ width: "128px", height: "128px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer, marginBottom: "16px", flexShrink: 0 }}>
                  <img src={cut.image} alt={cut.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  {cut.name}
                </h4>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. SECTION - Encontre seu plano */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "32px 32px 80px 32px"
          }}
        >
          <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Encontre seu plano
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px"
            }}
          >
            {/* Basic Plan Card */}
            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                Basic
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 20px 0", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                Para o churrasco do dia a dia.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: tokens.text }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> 4 cortes selecionados
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> Cortes tradicionais
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> Dicas de preparo
                </li>
              </ul>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.text }}>
                  R$ 300 <span style={{ fontSize: "14px", fontWeight: "400", color: tokens.textMuted }}>/mês</span>
                </span>
                <Button variant="outline" size="md" isDark={isDark} style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-conta")}>
                  Selecionar
                </Button>
              </div>
            </Card>

            {/* Premium Plan Card (MAIS POPULAR) */}
            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                border: `2px solid ${tokens.copper}`,
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  padding: "4px 14px",
                  borderRadius: "9999px"
                }}
              >
                MAIS POPULAR
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                Premium
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 20px 0", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                Experiência completa de sabores.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: tokens.text }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> 6 cortes selecionados
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> Cortes especiais (Ancho, Chorizo)
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> 1 tempero artesanal
                </li>
              </ul>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.text }}>
                  R$ 450 <span style={{ fontSize: "14px", fontWeight: "400", color: tokens.textMuted }}>/mês</span>
                </span>
                <Button variant="accent" size="md" style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-conta")}>
                  Selecionar
                </Button>
              </div>
            </Card>

            {/* Pro Plan Card */}
            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                Pro
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 20px 0", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                O verdadeiro mestre churrasqueiro.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: tokens.text }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> 8 cortes premium
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> Cortes dry aged e com osso
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckIcon size={16} color={tokens.copper} /> Temperos e lenhas frutíferas
                </li>
              </ul>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.text }}>
                  R$ 680 <span style={{ fontSize: "14px", fontWeight: "400", color: tokens.textMuted }}>/mês</span>
                </span>
                <Button variant="outline" size="md" isDark={isDark} style={{ width: "100%" }} onClick={() => navigateTo("/portal-minha-conta")}>
                  Selecionar
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer isDark={isDark} onNavigate={onNavigate} />
    </div>
  );
};
