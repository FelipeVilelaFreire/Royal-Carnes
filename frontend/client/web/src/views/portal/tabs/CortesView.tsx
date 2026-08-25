"use client";

import React, { useState } from "react";
import { SearchIcon } from "@foundation/ui/Icon/AppIcons";
import { mockCutCategories, mockCutsCatalog } from "@/mocks/cuts.mock";
import { PortalHeader, BottomTabBar, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { ProductItemCard } from "../components/ProductItemCard";

export interface CortesViewProps {
  isMember?: boolean;
  onNavigate?: (path: string) => void;
}

export const CortesView: React.FC<CortesViewProps> = ({ isMember = true, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

  React.useEffect(() => {
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

  const filteredCuts = mockCutsCatalog.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      {/* 1. Header Único do Portal Logado */}
      <PortalHeader
        activeTab="portal-cortes"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "40px 32px 80px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          boxSizing: "border-box"
        }}
      >
        {/* 2. Header da Página Cortes */}
        <header style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper }}>
            CATÁLOGO COMPLETO ROYAL CARNES
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "48px",
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              margin: 0,
              color: tokens.text
            }}
          >
            Produtos & Seleções Especiais
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "680px",
              color: tokens.textMuted
            }}
          >
            Explore carnes, linguiças, frango, suínos, espetinhos, temperos, carvão, utensílios e combos para churrasco.
          </p>
        </header>

        {/* 3. Navegação Horizontal por Categorias */}
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
              const isActive = activeTab === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveTab(cat.id)}
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

        {/* 4. Catalog Toolbar (Busca & Ordenação) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            background: tokens.surfaceContainer,
            padding: "16px 24px",
            borderRadius: "16px",
            border: `1px solid ${tokens.border}`,
            flexWrap: "wrap"
          }}
        >
          {/* Campo de Busca */}
          <div
            style={{
              position: "relative",
              flex: "1 1 300px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <span style={{ position: "absolute", left: "14px", display: "flex", color: tokens.textMuted }}>
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar por Wagyu, Picanha, Tomahawk, Chorizo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: tokens.background,
                color: tokens.text,
                border: `1px solid ${tokens.border}`,
                borderRadius: "10px",
                padding: "12px 16px 12px 42px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          {/* Seletor de Ordenação */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: tokens.textMuted, fontWeight: "500" }}>
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: tokens.background,
                color: tokens.text,
                border: `1px solid ${tokens.border}`,
                borderRadius: "10px",
                padding: "12px 20px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="relevance">Relevância</option>
              <option value="best_sellers">Mais Vendidos</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Total de Resultados Disponíveis */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: tokens.textMuted }}>
            Exibindo <strong style={{ color: tokens.copper }}>{filteredCuts.length}</strong> produtos disponíveis
          </span>
        </div>

        {/* 5. Product Grid (Exibindo 100% dos 36 Cards Direta e Continuamente) */}
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
              <ProductItemCard
                key={cut.id}
                name={cut.name}
                description={cut.subtitle}
                image={cut.image}
                categoryLabel={cut.line}
                detailLabel={`${cut.weight} | Origem: ${cut.origin}`}
                price={cut.price}
                originalPrice={cut.originalPrice}
                badge={cut.badge}
                badgeTone={cut.badgeType}
                favorite={isFav}
                showPrice={true}
                showAction={false}
                onFavoriteToggle={() => toggleFavorite(cut.id)}
                favoriteAriaLabel="Adicionar aos favoritos"
                removeFavoriteAriaLabel="Remover dos favoritos"
                isDark={isDark}
                tokens={tokens}
              />
            );
          })}
        </div>
      </div>

      {/* 6. BottomTabBar Mobile & Footer */}
      <BottomTabBar activeTab="portal-cortes" onNavigate={onNavigate} isDark={isDark} />
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
