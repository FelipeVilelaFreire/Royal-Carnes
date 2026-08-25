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
      name: "Mais pedidos 2026",
      subtitle: "Picanha, fraldinha, maminha, pão de alho e linguiça toscana em uma vitrine feita para escolher sem complicar.",
      tag: "CATÁLOGO",
      image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "showcase-2",
      name: "Churrasco para família",
      subtitle: "Produtos, acompanhamentos, carvão e utensílios para resolver o churrasco completo em uma compra.",
      tag: "VITRINE",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "showcase-3",
      name: "Linha nobre",
      subtitle: "Picanha, baby beef, ancho, chorizo e cortes especiais para quem quer elevar a experiência.",
      tag: "PREMIUM",
      image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const faqItems = [
    {
      q: "Quais formas de compra existem?",
      a: "A Royal Carnes trabalha com Assinatura fechada, Royal Box recorrente mensal e Royal Delivery avulso. Cada uma resolve um momento diferente do cliente."
    },
    {
      q: "O que e a Royal Box?",
      a: "Royal Box e uma caixa personalizada recorrente. O cliente monta a composicao, escolhe o dia do mes e recebe aquela box mensalmente."
    },
    {
      q: "Qual a diferenca entre Royal Box e Royal Delivery?",
      a: "A Royal Box e mensal e recorrente. O Royal Delivery e avulso, com pedido feito na hora, endereco escolhido e valor de delivery."
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
              ROYAL CARNES EM CASA
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
            Royal Carnes para o churrasco acontecer sem improviso
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
            Escolha entre assinatura fechada, Royal Box mensal personalizada ou Royal Delivery avulso. Produtos, acompanhamentos, carvão e utensílios em uma experiência simples de entender.
          </p>

          <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => onNavigate ? onNavigate("/home") : (window.location.href = "/home")}
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
              <span>Entender como funciona</span>
            </button>

            <Button
              variant="outline"
              size="lg"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/cortes") : (window.location.href = "/cortes")}
              style={{ padding: "16px 36px", fontSize: "13px", borderRadius: "9999px" }}
            >
              Ver catálogo
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
                  Churrasco completo
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  A Royal Carnes organiza cortes, acompanhamentos, carvão e utensílios para facilitar a compra do churrasco inteiro.
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
                  Catálogos fáceis de navegar
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  Vitrines como Mais pedidos, Churrasco para família, Linha nobre e Espetinhos ajudam o cliente a encontrar o que precisa.
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
                  Três jeitos de comprar
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
                  Escolha plano fechado, monte uma Royal Box mensal ou faça um pedido avulso pelo Royal Delivery.
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
            CATÁLOGOS ROYAL
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
            Vitrines para cada tipo de churrasco
          </h2>
          <p style={{ fontSize: "16px", color: tokens.textMuted, margin: 0 }}>
            O catálogo não precisa ser uma lista fria. Ele pode guiar o cliente por momentos de compra, preferências e ocasiões.
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

      {/* 5. Como Funciona (#como-funciona) */}
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
              COMO FUNCIONA
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
              Três formas de comprar na Royal Carnes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", alignItems: "stretch" }}>
            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "20px",
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)",
                  color: "#FFFFFF",
                  border: `1px solid ${tokens.copper}`,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                1
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
                  Plano pronto
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Assinatura fechada
                </h3>
                <p style={{ fontSize: "15px", color: tokens.textMuted, lineHeight: "1.55", margin: 0 }}>
                  Para quem quer uma escolha guiada, com preço fixo e regras simples.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                {["Basic, Premium ou Pro", "Limite de produtos por plano", "Formato de recebimento por produto"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tokens.copper, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="md"
                isDark={isDark}
                onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Conhecer planos
              </Button>
            </Card>

            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "20px",
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                border: `2px solid ${tokens.copper}`,
                boxShadow: isDark ? "0 18px 42px rgba(184, 115, 51, 0.24)" : "0 18px 42px rgba(184, 115, 51, 0.14)"
              }}
            >
              <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                2
              </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
                  Caixa recorrente
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Royal Box
                </h3>
                <p style={{ fontSize: "15px", color: tokens.textMuted, lineHeight: "1.55", margin: 0 }}>
                  Monte sua caixa uma vez e receba todo mês no dia escolhido.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                {["Produtos do catálogo completo", "Carvão e utensílios à escolha", "Dia do mês e endereço mensal"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text, fontWeight: "600" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tokens.copper, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                variant="accent"
                size="md"
                onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Montar minha Box
              </Button>
            </Card>

            <Card
              variant="surface"
              bordered
              hoverable
              isDark={isDark}
              style={{
                padding: "32px",
                borderRadius: "20px",
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)",
                  color: "#FFFFFF",
                  border: `1px solid ${tokens.copper}`,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(184, 115, 51, 0.4)"
                }}
              >
                3
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
                  Pedido avulso
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Royal Delivery
                </h3>
                <p style={{ fontSize: "15px", color: tokens.textMuted, lineHeight: "1.55", margin: 0 }}>
                  Para comprar na hora, sem assinatura e com entrega no endereço escolhido.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                {["Compra única", "Endereço e frete flexíveis", "Pode repetir o último pedido"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tokens.copper, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="md"
                isDark={isDark}
                onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Pedir avulso
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Escolha a sua Experiência - Tabela de Planos (#assinaturas) */}
      <section id="assinaturas" className="appear-on-scroll" style={{ padding: "80px 32px", maxWidth: "1440px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px auto" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "8px" }}>
            PRODUTOS
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: "0 0 12px 0", color: tokens.text }}>
            Escolha como quer receber
          </h2>
          <p style={{ fontSize: "16px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
            Comece por uma assinatura fechada ou avance para montar uma Royal Box mensal ou um Royal Delivery avulso.
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
                ANUAL
              </span>
            </button>
          </div>
        </div>

        {/* Grid de 3 Cards de Assinatura */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "stretch", paddingTop: "20px" }}>
          {/* Plano 1: Basic */}
          <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "36px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.textMuted }}>
                Assinatura fechada
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Basic
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Plano de entrada para escolher quatro produtos de melhor custo-benefício.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.text }}>
                  R$ {billingCycle === "annual" ? "289" : "300"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Escolha 4 produtos
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Produtos do grupo Basic
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Formato por produto: espeto, peca, isca ou fatiado
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Pagamento mensal ou anual
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Ver Basic
            </Button>
          </Card>

          {/* Plano 2: Premium */}
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
                  Mais equilibrado
                </span>
                <Badge variant="copper">MAIS PEDIDO</Badge>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Premium
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Mais escolhas, cortes premium, carvão incluso e temperos selecionados.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.copper }}>
                  R$ {billingCycle === "annual" ? "489" : "500"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text, fontWeight: "600" }}>
                  <span style={{ color: tokens.copper }}>✓</span> Escolha 6 produtos
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Inclui Basic, Picanha e Contra file
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Inclui 2 pacotes de carvao
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.copper, fontWeight: "700" }}>
                  <span style={{ color: tokens.copper }}>✓</span> Escolha ate 2 temperos
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text, fontWeight: "600" }}>
                  <span style={{ color: tokens.copper }}>✓</span> Formato de recebimento por produto
                </div>
              </div>
            </div>

            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Ver Premium
            </Button>
          </Card>

          {/* Plano 3: Pro */}
          <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "36px", borderRadius: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.textMuted }}>
                Linha nobre
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
                Pro
              </h3>
              <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "0 0 24px 0" }}>
                Para quem quer mais variedade, cortes nobres, faca inclusa e maior liberdade de complementos.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: tokens.text }}>
                  R$ {billingCycle === "annual" ? "789" : "800"}
                </span>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>/mês</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Escolha 8 produtos
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Inclui Basic, Premium, Chorizo e linha nobre
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Escolha ate 5 pacotes de carvao
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: tokens.text }}>
                  <span style={{ color: tokens.copper }}>✓</span> Recebe Faca Royal e escolhe ate 4 temperos
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}
              style={{ marginTop: "32px", width: "100%" }}
            >
              Ver Pro
            </Button>
          </Card>
        </div>
      </section>

      {/* 7. Royal Box recorrente */}
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
                <Badge variant="copper">ROYAL BOX</Badge>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Monte uma vez. Receba todo mês.
              </h2>
              <p style={{ fontSize: "16px", color: tokens.textMuted, lineHeight: "1.6", margin: 0 }}>
                A Royal Box e a assinatura personalizada da Royal Carnes. Escolha produtos, cortes, carvão, utensílios, endereço e o dia do mês para receber sempre a mesma caixa.
              </p>
              <div>
                <Button variant="accent" size="lg" onClick={() => onNavigate ? onNavigate("/produtos") : (window.location.href = "/produtos")}>
                  Montar Royal Box
                </Button>
              </div>
            </div>

            <div style={{ height: "280px", borderRadius: "16px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer }}>
              <img
                src="https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1000&q=80"
                alt="Utensilios de preparo para Royal Box"
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
