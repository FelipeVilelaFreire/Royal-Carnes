"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Button, Card, Input, Badge, Select, Footer } from "../../design-system";
import { mockCutCategories, mockCutsCatalog } from "@/mocks/cuts.mock";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface HeroCortesViewProps {
  onNavigate?: (path: string) => void;
}

export const HeroCortesView: React.FC<HeroCortesViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(8);

  useEffect(() => {
    const stored = localStorage.getItem("royal_prime_theme");
    if (stored === "dark" || stored === "light") {
      setThemeMode(stored);
    }
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
    setVisibleCount(8);
  };

  // Filtragem por categoria e busca
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
      // Ordenacao real dinâmica
      if (sortBy === "price_asc") {
        return a.price - b.price;
      }
      if (sortBy === "price_desc") {
        return b.price - a.price;
      }
      if (sortBy === "best_sellers") {
        // Prioriza itens com badge especial
        const scoreA = a.badge ? 2 : 1;
        const scoreB = b.badge ? 2 : 1;
        return scoreB - scoreA;
      }
      // "relevance" (Padrao Curado)
      return 0;
    });

  const visibleCuts = filteredCuts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCuts.length;

  const handleLoadMore = () => {
    setVisibleCount(filteredCuts.length);
  };

  const sortOptions = [
    { value: "relevance", label: "Relevância (Curados)" },
    { value: "best_sellers", label: "Mais Vendidos" },
    { value: "price_asc", label: "Menor Preço" },
    { value: "price_desc", label: "Maior Preço" }
  ];

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
      {/* 1. Header Único e Universal do Design System */}
      <PortalHeader
        activeTab="cortes"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Conteúdo Mestre da Página de Cortes (maxWidth 1440px) */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxSizing: "border-box"
        }}
      >
        {/* Title & Subtitle */}
        <header style={{ textAlign: "left" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
            Catálogo Gourmet 2026
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "48px",
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              margin: "0 0 12px 0",
              color: tokens.text
            }}
          >
            Cortes Nobres & Raros
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "600px",
              color: tokens.textMuted
            }}
          >
            Linhas Wagyu A5, Prime Angus e Maturação Dry Aged 45D/60D. Escolha a experiência perfeita para a sua grelha.
          </p>
        </header>

        {/* Category Navigation (Pills sem Barra de Rolagem) */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              paddingBottom: "8px"
            }}
          >
            {mockCutCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    background: isActive ? tokens.copper : tokens.surfaceContainer,
                    color: isActive ? "#FFFFFF" : tokens.text,
                    border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                    borderRadius: "9999px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "500",
                    padding: "8px 18px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Toolbar com DropdownPicker Gourmet Select */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            background: tokens.surfaceContainer,
            padding: "16px 24px",
            borderRadius: "6px",
            border: `1px solid ${tokens.border}`,
            flexWrap: "wrap"
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <Input
              icon="search"
              rounded={false}
              isDark={isDark}
              placeholder="Buscar por corte, linha ou origem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: tokens.textMuted, fontWeight: "500" }}>
              Ordenar por:
            </span>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              isDark={isDark}
              style={{ minWidth: "200px" }}
            />
          </div>
        </div>

        {/* Product Grid de Cortes Nobres */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "28px",
            width: "100%"
          }}
        >
          {visibleCuts.map((cut) => {
            const isFav = Boolean(favorites[cut.id]);
            return (
              <Card key={cut.id} variant="surface" bordered hoverable isDark={isDark} style={{ position: "relative" }}>
                {cut.badge && (
                  <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10 }}>
                    <Badge variant={cut.badgeType === "limited" ? "limited" : "offer"}>
                      {cut.badge}
                    </Badge>
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/3",
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
                  <button
                    onClick={() => toggleFavorite(cut.id)}
                    title="Adicionar aos Favoritos"
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isFav ? tokens.copper : tokens.surface,
                      color: isFav ? "#FFFFFF" : tokens.text,
                      border: `1px solid ${tokens.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                    {cut.line}
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: "600",
                      lineHeight: "1.25",
                      margin: 0,
                      color: tokens.text
                    }}
                  >
                    {cut.name}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      margin: 0,
                      color: tokens.textMuted,
                      lineHeight: "1.4"
                    }}
                  >
                    {cut.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: tokens.textMuted, margin: "4px 0" }}>
                    <span>Porção: <strong style={{ color: tokens.text }}>{cut.weight}</strong></span>
                    {cut.origin && <span>Origem: <strong style={{ color: tokens.text }}>{cut.origin}</strong></span>}
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "12px",
                      borderTop: `1px solid ${tokens.border}`,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {cut.originalPrice && (
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "12px",
                            textDecoration: "line-through",
                            color: tokens.textMuted
                          }}
                        >
                          R$ {cut.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "20px",
                          fontWeight: "700",
                          color: cut.originalPrice ? tokens.copper : tokens.text
                        }}
                      >
                        <span style={{ fontSize: "13px", marginRight: "2px" }}>R$</span>
                        {cut.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <Button variant="primary" size="sm" isDark={isDark}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <Button variant="outline" size="md" isDark={isDark} onClick={handleLoadMore}>
              Carregar mais cortes
            </Button>
          </div>
        )}
      </main>

      {/* 3. BottomTabBar Mobile Reutilizável */}
      <BottomTabBar activeTab="cortes" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer do Design System (2026) */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
