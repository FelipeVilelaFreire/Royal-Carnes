"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Card, Input, Badge, Select, Footer } from "../../design-system";
import { mockCutCategories, mockCutsCatalog } from "@/mocks/cuts.mock";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface HeroCortesViewProps {
  onNavigate?: (path: string) => void;
}

export const HeroCortesView: React.FC<HeroCortesViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
  };

  // Filtragem por categoria e busca sobre todo o catálogo de 36 cortes
  const filteredCuts = mockCutsCatalog
    .filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.line.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") {
        return a.price - b.price;
      }
      if (sortBy === "price_desc") {
        return b.price - a.price;
      }
      if (sortBy === "best_sellers") {
        return (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0);
      }
      return 0;
    });

  return (
    <div
      style={{
        background: tokens.background,
        color: tokens.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {/* 1. Header Único Logado */}
      <PortalHeader
        activeTab="portal-cortes"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", next);
            document.documentElement.style.backgroundColor = next === "dark" ? "#0B0908" : "#FCFBF7";
            document.documentElement.style.color = next === "dark" ? "#E8E1DE" : "#1A1A1A";
          }
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Conteúdo Principal "Cortes" */}
      <main
        className="appear-on-scroll"
        style={{
          flex: 1,
          maxWidth: "1560px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px 80px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          boxSizing: "border-box"
        }}
      >
        {/* Cabeçalho da Seção */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper }}>
            CATÁLOGO COMPLETO DE CORTES NOBRES
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: "700", margin: 0, color: tokens.text }}>
            Cortes & Seleções Especiais
          </h1>
          <p style={{ fontSize: "16px", color: tokens.textMuted, margin: 0, maxWidth: "680px" }}>
            Explore o nosso catálogo completo de Wagyu A5 Japão, maturação especial Dry Aged 60D, cortes Prime Angus uruguaios e suínos nobres Duroc.
          </p>
        </div>

        {/* Abas Horizontais de Categorias Pílula */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            borderBottom: `1px solid ${tokens.border}`,
            paddingBottom: "12px"
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: "12px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              minWidth: "max-content"
            }}
          >
            {mockCutCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryChange(cat.id)}
                    style={{
                      background: isActive ? tokens.copper : tokens.surfaceContainer,
                      color: isActive ? "#FFFFFF" : tokens.textMuted,
                      border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                      borderRadius: "9999px",
                      padding: "10px 22px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      fontWeight: isActive ? "700" : "500",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: isActive ? "0 4px 12px rgba(184, 115, 51, 0.3)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Filtros e Busca */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            background: tokens.surfaceContainer,
            padding: "16px 24px",
            borderRadius: "16px",
            border: `1px solid ${tokens.border}`
          }}
        >
          <div style={{ flex: "1 1 300px", maxWidth: "450px" }}>
            <Input
              type="text"
              placeholder="Buscar por Wagyu, Picanha, Tomahawk, Chorizo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              isDark={isDark}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: tokens.textMuted, fontWeight: "500" }}>
              Ordenar por:
            </span>
            <div style={{ minWidth: "180px" }}>
              <Select
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                isDark={isDark}
                options={[
                  { value: "relevance", label: "Relevância" },
                  { value: "best_sellers", label: "Mais Vendidos" },
                  { value: "price_asc", label: "Menor Preço" },
                  { value: "price_desc", label: "Maior Preço" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Total de Resultados Disponíveis */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: tokens.textMuted }}>
            Exibindo <strong style={{ color: tokens.copper }}>{filteredCuts.length}</strong> cortes nobres disponíveis
          </span>
        </div>

        {/* Grid dos Cortes — EXIBINDO 100% DOS CORTES DE FORMA DIRETA E CONTÍNUA (SEM BOTÃO CARREGAR MAIS) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "28px",
            width: "100%"
          }}
        >
          {filteredCuts.map((cut) => {
            const isFav = Boolean(favorites[cut.id]);
            return (
              <Card
                key={cut.id}
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "240px",
                      overflow: "hidden",
                      background: tokens.surfaceContainer
                    }}
                  >
                    <img
                      src={cut.image}
                      alt={cut.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease"
                      }}
                    />

                    {cut.badge && (
                      <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 5 }}>
                        <Badge variant={cut.badgeType || "offer"}>{cut.badge}</Badge>
                      </div>
                    )}

                    <button
                      onClick={() => toggleFavorite(cut.id)}
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isFav ? tokens.copper : tokens.surfaceContainer,
                        color: isFav ? "#FFFFFF" : tokens.text,
                        border: `1px solid ${tokens.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.copper }}>
                      {cut.line}
                    </span>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "22px",
                        fontWeight: "700",
                        lineHeight: "1.25",
                        margin: 0,
                        color: tokens.text
                      }}
                    >
                      {cut.name}
                    </h2>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4", margin: 0 }}>
                      {cut.subtitle}
                    </p>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.text, marginTop: "4px" }}>
                      {cut.weight} • Origem: {cut.origin}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "0 24px 24px 24px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {cut.originalPrice && (
                      <span style={{ fontSize: "13px", textDecoration: "line-through", color: tokens.textMuted }}>
                        R$ {cut.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: tokens.copper
                      }}
                    >
                      <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                      {cut.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* 3. BottomTabBar Mobile Reutilizável */}
      <BottomTabBar activeTab="portal-cortes" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer do Design System */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
