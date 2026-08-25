"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Footer, Button, Card, Badge } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { SearchIcon, CartIcon, ChevronDownIcon } from "../../../design-system/Icons";

export interface HomeViewProps {
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const categories = [
    { name: "Bovinos", icon: "🥩" },
    { name: "Churrasco", icon: "🔥" },
    { name: "Wagyu", icon: "💎" },
    { name: "Dry Aged", icon: "⏳" },
    { name: "Suínos", icon: "🐖" },
    { name: "Aves", icon: "🐓" },
    { name: "Complementos", icon: "🔪" },
    { name: "Kits", icon: "📦" }
  ];

  const weeklyOffers = [
    {
      id: "offer-1",
      name: "Picanha Angus",
      portion: "Aprox. 1.2kg • Resfriado",
      originalPrice: "189,90",
      price: "149,90",
      badge: "Oferta",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBroJrbE3Sp_7XDMtERJ-9z5OJSYK5EODpyLYKQTGEJssWhruw0wjKU1BlG5cV5iVKdQgisdcIYttpwq9gjy0YzlmOOto7AfHMD_0h1I1TZax7X5pQuGFHOAyHTZTDegKL1LxM1e0Grk0QGR8tq9O9XhvcrGRHLy_JygNYR9tar0wcphLhM3Oh7nafgpxGKQj5rKRJKYRuXmYk-BaQschmaZb604XTKLy6jsv83GszKJUbYW0MIkRJ8"
    },
    {
      id: "offer-2",
      name: "Bife Ancho Wagyu",
      portion: "Aprox. 400g • Congelado",
      originalPrice: "250,00",
      price: "199,90",
      badge: "Oferta",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoaEBVAVqn9ij7ZU82DUcs7G-lOtPXsUgGiQX7VwjZ6RsduGy8hyLzeGFHtLGLDbUlaFORnLmZLaPTgjqg8xa29fAyKV36L7Ph_ESBef-v5BnWXGLrnvxYbPPDvxepFsaMgEPuZDz4-7xSuF8VJaErTNa78_nPxANCQsZ3dyuDsDsMZMMqED21eBrkSOZ6Yanv6_y_k11DR9vgAkdDJu_zaJ3lhrs7ljuk290MwqsWH_Rtf8_8Q1WX"
    },
    {
      id: "offer-3",
      name: "Medalhão de Mignon",
      portion: "Aprox. 500g • Resfriado",
      originalPrice: "110,00",
      price: "89,90",
      badge: "Oferta",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB31NCNxXWJ6l_zG3lmBLOOmT8uP-EN-NnrIy28kaloy6EZVetU2WGOkYZjUeYIdWI0pBY-YXdNvFFbl3gHaZzm2T-vp3WDS0iojfsII1G89EryaYK-AxDrP_zvKpqvTkzFphAPOLxp2LxLA0nvwazXHgTlj6oWFSG3r_UYS7tjbZ5W-Z4-p4zAO56tvJ_dfvwLnGO0lEMuFkjMgXCwcC9yLjIHQGz4aQOwAb1ZQDv42A4-KqmpXLPI"
    },
    {
      id: "offer-4",
      name: "Carré de Cordeiro",
      portion: "Aprox. 800g • Congelado",
      originalPrice: "145,00",
      price: "119,90",
      badge: "Oferta",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIoB6uhSQ_mV9SWgU0p50xpbVwIOEV230_9UaEB9L0Q82pNKakb4GPREMpXOzFdNMp_-4-YiQ0U5QuUOTgKb9oXGsymnsDlldp3qljhPb6SwSM6cHkjDL0NnPM35nTGVXefUhD7H86Y6aWIesrJuc7QG1hl3j-W8g8PV5Lnj3GZBHRELNm_DJVQwGpPqE3gOojpye63rGSdRLB1-MBruc-UYBI-ilp7qHGT-GxWKWTgIBgPyLwv7kz"
    }
  ];

  const comboKits = [
    {
      id: "kit-1",
      title: "KIT CHURRASCO CLÁSSICO",
      subtitle: "Perfeito para 4 a 6 pessoas. A essência do churrasco brasileiro.",
      price: "249,00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8gj2S8eD_rN_YMeXXZDa2mre2zfSFo_y4pLwVWa1Dz1K6jAatYXshF7oiFDvadli4uBy6_aZiHzQ6QWE_1cYKxgGo5HLYtyPO1v0VoSmWvF3-sMjrgW8o_K2qKK9zRIElxG7h80uU8ejGabawWah2IHCtcD81v0kyygTdeiBVV9D4PxOrYysUPYhyh8Bm2vEj7q243qHNKdEyCck34Qe89bUeR9vP4P1VUf9AzhS98tTtgaKy1Xcz",
      items: [
        "1.2kg Picanha Angus",
        "800g Linguiça Artesanal",
        "500g Pão de Alho",
        "Sal Grosso de Parrilla"
      ]
    },
    {
      id: "kit-2",
      title: "KIT CHURRASCO PREMIUM",
      subtitle: "Para os paladares mais exigentes. Cortes nobres e marmoreio intenso.",
      price: "589,00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0go_qBK-11s7dT1qlRdppRuGj2tgJpurABjCyW0W630WINI9nDKqXAX98D_m8_TIpLbOK3UfRdaZaidtj-KNVHkkdTlYBalPOVgYKt8YHabo7HdkdGzRE7V--s38lOZRByj4Tz3seGjNGfU7zVYMq_dpzE3R7sZEsqoNyHjvzEOwxDBmnf1CDEGZzVLiQovfNAJoHO_BcUiRea4KroKgLf1kmNsVNE68C6oUUevXB2xcwJCpF0TuZ",
      items: [
        "1 Tomahawk Duroc",
        "2x Bife Ancho Wagyu",
        "1kg Prime Rib Angus",
        "Flor de Sal"
      ]
    }
  ];

  return (
    <div style={{ width: "100%", background: tokens.background, color: tokens.text, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {/* 1. PortalHeader Logado com Navegação Alinhada */}
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

      {/* 2. Conteúdo Principal da Vitrine Marketplace Home */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px 60px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "56px",
          boxSizing: "border-box"
        }}
      >
        {/* Banner Promocional Hero Gourmet */}
        <section
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.4)" : "0 12px 36px rgba(0,0,0,0.08)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJo7TvJDAbbeLLTMbqRePs0aFEBkCPV2z9helaDKwynbBH5MFvI861Q5xdS7JFrGVx2RpyLcx3HiWs7UbtpaR31_U9i6Ep33QkcKEFs3ecAugbMl25q2L8R66Uxlx2hoSvpeuAy8DUteAWS7YSaPPpjoj2yZ5Sy4CDjYlDtbrHrefuxg5pD-wP-NVnB0Nk4PdMkYDq4RnfeIj25ix7RdWl474HVrJwAMppRVSqjM_TWvy7ouu0K034')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? "linear-gradient(90deg, rgba(11, 9, 8, 0.95) 0%, rgba(11, 9, 8, 0.6) 60%, transparent 100%)"
                : "linear-gradient(90deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.5) 60%, transparent 100%)",
              zIndex: 1
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "48px",
              maxWidth: "580px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              color: "#FFFFFF"
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper }}>
              OFERTAS DA SEMANA
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "48px",
                fontWeight: "700",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
                margin: 0,
                color: "#FFFFFF"
              }}
            >
              Cortes Selecionados com 20% OFF
            </h2>

            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
              Seleção exclusiva de carnes nobres com marbling elevado e entrega refrigerada em até 24 horas.
            </p>

            <button
              onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
              style={{
                marginTop: "12px",
                background: tokens.copper,
                color: "#FFFFFF",
                border: "none",
                padding: "14px 32px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "9999px",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(184, 115, 51, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              Ver Ofertas ➔
            </button>
          </div>
        </section>

        {/* Categorias Rápidas (Carrossel Horizontal com Hover Gourmet) */}
        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "12px",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  minWidth: "90px"
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: tokens.surfaceContainer,
                    border: `1px solid ${tokens.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tokens.copper;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tokens.border;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {cat.icon}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.text }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Seção Ofertas da Semana (Grid de Cards de Produtos) */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                OPORTUNIDADES DO DIA
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Ofertas da Semana
              </h3>
            </div>

            <span
              onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
              style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, cursor: "pointer" }}
            >
              Ver catálogo completo ➔
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
              width: "100%"
            }}
          >
            {weeklyOffers.map((product) => (
              <Card
                key={product.id}
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
                  <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden", background: tokens.surfaceContainer }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                    />
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <Badge variant="offer">{product.badge}</Badge>
                    </div>
                  </div>

                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {product.name}
                    </h4>
                    <span style={{ fontSize: "13px", color: tokens.textMuted }}>
                      {product.portion}
                    </span>

                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "13px", textDecoration: "line-through", color: tokens.textMuted }}>
                        R$ {product.originalPrice}
                      </span>
                      <span style={{ fontSize: "24px", fontWeight: "700", color: tokens.copper }}>
                        <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 24px 24px 24px" }}>
                  <Button
                    variant="primary"
                    size="md"
                    isDark={isDark}
                    style={{ width: "100%" }}
                    onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                  >
                    Adicionar ao Pedido
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Combos Curados (Kits para Churrasco) */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
              SELEÇÃO PRONTA
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Combos Curados
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "32px" }}>
            {comboKits.map((kit) => (
              <Card
                key={kit.id}
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "0"
                }}
              >
                <div style={{ height: "100%", overflow: "hidden", background: tokens.surfaceContainer }}>
                  <img
                    src={kit.image}
                    alt={kit.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                      {kit.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: 1.4, margin: "0 0 16px 0" }}>
                      {kit.subtitle}
                    </p>

                    <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "13px", color: tokens.text, display: "flex", flexDirection: "column", gap: "4px" }}>
                      {kit.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: `1px solid ${tokens.border}` }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.text }}>
                      <span style={{ fontSize: "13px", marginRight: "2px" }}>R$</span>
                      {kit.price}
                    </span>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                    >
                      Adicionar Kit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* 3. BottomTabBar Mobile */}
      <BottomTabBar activeTab="portal-home" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer do Design System */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
