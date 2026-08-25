"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Button, Card, Badge, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface MinhaCaixaViewProps {
  onNavigate?: (path: string) => void;
}

export const MinhaCaixaView: React.FC<MinhaCaixaViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [boxMode, setBoxMode] = useState<"assinatura" | "avulso">("assinatura");

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
        activeTab="minha-caixa"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Main Content Mestre da Página Royal Delivery */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          boxSizing: "border-box"
        }}
      >
        {/* Page Header */}
        <section style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "56px",
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              margin: "0 0 12px 0",
              color: tokens.text
            }}
          >
            Royal Delivery
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: "1.6",
              margin: "0 auto 28px auto",
              maxWidth: "600px",
              color: tokens.textMuted
            }}
          >
            Tudo sobre o seu Royal Delivery, em um só lugar.
          </p>

          {/* Seletor de Modalidade da Royal Box: ASSINATURA vs AVULSO */}
          <div
            style={{
              display: "inline-flex",
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "9999px",
              padding: "4px"
            }}
          >
            <button
              onClick={() => setBoxMode("assinatura")}
              style={{
                background: boxMode === "assinatura" ? tokens.copper : "transparent",
                color: boxMode === "assinatura" ? "#FFFFFF" : tokens.text,
                border: "none",
                borderRadius: "9999px",
                padding: "10px 28px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Assinatura Mensal
            </button>

            <button
              onClick={() => setBoxMode("avulso")}
              style={{
                background: boxMode === "avulso" ? tokens.copper : "transparent",
                color: boxMode === "avulso" ? "#FFFFFF" : tokens.text,
                border: "none",
                borderRadius: "9999px",
                padding: "10px 28px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Caixa Avulsa (Monte a sua)
            </button>
          </div>
        </section>

        {/* MODALIDADE ASSINATURA */}
        {boxMode === "assinatura" && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "32px",
              width: "100%",
              alignItems: "flex-start"
            }}
          >
            {/* Left Column: Content (8 cols / 64% width) */}
            <div
              style={{
                flex: "1 1 64%",
                minWidth: "320px",
                display: "flex",
                flexDirection: "column",
                gap: "40px"
              }}
            >
              {/* Section 01 - Current Royal Delivery */}
              <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ overflow: "hidden", borderRadius: "8px" }}>
                <div style={{ position: "relative", height: "260px", background: tokens.surfaceContainer, overflow: "hidden" }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClZNZiTlsTQl9mhYlCtEwbjdxcq80wC6JW9G2TKsW3LGQvgPwf4xoGpyd9J9phgMq_c92L-xwG21pM6BYXP8BpnRRMM5jKpTmTI6Nvtd4zLcXovrVII_bYx1KX1UxYNTVWNJ7b5Wu4Z7Ti0uFuIEe5N6mRnSa_QkIkFPdsLDSFQJmdvrSgr6AkZkSrYvaa17HHwpmmqLLrNnjH46Hgz1psAu5sI6Ia1rSHzs3t0sBfXEktHzFjb6NH"
                    alt="Royal Delivery"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "8px" }}>
                    <Badge variant="limited">STATUS: ATIVA</Badge>
                    <Badge variant="offer">MENSAL</Badge>
                  </div>
                </div>

                <div style={{ padding: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "24px", borderBottom: `1px solid ${tokens.border}`, marginBottom: "28px" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "600", margin: "0 0 6px 0", color: tokens.text }}>
                        Seu Próximo Royal Delivery
                      </h2>
                      <p style={{ fontSize: "15px", color: tokens.textMuted, margin: 0 }}>
                        Entrega prevista para: <strong style={{ color: tokens.text, fontWeight: "600" }}>12 de setembro</strong>
                      </p>
                    </div>
                  </div>

                  {/* Refined Delivery Timeline */}
                  <div style={{ position: "relative", paddingTop: "16px" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "28px",
                        left: "5%",
                        right: "5%",
                        height: "2px",
                        background: tokens.border,
                        zIndex: 0
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "28px",
                        left: "5%",
                        width: "22%",
                        height: "2px",
                        background: tokens.copper,
                        zIndex: 0
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: tokens.text,
                            color: tokens.background,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `2px solid ${tokens.text}`
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: tokens.text, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Pedido<br />confirmado
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: tokens.surface,
                            border: `2px solid ${tokens.copper}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: tokens.copper }} />
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.copper, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Preparando<br />sua caixa
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.surface, border: `2px solid ${tokens.border}` }} />
                        <span style={{ fontSize: "11px", color: tokens.textMuted, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Embalagem
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.surface, border: `2px solid ${tokens.border}` }} />
                        <span style={{ fontSize: "11px", color: tokens.textMuted, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Em<br />trânsito
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: tokens.surface, border: `2px solid ${tokens.border}` }} />
                        <span style={{ fontSize: "11px", color: tokens.textMuted, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Entregue
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Section 02 - What is inside my box */}
              <section>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "600", margin: "0 0 20px 0", color: tokens.text, borderBottom: `1px solid ${tokens.border}`, paddingBottom: "8px" }}>
                  O que vem na sua caixa
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Card variant="surface" bordered hoverable isDark={isDark} style={{ display: "flex", flexDirection: "row", overflow: "hidden", borderRadius: "6px" }}>
                    <div style={{ width: "128px", height: "128px", background: tokens.surfaceContainer, flexShrink: 0 }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLaFk-ly1lLnlfLBrW0FsRcM8lq8U3OMYHXDdM6pWUcR4EREfaaXZyHBRdGb2JCLQAkiO8vM-9a32nAeHBlt93FQaMDExd40x8bfttKz25k07nGefXQVMPzgN0YVquPn4IizBnos-J-sc6csza5fKxXof7qETV8J-6QOlgT93gRVFWfzNK1yV9xcvQgNqJZick7GXW_yc60tW6Aj0aEi8hISe3DLVZLhL22oyuCq31fYsCss4JG0eE"
                        alt="Picanha Angus Prime"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "600", margin: 0, color: tokens.text }}>
                          Picanha Angus Prime
                        </h4>
                        <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "4px 0 0 0" }}>
                          Fatiada • Origem Premium
                        </p>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: tokens.copper, textTransform: "uppercase" }}>
                        500g
                      </span>
                    </div>
                  </Card>

                  <Card variant="surface" bordered hoverable isDark={isDark} style={{ display: "flex", flexDirection: "row", overflow: "hidden", borderRadius: "6px" }}>
                    <div style={{ width: "128px", height: "128px", background: tokens.surfaceContainer, flexShrink: 0 }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIL7SVVw8g6jhQaTH5KrHphCWXrpHNGiqXMq_-f5E2c_y8tEbaySJR0f2tbEhgQ8pQncfv275jLc0ZBTeefMmdmpZEc_d4Q5uF6imLWlK4hV3ZvZNXDpTRh7fY09b8k_xhP15Gyw6o6JxPXKBIZat1uGq_4S1h6tlTIMmeJOYZ5hlUv4u0PQhpcsSfGT0ko9BMFP1KfYGMUpfNGNPN06fCgiDHVK3LtOVdLm4H8OmqHqFxB4l1P1nP"
                        alt="Wagyu A5"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "600", margin: 0, color: tokens.text }}>
                          Wagyu A5
                        </h4>
                        <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "4px 0 0 0" }}>
                          Peça Inteira • Importado
                        </p>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: tokens.copper, textTransform: "uppercase" }}>
                        300g
                      </span>
                    </div>
                  </Card>
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar (4 cols / 30% width) */}
            <div
              style={{
                flex: "1 1 30%",
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "32px"
              }}
            >
              {/* Section 03 - Subscription Summary */}
              <aside
                style={{
                  background: tokens.surfaceContainer,
                  padding: "24px",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "6px"
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "600", margin: "0 0 20px 0", color: tokens.text, borderBottom: `1px solid ${tokens.border}`, paddingBottom: "8px" }}>
                  Resumo da Assinatura
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", color: tokens.textMuted }}>Valor Mensal</span>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: tokens.copper }}>R$ 875</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", color: tokens.textMuted }}>Próxima Cobrança</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: tokens.text }}>10 de Setembro</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", color: tokens.textMuted }}>Cartão Final</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: tokens.text }}>•••• 4321</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Button variant="primary" size="md" fullWidth isDark={isDark}>
                    Gerenciar assinatura
                  </Button>
                  <Button variant="outline" size="md" fullWidth isDark={isDark}>
                    Alterar frequência
                  </Button>
                  <Button variant="outline" size="md" fullWidth isDark={isDark}>
                    Alterar pagamento
                  </Button>
                </div>
              </aside>

              {/* Section 05 - Quick Actions */}
              <aside style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <button
                  style={{
                    padding: "20px 12px",
                    border: `1px solid ${tokens.border}`,
                    background: tokens.surface,
                    color: tokens.text,
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="10" y1="15" x2="10" y2="9" />
                    <line x1="14" y1="15" x2="14" y2="9" />
                  </svg>
                  <span style={{ fontSize: "12px", textAlign: "center", fontWeight: "500", color: tokens.text }}>
                    Pausar<br />assinatura
                  </span>
                </button>

                <button
                  style={{
                    padding: "20px 12px",
                    border: `1px solid ${tokens.border}`,
                    background: tokens.surface,
                    color: tokens.text,
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ fontSize: "12px", textAlign: "center", fontWeight: "500", color: tokens.text }}>
                    Alterar<br />endereço
                  </span>
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* MODALIDADE AVULSO (Montar Caixa Térmica Avulsa) */}
        {boxMode === "avulso" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "40px", borderRadius: "8px", background: tokens.surfaceContainer }}>
              <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
                <Badge variant="copper" style={{ margin: "0 auto" }}>COMPRA AVULSA SEM FIDELIDADE</Badge>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Monte Sua Caixa Térmica Pontual
                </h2>
                <p style={{ fontSize: "16px", color: tokens.textMuted, lineHeight: "1.6", margin: 0 }}>
                  Selecione seus cortes preferidos do nosso catálogo gourmet. Embalagem a vácuo com selo térmico de transporte seguro para receber em casa sem recorrência.
                </p>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "12px" }}>
                  <Button variant="accent" size="lg" onClick={() => onNavigate ? onNavigate("/cortes") : (window.location.href = "/cortes")}>
                    Escolher Cortes no Catálogo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Section 04 - Box History (Full Width) */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "40px", marginTop: "16px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "600", margin: "0 0 24px 0", color: tokens.text }}>
            Histórico de Caixas
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "600", color: tokens.text }}>Agosto 2024</span>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: tokens.textMuted }}>Entregue</span>
              </div>
              <div style={{ display: "flex", gap: "8px", height: "64px" }}>
                <div style={{ width: "64px", height: "100%", background: tokens.surfaceContainer, borderRadius: "4px", overflow: "hidden" }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpMcXmWrLM2fPzXVl8DdOtO2Nb8n7H9Z8gd-H_-4OuxPx9hRzFLQPHoj-Bg60ElUxgs8oDQM5keliMSe7v_IGUwRn1M2VmW580DWafm-9SL6n04soNVkL91B1rt3mBJZL3Nh3gr9idFQ1MV8tybBwwliA85JqjrVkZB5uRoR24WwHKIHRK3XkWE3DBPHx-4ZkPARQ9zVd74X9F31igUdbObQi_H0TNlt7hdNg8rKs21DFVuTUJgvZ6" alt="Corte" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ width: "64px", height: "100%", background: tokens.surfaceContainer, borderRadius: "4px", overflow: "hidden" }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsz4DDNpMByz-4yY3hEdWqCaGQfamlXzY2Df58Y8wPdD4DNtMlFFVFyJEfPjlOYL08Euw_BkncctBCjKTJCc7mtEZmCcAsexAJikCkiTamxksciIkE_xDuDrqqRjKBSotFp3VcZe3nJGJDYc0Qk1XvXefMvKe3qlpP1WY9JyPju9FP1WkN9h03Kziu0kp0Li3i2OQvBhBAVxixrlu4ZyhNgmQ2R1rttLrVYciAWgRjTlmOdjxEHF98" alt="Corte" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ width: "64px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: tokens.surfaceContainer, color: tokens.textMuted, fontSize: "14px", fontWeight: "600", borderRadius: "4px" }}>
                  +2
                </div>
              </div>
              <span style={{ color: tokens.copper, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}>
                Ver caixa →
              </span>
            </Card>

            <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "600", color: tokens.text }}>Julho 2024</span>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: tokens.textMuted }}>Entregue</span>
              </div>
              <div style={{ display: "flex", gap: "8px", height: "64px" }}>
                <div style={{ width: "64px", height: "100%", background: tokens.surfaceContainer, borderRadius: "4px", overflow: "hidden" }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqeNZmp5Twod4IoG5nLXDoLLCYsyPKZL-LMjTUHGI2tK9zc05o5DLTS1BDEeoYc5MWvKMjUh5S3nq7dnNS32lbIQirft0ydzGqMuhhqKrBiBV7Kll187PtX4muhXBP-eRKKKTIE0zAUjHKj7l7VwhLfqDl5XP6TfS1H_fdGHQAuZsPBGXyo7VultFixpX606116mh5GOBf0l6UHqlrUEX2xf7-At26-w7opKHHjf1lokWxqSzPWEDO" alt="Corte" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ width: "64px", height: "100%", background: tokens.surfaceContainer, borderRadius: "4px", overflow: "hidden" }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1oY1c04zbBpVbCJ2dtvxfurZCT7bbC8Nqk9JSJirq4iatvsBo7E3YHufNQu9-lfoCu3p9iEyTHGLYMuPeGCmiMeU3xtg2f_lMqpWgte0HfVlmirXGpI6Xe8aQelJBlIJpzSlbTUOkoBboqDBCmQFFRsCduBbTSme8sUR7EwTW9QI85lHdbbgLnzvwh4fniZEWVaedtHGPsmLgnaeOjh8ncwtZSrnH8Aq83mR7d7NI0KpGoh1QO5Z5" alt="Corte" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <span style={{ color: tokens.copper, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}>
                Ver caixa →
              </span>
            </Card>
          </div>
        </section>
      </main>

      {/* 3. BottomTabBar Mobile Reutilizável */}
      <BottomTabBar activeTab="minha-caixa" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer do Design System (2026) */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
