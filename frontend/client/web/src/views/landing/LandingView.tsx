"use client";

import React, { useEffect, useState } from "react";
import { PublicHeader, BottomTabBar, Button, Card, Badge, Footer } from "../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface LandingViewProps {
  onNavigate?: (path: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // IntersectionObserver para animacao Appear to Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".appear-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const showcaseCuts = [
    {
      id: "showcase-1",
      name: "Tomahawk Angus Prime",
      subtitle: "Peça de costela com osso longo exposto, suculência extrema e sabor marcante para a grelha.",
      tag: "CORTE SIGNATURE",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "showcase-2",
      name: "Wagyu A5 Striploin",
      subtitle: "O ápice da carne bovina mundial. Textura que derrete na boca com gordura intramuscular perfeita.",
      tag: "MARMOREIO BMB 10+",
      image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "showcase-3",
      name: "Picanha & Ribeye Cap",
      subtitle: "Capa de gordura uniforme, maciez incomparável e o verdadeiro aroma do churrasco de alta linha.",
      tag: "CHURRASCO MASTER",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const faqItems = [
    {
      q: "Como funciona a entrega refrigerada?",
      a: "Todas as peças são embaladas a vácuo individualmente e acondicionadas em caixas térmicas de alta densidade acompanhadas de placas de gel atóxico ultracongelante que mantêm a temperatura abaixo de -2°C por até 48 horas de transporte."
    },
    {
      q: "Existe fidelidade ou multa de cancelamento?",
      a: "Não! Você tem liberdade total. É possível pausar temporariamente a assinatura quando for viajar, mudar a modalidade dos cortes ou cancelar a qualquer momento em 1 clique sem taxa."
    },
    {
      q: "Como recebo o brinde da Faca Artesanal Prime?",
      a: "Ao concluir a primeira assinatura de qualquer um dos nossos planos, a Faca Artesanal Prime em aço inox com cabo de madeira nobre é enviada automaticamente junto com a sua primeira caixa de cortes."
    }
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
      <style>{`
        .appear-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .appear-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* 1. Header Único e Público da Landing Page */}
      <PublicHeader
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Hero Section Pública */}
      <section
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 32px 80px 32px",
          borderBottom: `1px solid ${tokens.border}`,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isDark ? 0.45 : 0.25,
            zIndex: 0
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "radial-gradient(circle, rgba(11,9,8,0.3) 0%, rgba(11,9,8,0.95) 100%), linear-gradient(to top, #0B0908, transparent)"
              : "radial-gradient(circle, rgba(252,251,247,0.3) 0%, rgba(252,251,247,0.92) 100%), linear-gradient(to top, #FCFBF7, transparent)",
            zIndex: 1
          }}
        />

        <div
          className="appear-on-scroll"
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "960px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: isDark ? "rgba(34, 31, 30, 0.85)" : "rgba(242, 241, 237, 0.85)",
              border: `1px solid ${tokens.copper}`,
              backdropFilter: "blur(12px)"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: tokens.copper,
                boxShadow: `0 0 10px ${tokens.copper}`
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.text }}>
              VAGAS LIMITADAS PARA NOVOS SÓCIOS
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "64px",
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              color: tokens.text,
              margin: 0
            }}
          >
            A Experiência Suprema do Churrasco em sua Casa
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: tokens.textMuted,
              margin: 0,
              maxWidth: "720px"
            }}
          >
            Cortes premium selecionados pelos maiores mestres churrasqueiros, maturados à perfeição e entregues mensalmente com controle absoluto de temperatura. Elevando o fogo a uma arte.
          </p>

          <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}
              style={{
                background: tokens.copper,
                color: "#FFFFFF",
                borderRadius: "9999px",
                padding: "16px 36px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(184, 115, 51, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>Entrar no Portal do Sócio</span>
              ➔
            </button>

            <Button
              variant="outline"
              size="lg"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/cortes") : (window.location.href = "/cortes")}
              style={{ padding: "16px 36px", fontSize: "13px", borderRadius: "9999px" }}
            >
              Conhecer A Seleção
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Seção Diferenciais (#clube) */}
      <section
        id="clube"
        className="appear-on-scroll"
        style={{
          background: tokens.surfaceContainer,
          borderBottom: `1px solid ${tokens.border}`,
          padding: "80px 32px"
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px"
          }}
        >
          <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "32px", borderRadius: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: isDark ? "rgba(184, 115, 51, 0.15)" : "rgba(184, 115, 51, 0.1)",
                  border: `1px solid ${tokens.copper}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.copper} strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                  Cadeia de Frio -2°C
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  Cortes embalados a vácuo em caixas térmicas com gel ultra-resfriante garantindo frescor absoluto até a sua geladeira.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "32px", borderRadius: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: isDark ? "rgba(184, 115, 51, 0.15)" : "rgba(184, 115, 51, 0.1)",
                  border: `1px solid ${tokens.copper}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.copper} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                  Curadoria Angus & Wagyu
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  Seleção exclusiva de carnes com alto grau de marmoreio (BMB 8+), rastreabilidade garantida e maturação controlada.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "32px", borderRadius: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: isDark ? "rgba(184, 115, 51, 0.15)" : "rgba(184, 115, 51, 0.1)",
                  border: `1px solid ${tokens.copper}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.copper} strokeWidth="2">
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
                  Zero Fidelidade
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  Total liberdade. Pause a entrega quando for viajar, troque de plano ou cancele a qualquer momento em 1 clique.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. A Curadoria dos Mestres (#selecao) */}
      <section id="selecao" className="appear-on-scroll" style={{ padding: "80px 32px", maxWidth: "1440px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px auto" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "8px" }}>
            ALTA GASTRONOMIA
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
            A Curadoria dos Mestres
          </h2>
          <p style={{ fontSize: "16px", color: tokens.textMuted, margin: 0 }}>
            Uma prévia dos cortes nobres selecionados mensalmente pelos maiores especialistas em fogo.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {showcaseCuts.map((item) => (
            <Card key={item.id} variant="surface" bordered hoverable isDark={isDark} style={{ borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ position: "relative", height: "260px", overflow: "hidden" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                  <Badge variant="limited">{item.tag}</Badge>
                </div>
              </div>
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  {item.subtitle}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Como Funciona a Assinatura (#como-funciona) */}
      <section
        id="como-funciona"
        className="appear-on-scroll"
        style={{
          background: tokens.surfaceContainer,
          borderTop: `1px solid ${tokens.border}`,
          borderBottom: `1px solid ${tokens.border}`,
          padding: "80px 32px"
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px auto" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "8px" }}>
              PASSO A PASSO
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
              Como Funciona a Assinatura
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                1
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Escolha o seu Perfil
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                Selecione a modalidade de cortes que melhor atende o seu churrasco e rotina gastronômica.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                2
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Box Térmica Exclusiva
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                Receba mensalmente sua caixa refrigerada com selo de garantia de frio e cortes embalados a vácuo.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                3
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                O Fogo e a Mesa
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                Aproveite descontos exclusivos na loja de avulsos, harmonizações de bebidas e brindes artesanais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Escolha a sua Experiência - Tabela de Planos (#assinaturas) */}
      <section id="assinaturas" className="appear-on-scroll" style={{ padding: "80px 32px", maxWidth: "1440px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px auto" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "8px" }}>
            PLANOS EXCLUSIVOS
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
            Escolha a sua Experiência
          </h2>
          <p style={{ fontSize: "16px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
            Alterne o plano ou cancele a qualquer momento sem contrato de fidelidade.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "9999px",
              padding: "4px"
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                background: billingCycle === "monthly" ? tokens.copper : "transparent",
                color: billingCycle === "monthly" ? "#FFFFFF" : tokens.text,
                border: "none",
                borderRadius: "9999px",
                padding: "8px 24px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Cobrança Mensal
            </button>

            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                background: billingCycle === "annual" ? tokens.copper : "transparent",
                color: billingCycle === "annual" ? "#FFFFFF" : tokens.text,
                border: "none",
                borderRadius: "9999px",
                padding: "8px 24px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease"
              }}
            >
              <span>Cobrança Anual</span>
              <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.25)", padding: "2px 6px", borderRadius: "6px" }}>
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Grid de 3 Cards de Assinatura */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "stretch", paddingTop: "20px" }}>
          {/* Plano 1: Essencial */}
          <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "36px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.textMuted }}>
                Cotidiano Prime
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Plano Essencial
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Para quem busca cortes nobres para o dia a dia e refeições especiais.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.text }}>
                  R$ {billingCycle === "annual" ? "151" : "189"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> 3.5kg de cortes nobres selecionados
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Ancho, Chorizo e Fraldinha Angus
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> 15% OFF em todo o e-commerce
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Frete fixo promocional
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Assinar Essencial
            </Button>
          </Card>

          {/* Plano 2: Master Churrasco (MAIS VENDIDO) */}
          <Card
            variant="surface"
            bordered
            hoverable
            isDark={isDark}
            style={{
              padding: "36px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `2px solid ${tokens.copper}`,
              boxShadow: isDark ? "0 12px 36px rgba(184, 115, 51, 0.25)" : "0 12px 36px rgba(184, 115, 51, 0.12)"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                  Churrasco Supremo
                </span>
                <Badge variant="copper">🔥 MAIS VENDIDO</Badge>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Master Churrasco
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Seleção completa para os apaixonados por grelha e encontros de fim de semana.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.copper }}>
                  R$ {billingCycle === "annual" ? "279" : "349"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text, fontWeight: "600" }}>
                  <span style={{ color: tokens.copper }}>✓</span> 6.0kg de cortes nobres para churrasco
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Picanha Steakhouse, Tomahawk & Ribeye
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> 20% OFF na loja de cortes avulsos
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.copper, fontWeight: "700" }}>
                  <span style={{ color: tokens.copper }}>✓</span> FRETE GRÁTIS para todo o Brasil
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text, fontWeight: "600" }}>
                  <span style={{ color: tokens.copper }}>✓</span> Faca Artesanal de presente na 1ª box
                </div>
              </div>
            </div>

            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Assinar Master Churrasco
            </Button>
          </Card>

          {/* Plano 3: Exclusive Wagyu */}
          <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "36px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.textMuted }}>
                Alta Gastronomia
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Exclusive Wagyu
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Cortes raros de altíssimo grau de marmoreio e maturação Dry Aged.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.text }}>
                  R$ {billingCycle === "annual" ? "559" : "699"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> 4.5kg de cortes raros e maturados
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Steak Wagyu A5 BMB 10+ & T-Bone Dry Aged
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> 25% OFF + Sommelier de Carnes dedicado
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Atendimento VIP & Envio Prioritário
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Assinar Exclusive
            </Button>
          </Card>
        </div>
      </section>

      {/* 7. Brinde Exclusivo da Faca Artesanal */}
      <section
        className="appear-on-scroll"
        style={{
          background: tokens.surfaceContainer,
          borderTop: `1px solid ${tokens.border}`,
          borderBottom: `1px solid ${tokens.border}`,
          padding: "80px 32px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Card
            variant="surface"
            bordered
            hoverable={false}
            isDark={isDark}
            style={{
              padding: "48px",
              borderRadius: "24px",
              background: isDark ? "rgba(26, 24, 23, 0.9)" : "rgba(242, 241, 237, 0.9)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <Badge variant="copper">🎁 BRINDE EXCLUSIVO DO SÓCIO</Badge>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Ganhe a Faca Artesanal Prime em Aço Inox
              </h2>
              <p style={{ fontSize: "16px", color: tokens.textMuted, lineHeight: "1.6", margin: 0 }}>
                Ao assinar o clube hoje, receba no seu primeiro mês uma faca profissional de churrasco forjada artesanalmente com cabo de madeira nobre e bainha de couro legítimo.
              </p>
              <div>
                <Button variant="accent" size="lg" onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}>
                  Garantir Meu Brinde
                </Button>
              </div>
            </div>

            <div style={{ height: "280px", borderRadius: "16px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer }}>
              <img
                src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1000&q=80"
                alt="Faca Artesanal de Churrasco"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* 8. FAQ Acordeão (#faq) */}
      <section id="faq" className="appear-on-scroll" style={{ padding: "80px 32px", maxWidth: "960px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "8px" }}>
            TRANSPARÊNCIA TOTAL
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: 0, color: tokens.text }}>
            Perguntas Frequentes
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: tokens.surfaceContainer,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s ease"
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "left",
                    color: tokens.text,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    fontWeight: "600"
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: "20px", color: tokens.copper, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 24px 20px 24px", fontSize: "15px", color: tokens.textMuted, lineHeight: "1.6", borderTop: `1px solid ${tokens.border}`, paddingTop: "16px" }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BottomTabBar Mobile */}
      <BottomTabBar activeTab="hero" onNavigate={onNavigate} isDark={isDark} />

      {/* 10. Footer */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
