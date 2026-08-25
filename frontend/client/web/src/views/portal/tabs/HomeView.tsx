"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Footer, Button, Card, Badge } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { SparklesIcon, CutMeatIcon, FlameIcon, DiamondIcon, ClockIcon, PorkIcon, KnifeIcon, BoxIcon, StarIcon } from "../../../design-system/Icons";

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

  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

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

  const categories = [
    { id: "todos", name: "Todos os Cortes", icon: <SparklesIcon size={20} color={selectedCategory === "todos" ? "#FFFFFF" : tokens.copper} /> },
    { id: "bovinos", name: "Bovinos Prime", icon: <CutMeatIcon size={20} color={selectedCategory === "bovinos" ? "#FFFFFF" : tokens.copper} /> },
    { id: "churrasco", name: "Churrasco Master", icon: <FlameIcon size={20} color={selectedCategory === "churrasco" ? "#FFFFFF" : tokens.copper} /> },
    { id: "wagyu", name: "Wagyu A5 Japão", icon: <DiamondIcon size={20} color={selectedCategory === "wagyu" ? "#FFFFFF" : tokens.copper} /> },
    { id: "dryaged", name: "Dry Aged 60D", icon: <ClockIcon size={20} color={selectedCategory === "dryaged" ? "#FFFFFF" : tokens.copper} /> },
    { id: "suinos", name: "Suínos Duroc", icon: <PorkIcon size={20} color={selectedCategory === "suinos" ? "#FFFFFF" : tokens.copper} /> },
    { id: "aves", name: "Aves Especiais", icon: <CutMeatIcon size={20} color={selectedCategory === "aves" ? "#FFFFFF" : tokens.copper} /> },
    { id: "complementos", name: "Complementos & Sais", icon: <KnifeIcon size={20} color={selectedCategory === "complementos" ? "#FFFFFF" : tokens.copper} /> },
    { id: "kits", name: "Kits & Combos", icon: <BoxIcon size={20} color={selectedCategory === "kits" ? "#FFFFFF" : tokens.copper} /> }
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
      category: "bovinos",
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
      category: "churrasco",
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
      category: "bovinos",
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
      category: "churrasco",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 2. Coleção Rara Wagyu A5 Japão
  const wagyuCollection = [
    {
      id: "wagyu-1",
      name: "Wagyu A5 Striploin BMS 11+",
      origin: "Kagoshima, Japão • Certificação de Origem",
      descriptor: "O ápice do marmoreio mundial. Fibras intramuscular extremamente ricas que derretem a 25°C.",
      portion: "Aprox. 350g • Congelado em Aço",
      price: "420,00",
      badge: "BMS 11+ RARO",
      category: "wagyu",
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
      category: "wagyu",
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
      category: "wagyu",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 3. Maturação Especial Dry Aged
  const dryAgedCollection = [
    {
      id: "dry-1",
      name: "Prime Rib Dry Aged 60 Dias",
      process: "Câmara de Sal do Himalaia • 60D",
      descriptor: "Notas amendoadas e de queijo maturado intenso, crosta perfeitamente desenvolvida.",
      portion: "Aprox. 850g • Resfriado",
      price: "249,00",
      category: "dryaged",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "dry-2",
      name: "T-Bone Dry Aged 45 Dias",
      process: "Maturação a Frio Controlado • 45D",
      descriptor: "Dupla experiência: Striploin aromático de um lado e Tenderloin macio do outro.",
      portion: "Aprox. 900g • Resfriado",
      price: "229,00",
      category: "dryaged",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "dry-3",
      name: "NY Strip Dry Aged 30 Dias",
      process: "Câmara de Vidro • 30D",
      descriptor: "Sabor de carne concentrado, maciez aveludada e aroma característico de nozes.",
      portion: "Aprox. 500g • Resfriado",
      price: "179,00",
      category: "dryaged",
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
      category: "kits",
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
      subtitle: "Experiência gourmet para até 8 convidados com cortes nobres.",
      price: "489,00",
      category: "kits",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEyZehgZTv-CyocAVQn0YBZaQ9k5T1yspu9TOTY_a2Ecdie4GqgKNWW_cnd5ZAUuPMshFRWia6eq5Ej3-UQ2L2nImpVVKTr0yfEodgUEJQUsZVZLYiBoQliyrqEezNzVT5XxtmK1ozhqsDd4j-LQyV7RlT1CqQedpMs5qhbesB5PDF1_G10G7rQDZ3U7cedVIHcBedWSA27GA_gQjpXRlZttOTKwJI8hFUgSAUtoBMQmTuk7GfbhUo",
      items: [
        "1.2kg Picanha Prime",
        "950g Tomahawk Angus",
        "800g Bife de Chorizo",
        "Farofa Artesanal Crocante"
      ]
    },
    {
      id: "kit-3",
      title: "SELECTION WAGYU & ANGUS",
      subtitle: "Para verdadeiros apreciadores. O encontro das duas raças mais nobres do mundo.",
      price: "875,00",
      category: "kits",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTWZZGOFHbj0Sh572RQ-2vs3emWIEGZWsTB1lYtPYcSjPGcOa9mDPiwX1GCl8gPBNEHqbv95kZnUF7gTwJASw-4aHOZWp1IUKwwTioZC70OM608r9UjPQKMk5Jw4B1qibJodt1tlgo4WyBhdw3iIDeBFHpi2CQBi4BqAaFV2b7RZGuMUPGAkZOHP76xP0TR6KM5dqPFvrumlSXF85A9N100tBX7rkGd__CupxrUAHLYbt5YnwVk0e-",
      items: [
        "350g Wagyu A5 Striploin",
        "1.2kg Picanha Angus",
        "950g Tomahawk Dry Aged",
        "Brinde Faca Artesanal"
      ]
    }
  ];

  // 5. Utensílios Gourmet
  const utensils = [
    {
      name: "Faca Artesanal Mestre Assador 10\"",
      desc: "Aço damasco 67 camadas com cabo em madeira nobre e bainha em couro bovino.",
      price: "389,00",
      category: "complementos",
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Tábua Profissional de Madeira Teca",
      desc: "Madeira sustentável de alta densidade com canaleta para sulcos de suco de carne.",
      price: "249,00",
      category: "complementos",
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Kit Sal de Parrilla & Chimichurri Gourmet",
      desc: "Sais especiais triturados para parrilla e tempero artesanal patagônico.",
      price: "89,00",
      category: "complementos",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 6. Harmonização de Vinhos
  const wines = [
    {
      name: "Cabernet Sauvignon Reserva Royal 2020",
      vintage: "Vale do Maipo, Chile • 750ml",
      desc: "Taninos firmes e notas de frutas negras. A harmonização perfeita com Wagyu A5 e Tomahawk.",
      price: "189,00",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Malbec Mendoza Gran Reserva 2019",
      vintage: "Mendoza, Argentina • 750ml",
      desc: "Encorpado com aromas de ameixa e carvalho. Ideal para acompanhar Picanha e Bife de Chorizo.",
      price: "210,00",
      image: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Syrah Patagônico Mestre Assador 2021",
      vintage: "Patagônia, Argentina • 750ml",
      desc: "Especiarias marcantes com toque defumado. Combinação impecável com cordeiro e suínos Duroc.",
      price: "165,00",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // 7. Depoimentos dos Sócios
  const testimonials = [
    {
      name: "Dr. Marcelo Arantes",
      role: "Sócio VIP desde 2024",
      comment: "A carne chega rigorosamente gelada a -2°C, com um marbling inacreditável. O Wagyu A5 é a melhor experiência gastronômica da minha casa.",
      rating: 5
    },
    {
      name: "Eduardo & Camile Fonseca",
      role: "Plano Mensal Master",
      comment: "O Kit Churrasco Premium transformou nossos fins de semana. O Tomahawk com a tábua de teca é um show à parte para os convidados.",
      rating: 5
    },
    {
      name: "Rodrigo Mendonça",
      role: "Assinante Royal Delivery",
      comment: "Praticidade de escolher os cortes no portal e receber em embalagem térmica no dia seguinte. Atendimento e curadoria impecáveis.",
      rating: 5
    }
  ];

  // Todos os produtos consolidados para filtragem em tempo real
  const allConsolidatedProducts = [
    ...grillHighlights.map((p) => ({ ...p, desc: p.subtitle })),
    ...wagyuCollection.map((p) => ({ ...p, desc: p.descriptor })),
    ...dryAgedCollection.map((p) => ({ ...p, desc: p.descriptor })),
    ...comboKits.map((p) => ({ ...p, name: p.title, desc: p.subtitle })),
    ...utensils.map((p) => ({ ...p, id: p.name, desc: p.desc }))
  ];

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const filteredProductsList = allConsolidatedProducts.filter(
    (p) => selectedCategory === "todos" || p.category === selectedCategory
  );

  return (
    <div style={{ width: "100%", background: tokens.background, color: tokens.text, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {/* 1. PortalHeader Logado */}
      <PortalHeader
        activeTab="portal-home"
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
              background: "linear-gradient(90deg, rgba(11,9,8,0.95) 0%, rgba(11,9,8,0.6) 50%, rgba(11,9,8,0.1) 100%)",
              zIndex: 1
            }}
          />

          <div style={{ position: "relative", zIndex: 2, padding: "48px", maxWidth: "650px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Badge variant="copper">OFERTAS DA SEMANA • 20% OFF</Badge>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                VÁLIDO ATÉ DOMINGO
              </span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "44px", fontWeight: "700", color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>
              Experiência de Boutique com Preço de Sócio
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

        {/* NÍVEL 2: FILTRO DE CATEGORIAS (ESTILO CIRCULAR GOURMET COM ÍCONES SVG & FILTRAGEM REAL) */}
        <section style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Navegue por Categoria
            </h3>
            <span style={{ fontSize: "13px", color: tokens.textMuted }}>
              Exibindo <strong>{selectedCategory === "todos" ? "100% dos cortes disponíveis" : `${filteredProductsList.length} cortes nesta categoria`}</strong>
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
                    transition: "transform 0.2s ease"
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: isActive
                        ? tokens.copper
                        : isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                      border: `2px solid ${isActive ? tokens.copper : tokens.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isActive ? "0 6px 20px rgba(184, 115, 51, 0.4)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: isActive ? "700" : "500",
                      color: isActive ? tokens.copper : tokens.text,
                      textAlign: "center"
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* NÍVEL FILTRADO: SE O USUÁRIO SELECIONOU UMA CATEGORIA ESPECÍFICA */}
        {selectedCategory !== "todos" && (
          <section
            style={{
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "20px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: "28px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                  RESULTADO DA BUSCA DE CORTE
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  {activeCategoryObj?.name}
                </h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                isDark={isDark}
                onClick={() => setSelectedCategory("todos")}
              >
                Limpar Filtro (Ver todos os cortes) ➔
              </Button>
            </div>

            {filteredProductsList.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: tokens.textMuted, fontSize: "15px" }}>
                Nenhum corte encontrado para esta categoria no momento.<br />Tente navegar por outras categorias ou explore a vitrine completa.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {filteredProductsList.map((product, idx) => (
                  <Card key={product.id || idx} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ width: "100%", height: "180px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer }}>
                      <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>{product.name}</h4>
                      <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0, lineHeight: "1.4" }}>{product.desc}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "14px", borderTop: `1px solid ${tokens.border}` }}>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: tokens.copper }}>R$ {product.price}</span>
                      <Button variant="accent" size="sm" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                        Adicionar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* NÍVEL 3: DESTAQUES DA GRELHA (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                  SELEÇÃO MESTRE ASSADOR
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Destaques da Grelha
                </h3>
              </div>
              <span
                onClick={() => onNavigate ? onNavigate("/portal-cortes") : (window.location.href = "/portal-cortes")}
                style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, cursor: "pointer" }}
              >
                Ver todos os 36 cortes ➔
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {grillHighlights.map((item) => (
                <Card
                  key={item.id}
                  variant="surface"
                  bordered
                  hoverable
                  isDark={isDark}
                  style={{
                    padding: "24px",
                    borderRadius: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <Badge variant="copper">{item.badge}</Badge>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.copper, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {item.portion}
                    </span>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: "4px 0 0 0", lineHeight: "1.4" }}>
                      {item.subtitle}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "12px", textDecoration: "line-through", color: tokens.textMuted }}>
                        R$ {item.originalPrice}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                        R$ {item.price}
                      </span>
                    </div>

                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                    >
                      Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 4: COLEÇÃO WAGYU A5 JAPÃO (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section
            style={{
              background: isDark ? "linear-gradient(180deg, rgba(184, 115, 51, 0.12) 0%, rgba(11, 9, 8, 0) 100%)" : "linear-gradient(180deg, rgba(184, 115, 51, 0.08) 0%, rgba(252, 251, 247, 0) 100%)",
              border: `1px solid ${tokens.copper}`,
              borderRadius: "24px",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "28px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                  EDIÇÃO LIMITADA JAPÃO 👑
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Coleção Rara Wagyu A5 Japão
                </h3>
              </div>
              <span style={{ fontSize: "14px", color: tokens.textMuted }}>
                Importação direta com certificado de autenticidade individual.
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {wagyuCollection.map((w) => (
                <Card key={w.id} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <img src={w.image} alt={w.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <Badge variant="copper">{w.badge}</Badge>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {w.name}
                    </h4>
                    <span style={{ fontSize: "12px", color: tokens.copper, fontWeight: "600" }}>
                      {w.origin}
                    </span>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: "4px 0 0 0", lineHeight: "1.4" }}>
                      {w.descriptor}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                      R$ {w.price}
                    </span>
                    <Button variant="accent" size="sm" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Adicionar à Caixa
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 5: DRY AGED 60 DIAS (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                MATURAÇÃO A SECO CONTROLADA
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Coleção Dry Aged Reserva
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {dryAgedCollection.map((d) => (
                <Card key={d.id} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {d.name}
                    </h4>
                    <span style={{ fontSize: "12px", color: tokens.copper, fontWeight: "600" }}>
                      {d.process}
                    </span>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: "4px 0 0 0", lineHeight: "1.4" }}>
                      {d.descriptor}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                      R$ {d.price}
                    </span>
                    <Button variant="accent" size="sm" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 6: COMBOS & KITS MASTER (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                SELEÇÃO PRONTA PARA O EVENTO
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Kits & Combos Curados pelos Mestres
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              {comboKits.map((k) => (
                <Card key={k.id} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <img src={k.image} alt={k.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                      {k.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0, lineHeight: "1.4" }}>
                      {k.subtitle}
                    </p>
                  </div>

                  <div style={{ background: tokens.surfaceContainer, borderRadius: "12px", padding: "14px", border: `1px solid ${tokens.border}` }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.copper, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      ITENS INCLUSOS NESTE KIT:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: tokens.text, display: "flex", flexDirection: "column", gap: "4px" }}>
                      {k.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700", color: tokens.copper }}>
                      R$ {k.price}
                    </span>
                    <Button variant="accent" size="md" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Garantir Kit ➔
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 7: UTENSÍLIOS GOURMET (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                EQUIPAMENTOS DE ALTA PERFORMANCE
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Utensílios & Acessórios Premium
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {utensils.map((u, idx) => (
                <Card key={idx} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <img src={u.image} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {u.name}
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0, lineHeight: "1.4" }}>
                      {u.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                      R$ {u.price}
                    </span>
                    <Button variant="accent" size="sm" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 8: HARMONIZAÇÃO DE VINHOS SOMMELIER (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section
            style={{
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "24px",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "28px"
            }}
          >
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                ADEGA SOMMELIER ROYAL
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Harmonização com Rótulos Selecionados
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {wines.map((w, idx) => (
                <Card key={idx} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ width: "100%", height: "220px", borderRadius: "14px", overflow: "hidden", background: tokens.background, border: `1px solid ${tokens.border}` }}>
                    <img src={w.image} alt={w.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {w.name}
                    </h4>
                    <span style={{ fontSize: "12px", color: tokens.copper, fontWeight: "600" }}>
                      {w.vintage}
                    </span>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0, lineHeight: "1.4" }}>
                      {w.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: tokens.copper }}>
                      R$ {w.price}
                    </span>
                    <Button variant="accent" size="sm" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Adicionar Garrafa
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* NÍVEL 9: SERVIÇO CONCIERGE MESTRE ASSADOR VIP (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section
            style={{
              background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.05)",
              border: `1px solid ${tokens.copper}`,
              borderRadius: "24px",
              padding: "48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "32px"
            }}
          >
            <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Badge variant="copper">SERVIÇO EXCLUSIVO VIP</Badge>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Precisa de um Mestre Assador no seu Evento?
              </h3>
              <p style={{ fontSize: "15px", color: tokens.textMuted, margin: 0, lineHeight: 1.6 }}>
                Contrate um chefe de grelha credenciado Royal Carnes para comandar a parrilla na sua casa, eventos corporativos ou comemorações familiares.
              </p>
            </div>

            <Button
              variant="accent"
              size="md"
              style={{ padding: "18px 36px", fontSize: "13px" }}
              onClick={() => alert("Solicitação de Concierge enviada! Nosso mestre assador entrará em contato via WhatsApp.")}
            >
              Agendar Mestre Assador ➔
            </Button>
          </section>
        )}

        {/* NÍVEL 10: DEPOIMENTOS DOS SÓCIOS CLUB ROYAL (SE CATEGORIA = TODOS) */}
        {selectedCategory === "todos" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                AVALIAÇÕES DE QUEM COMPRA
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                O que dizem nossos Sócios VIP
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {testimonials.map((t, idx) => (
                <Card key={idx} variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} size={18} color={tokens.copper} />
                    ))}
                  </div>

                  <p style={{ fontSize: "14px", color: tokens.text, fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                    "{t.comment}"
                  </p>

                  <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: `1px solid ${tokens.border}` }}>
                    <h5 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      {t.name}
                    </h5>
                    <span style={{ fontSize: "12px", color: tokens.copper }}>
                      {t.role}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 3. BottomTabBar Mobile */}
      <BottomTabBar activeTab="portal-home" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
