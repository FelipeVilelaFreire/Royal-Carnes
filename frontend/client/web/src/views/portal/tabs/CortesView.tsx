"use client";

import React, { useState } from "react";
import { SearchIcon, SettingsIcon } from "@foundation/ui/Icon/AppIcons";
import { mockCutCategories, mockCutsCatalog, CutProduct } from "@/mocks/cuts.mock";

export interface CortesViewProps {
  isMember?: boolean;
  onNavigate?: (path: string) => void;
}

export const CortesView: React.FC<CortesViewProps> = ({ isMember = true, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px 80px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          boxSizing: "border-box"
        }}
      >
        {/* 1. Header da Página */}
        <header style={{ textAlign: "left" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "52px",
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              margin: "0 0 12px 0"
            }}
          >
            Cortes
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "640px",
              opacity: 0.8
            }}
          >
            Encontre o corte ideal para o seu próximo churrasco.
          </p>
        </header>

        {/* 2. Navegação Horizontal por Categorias */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            borderBottom: "1px solid rgba(209, 209, 209, 0.4)",
            paddingBottom: "8px"
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: "24px",
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
                      background: "transparent",
                      border: "none",
                      borderBottom: isActive ? "2px solid #B87333" : "2px solid transparent",
                      color: isActive ? "#B87333" : "inherit",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: isActive ? "600" : "400",
                      paddingBottom: "8px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
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

        {/* 3. Catalog Toolbar (Busca, Filtros e Ordenação) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            background: "rgba(242, 241, 237, 0.6)",
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(209, 209, 209, 0.5)",
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
            <span style={{ position: "absolute", left: "12px", display: "flex", opacity: 0.6 }}>
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar um corte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "#FCFBF7",
                border: "1px solid #D1D1D1",
                borderRadius: "4px",
                padding: "10px 16px 10px 40px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          {/* Botão de Filtros & Seletor de Ordenação */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#FCFBF7",
                border: "1px solid #D1D1D1",
                borderRadius: "4px",
                padding: "10px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <SettingsIcon size={18} />
              <span>Filtros</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#FCFBF7",
                border: "1px solid #D1D1D1",
                borderRadius: "4px",
                padding: "10px 36px 10px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
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

        {/* 4. Product Grid (Cards dos Cortes) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
            width: "100%"
          }}
        >
          {filteredCuts.map((cut) => {
            const isFav = Boolean(favorites[cut.id]);
            return (
              <article
                key={cut.id}
                style={{
                  position: "relative",
                  background: "#FCFBF7",
                  border: "1px solid #D1D1D1",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Badge (OFERTA ou EDIÇÃO LIMITADA) */}
                {cut.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 10,
                      background: cut.badgeType === "limited" ? "#1A1A1A" : "#B87333",
                      color: "#FCFBF7",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "4px 8px",
                      borderRadius: "2px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase"
                    }}
                  >
                    {cut.badge}
                  </div>
                )}

                {/* Imagem do Corte com Botão Wishlist em SVG */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/5",
                    overflow: "hidden",
                    background: "#F2F1ED"
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
                      background: isFav ? "#B87333" : "#FCFBF7",
                      color: isFav ? "#FCFBF7" : "#1A1A1A",
                      border: "1px solid #D1D1D1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Dados do Corte */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: "600",
                      lineHeight: "1.25",
                      margin: "0 0 4px 0"
                    }}
                  >
                    {cut.name}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      margin: "0 0 8px 0",
                      opacity: 0.7
                    }}
                  >
                    {cut.subtitle}
                  </p>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      marginBottom: "16px",
                      opacity: 0.7
                    }}
                  >
                    {cut.weight}
                  </span>

                  {/* Preço & Botão Adicionar */}
                  <div
                    style={{
                      marginTop: "auto",
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
                            fontSize: "13px",
                            textDecoration: "line-through",
                            opacity: 0.6
                          }}
                        >
                          R$ {cut.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "20px",
                          fontWeight: "600",
                          color: cut.originalPrice ? "#B87333" : "inherit"
                        }}
                      >
                        <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                        {cut.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <button
                      style={{
                        background: "#1A1A1A",
                        color: "#FCFBF7",
                        border: "none",
                        borderRadius: "2px",
                        padding: "10px 16px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background 0.2s ease"
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 5. Botão Carregar Mais Cortes */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid #1A1A1A",
              color: "#1A1A1A",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              padding: "14px 32px",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Carregar mais cortes
          </button>
        </div>
      </div>
    </div>
  );
};
