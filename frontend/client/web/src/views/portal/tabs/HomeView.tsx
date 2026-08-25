"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Footer, Button, Card, Badge } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface HomeViewProps {
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

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
    { id: "todos", name: "Todos os Cortes", icon: "✨" },
    { id: "bovinos", name: "Bovinos Prime", icon: "🥩" },
    { id: "churrasco", name: "Churrasco Master", icon: "🔥" },
    { id: "wagyu", name: "Wagyu A5 Japão", icon: "💎" },
    { id: "dryaged", name: "Dry Aged 60D", icon: "⏳" },
    { id: "suinos", name: "Suínos Duroc", icon: "🐖" },
    { id: "aves", name: "Aves Especiais", icon: "🐓" },
    { id: "complementos", name: "Complementos & Sais", icon: "🔪" },
    { id: "kits", name: "Kits & Combos", icon: "📦" }
  ];

  // 1. Destaques da Grelha
  const grillHighlights = [
    {
      id: "grill-1",
      name: "Picanha Angus Prime",
      subtitle: "Capa de gordura uniforme, maciez incomparável e marmoreio BMB 6+.",
      portion: "Aprox. 1.2kg • Resfriado",
      originalPrice: "189,90",
      price: "149,90",
      badge: "MAIS VENDIDO",
      badgeType: "offer" as const,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBroJrbE3Sp_7XDMtERJ-9z5OJSYK5EODpyLYKQTGEJssWhruw0wjKU1BlG5cV5iVKdQgisdcIYttpwq9gjy0YzlmOOto7AfHMD_0h1I1TZax7X5pQuGFHOAyHTZTDegKL1LxM1e0Grk0QGR8tq9O9XhvcrGRHLy_JygNYR9tar0wcphLhM3Oh7nafgpxGKQj5rKRJKYRuXmYk-BaQschmaZb604XTKLy6jsv83GszKJUbYW0MIkRJ8"
    },
    {
      id: "grill-2",
      name: "Tomahawk Angus 21D",
      subtitle: "Peça imponente de costela com osso longo exposto para o ritual da grelha.",
      portion: "Aprox. 950g • Resfriado",
      originalPrice: "210,00",
      price: "169,90",
      badge: "SIGNATURE",
      badgeType: "limited" as const,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "grill-3",
      name: "Bife de Chorizo Prime",
      subtitle: "Corte tradicional argentino com capa lateral de gordura e textura macia.",
      portion: "Aprox. 800g • Resfriado",
      originalPrice: "140,00",
      price: "109,90",
      badge: "PROMOÇÃO",
      badgeType: "offer" as const,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "grill-4",
      name: "Fraldinha Red Angus",
      subtitle: "Fibras longas de extrema suculência, ideal para grelhar em fogo forte.",
      portion: "Aprox. 1.0kg • Resfriado",
      originalPrice: "125,00",
      price: "98,90",
      badge: "OFERTA",
      badgeType: "offer" as const,
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 2. Colecao Rara Wagyu A5 Japao
  const wagyuCollection = [
    {
      id: "wagyu-1",
      name: "Wagyu A5 Striploin BMS 11+",
      origin: "Kagoshima, Japão • Certificação de Origem",
      descriptor: "O ápice do marmoreio mundial. Fibras intramuscular extremamente ricas que derretem a 25°C.",
      portion: "Aprox. 350g • Congelado em Aço",
      price: "420,00",
      badge: "BMS 11+ RARO",
      image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "wagyu-2",
      name: "Bife Ancho Wagyu A5 BMS 10+",
      origin: "Miyazaki, Japão • Ouro Mundial",
      descriptor: "Maciez incomparável com sabor amanteigado umami profundo.",
      portion: "Aprox. 400g • Congelado em Aço",
      price: "389,00",
      badge: "MARMOREIO X",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoaEBVAVqn9ij7ZU82DUcs7G-lOtPXsUgGiQX7VwjZ6RsduGy8hyLzeGFHtLGLDbUlaFORnLmZLaPTgjqg8xa29fAyKV36L7Ph_ESBef-v5BnWXGLrnvxYbPPDvxepFsaMgEPuZDz4-7xSuF8VJaErTNa78_nPxANCQsZ3dyuDsDsMZMMqED21eBrkSOZ6Yanv6_y_k11DR9vgAkdDJu_zaJ3lhrs7ljuk290MwqsWH_Rtf8_8Q1WX"
    },
    {
      id: "wagyu-3",
      name: "Ribeye Cap Wagyu (Spinalis)",
      origin: "Miyazaki, Japão • Edição Limitada",
      descriptor: "O 'Filé das Nações'. O corte mais macio e saboroso de todo o boi Wagyu.",
      portion: "Aprox. 300g • Congelado em Aço",
      price: "460,00",
      badge: "LOTE LIMITADO",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 3. Maturacao Especial Dry Aged
  const dryAgedCollection = [
    {
      id: "dry-1",
      name: "Prime Rib Dry Aged 60 Dias",
      process: "Câmara de Sal do Himalaia • 60D",
      descriptor: "Notas amendoadas e de queijo maturado intenso, crosta perfeitamente desenvolvida.",
      portion: "Aprox. 850g • Resfriado",
      price: "249,00",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "dry-2",
      name: "T-Bone Dry Aged 45 Dias",
      process: "Maturação a Frio Controlado • 45D",
      descriptor: "Dupla experiência: Striploin aromático de um lado e Tenderloin macio do outro.",
      portion: "Aprox. 900g • Resfriado",
      price: "229,00",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "dry-3",
      name: "NY Strip Dry Aged 30 Dias",
      process: "Câmara de Vidro • 30D",
      descriptor: "Sabor de carne concentrado, maciez aveludada e aroma característico de nozes.",
      portion: "Aprox. 500g • Resfriado",
      price: "179,00",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 4. Combos & Kits Master
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
        "Flor de Sal de Parrilla"
      ]
    }
  ];

  // 5. Utensílios & Acessórios
  const accessories = [
    {
      name: "Faca Artesanal Prime Aço Inox",
      desc: "Lâmina de 10 polegadas forjada à mão com cabo de madeira nobre e bainha em couro.",
      price: "299,00",
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Tábua Profissional de Madeira Teca",
      desc: "Madeira sustentável de alta densidade com canaleta para sulcos de suco.",
      price: "249,00",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Kit Sal de Parrilla & Chimichurri Gourmet",
      desc: "Sais especiais triturados para parrilla e tempero artesanal patagônico.",
      price: "89,00",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div style={{ width: "100%", background: tokens.background, color: tokens.text, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {/* 1. PortalHeader Logado */}
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

      {/* 2. Conteúdo Mestre da Vitrine Multisseções */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px 80px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "64px",
          boxSizing: "border-box"
        }}
      >
        {/* NÍVEL 1: BANNER HERO OFERTAS DA SEMANA */}
        <section
          style={{
            position: "relative",
            width: "100%",
            height: "420px",
            borderRadius: "24px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 16px 40px rgba(0,0,0,0.08)"
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
                ? "linear-gradient(90deg, rgba(11, 9, 8, 0.95) 0%, rgba(11, 9, 8, 0.65) 55%, transparent 100%)"
                : "linear-gradient(90deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.55) 55%, transparent 100%)",
              zIndex: 1
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "56px",
              maxWidth: "620px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              color: "#FFFFFF"
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper }}>
              OFERTAS DA SEMANA • BOUTIQUE GOURMET
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "52px",
                fontWeight: "700",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
                margin: 0,
                color: "#FFFFFF"
              }}
            >
              Cortes Selecionados com 20% OFF
            </h1>

            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.5 }}>
              Seleção exclusiva de carnes nobres com alto grau de marmoreio, maturação perfeita e entrega refrigerada a -2°C.
            </p>

            <button
              onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
              style={{
                marginTop: "8px",
                background: tokens.copper,
                color: "#FFFFFF",
                border: "none",
                padding: "16px 36px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "9999px",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(184, 115, 51, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              Explorar Vitrine ➔
            </button>
          </div>
        </section>

        {/* NÍVEL 2: FILTRO DE CATEGORIAS (ESTILO CIRCULAR GOURMET A 100% DA LARGURA) */}
        <section style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Navegue por Categoria
            </h3>
            <span style={{ fontSize: "13px", color: tokens.textMuted }}>
              Exibindo <strong>100% dos cortes disponíveis</strong>
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
              gap: "16px",
              width: "100%",
              justifyItems: "center"
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  <div
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      background: isActive ? tokens.copper : tokens.surfaceContainer,
                      border: `2px solid ${isActive ? tokens.copper : tokens.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                      boxShadow: isActive ? "0 6px 20px rgba(184, 115, 51, 0.4)" : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = tokens.copper;
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = tokens.border;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isActive ? "700" : "600",
                      color: isActive ? tokens.copper : tokens.text,
                      textAlign: "center",
                      lineHeight: "1.2"
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* NÍVEL 3: DESTAQUES DA GRELHA (PICANHA, TOMAHAWK, CHORIZO) */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                CHURRASCO SUPREMO
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Destaques da Grelha
              </h3>
            </div>

            <span
              onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
              style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, cursor: "pointer" }}
            >
              Ver todos os cortes ➔
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
            {grillHighlights.map((product) => (
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
                      <Badge variant={product.badgeType}>{product.badge}</Badge>
                    </div>
                  </div>

                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {product.name}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: 1.4, margin: 0 }}>
                      {product.subtitle}
                    </p>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.copper, marginTop: "4px" }}>
                      {product.portion}
                    </span>

                    <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "12px", textDecoration: "line-through", color: tokens.textMuted }}>
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

        {/* NÍVEL 4: COLEÇÃO RARA WAGYU A5 JAPÃO (MARMOREIO BMB 10+) */}
        <section
          style={{
            background: tokens.surfaceContainer,
            border: `1px solid ${tokens.border}`,
            borderRadius: "24px",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "32px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                💎 ALTA GASTRONOMIA MUNDIAL
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Coleção Rara Wagyu A5 Japão
              </h3>
            </div>

            <Badge variant="copper">ORIGEM CERTIFICADA</Badge>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {wagyuCollection.map((w) => (
              <Card
                key={w.id}
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{ borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                    <img src={w.image} alt={w.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <Badge variant="limited">{w.badge}</Badge>
                    </div>
                  </div>

                  <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: tokens.copper, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {w.origin}
                    </span>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {w.name}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: 1.5, margin: 0 }}>
                      {w.descriptor}
                    </p>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.text, marginTop: "4px" }}>
                      {w.portion}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "20px 28px 28px 28px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "24px", fontWeight: "700", color: tokens.copper }}>
                    <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                    {w.price}
                  </span>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                  >
                    Adicionar Wagyu
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* NÍVEL 5: MATURAÇÃO ESPECIAL DRY AGED 60D */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
              ⏳ MATURAÇÃO A FRIO CONTROLADO
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Seleção Dry Aged Especial
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {dryAgedCollection.map((d) => (
              <Card
                key={d.id}
                variant="surface"
                bordered
                hoverable
                isDark={isDark}
                style={{ borderRadius: "18px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                      {d.process}
                    </span>
                    <Badge variant="copper">MATURADO</Badge>
                  </div>

                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    {d.name}
                  </h4>
                  <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: 1.5, margin: 0 }}>
                    {d.descriptor}
                  </p>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.text }}>
                    {d.portion}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: `1px solid ${tokens.border}` }}>
                  <span style={{ fontSize: "24px", fontWeight: "700", color: tokens.text }}>
                    <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                    {d.price}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    isDark={isDark}
                    onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                  >
                    Adicionar Dry Aged
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* NÍVEL 6: COMBOS & KITS MASTER PARA CHURRASCO */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
              📦 EXPERIÊNCIA PRONTA
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

        {/* NÍVEL 7: UTENSÍLIOS & ACESSÓRIOS DE PARRILLA */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
              🔪 ARTE DO FOGO
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Utensílios & Acessórios Gourmet
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
            {accessories.map((acc, i) => (
              <Card key={i} variant="surface" bordered hoverable isDark={isDark} style={{ borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ height: "200px", overflow: "hidden", background: tokens.surfaceContainer }}>
                    <img src={acc.image} alt={acc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {acc.name}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: 1.4, margin: 0 }}>
                      {acc.desc}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "0 24px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                    R$ {acc.price}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    isDark={isDark}
                    onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                  >
                    Adicionar
                  </Button>
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
