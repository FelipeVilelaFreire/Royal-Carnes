"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Footer } from "../../../design-system";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { TruckIcon, SnowflakeIcon, StoreIcon } from "@foundation/ui/Icon/AppIcons";

export interface HomeViewProps {
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

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

  const nextBoxCuts = [
    { name: "Wagyu A5 BMS 10+", detail: "400g" },
    { name: "Dry Aged 60D", detail: "500g" },
    { name: "Angus Prime", detail: "800g" }
  ];

  const recentCuts = [
    { name: "Wagyu A5", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTWZZGOFHbj0Sh572RQ-2vs3emWIEGZWsTB1lYtPYcSjPGcOa9mDPiwX1GCl8gPBNEHqbv95kZnUF7gTwJASw-4aHOZWp1IUKwwTioZC70OM608r9UjPQKMk5Jw4B1qibJodt1tlgo4WyBhdw3iIDeBFHpi2CQBi4BqAaFV2b7RZGuMUPGAkZOHP76xP0TR6KM5dqPFvrumlSXF85A9N100tBX7rkGd__CupxrUAHLYbt5YnwVk0e-" },
    { name: "Picanha Angus", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEyZehgZTv-CyocAVQn0YBZaQ9k5T1yspu9TOTY_a2Ecdie4GqgKNWW_cnd5ZAUuPMshFRWia6eq5Ej3-UQ2L2nImpVVKTr0yfEodgUEJQUsZVZLYiBoQliyrqEezNzVT5XxtmK1ozhqsDd4j-LQyV7RlT1CqQedpMs5qhbesB5PDF1_G10G7rQDZ3U7cedVIHcBedWSA27GA_gQjpXRlZttOTKwJI8hFUgSAUtoBMQmTuk7GfbhUo" },
    { name: "Dry Aged Striploin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAXmVaYdHYrcmadhw4ffayWFLmhKi2Wd01VX122nq-EWMfpfWaDsfTtOw6SUDwD2zSMKVswdk9qzwlTlFxtQOeQgnrOZUW-jtSXa_5S-HMFUhv_yRdqTjCJUstW7NCphwZ7scNWhCjw886NxXFj0k8eSL3rlTnytlxayam_rLinCsnWw953m1QUtUq5wpOjswaTHak-xOTW1szoyzdDGluEtST7pB02z5xQml3yZWKrcenQKSfNRDj" }
  ];

  const discoverCuts = [
    {
      title: "Wagyu A5 BMS 10+",
      origin: "Kagoshima, Japão",
      descriptor: "Marmoreio inigualável, textura amanteigada que derrete na boca com um perfil de sabor rico e complexo.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtaHSRXvo_dlDspmo7ZmMeX4j2uubsZiorZU8s1oDAsn_qj-itWqK8_4qg35ewbMtTM5cLTUOSx5-E8sc9F0FKSY3cvXfPiNfR-McI8apaUZPvht2_2uO2kxg5Hf1jumOKaUpcxs52cf0qcm1iw5_Sxte5PQGb6IxrWr66-wWdenmA0QmWn8w0y9bnl2QHVFy_V5bB37cdig6EXjYtO1-HgE_feZ-Ii2DW5y_Pgxsl5clos9_xhjfU"
    },
    {
      title: "Dry Aged 60D",
      origin: "Uruguai • Maturação 60 dias",
      descriptor: "Notas amendoadas e sabor terroso intenso, desenvolvido através de 60 dias de maturação meticulosa.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5YXnTr9iDJTwWsNC6zH6S03vwIMrVNPSEGl1zkWtDh_NJwvW9xAAq2xhrdqfu6Epe65snbdjvwqz9Bha-8oKEOeXYXyzNcW2UDbe2xoJ5-6x88ayb30Zjsjhe6lrU4VOXa5q6JTYdujt3B4jsf-pVg9DjQm6pb8lY-39-NU-a8uqLmamhzOorjvutxGQgPODEB9Hx5fE9-ix4LXp1kwgOTCFHUjQnB39xNekh93pj4-2eqjlZV1eM"
    },
    {
      title: "Tomahawk Angus Prime",
      origin: "Brasil • 21 Dias",
      descriptor: "Imponente e suculento, o osso alongado intensifica o sabor durante o preparo. Ideal para compartilhar.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAtXvHonLuyVMQpLEwWAQfdjsRKDwpM4iZ5p0vK2aOZOizl_9CAgang7O0rNEq59xNpLAvf4e0PdeBqHFThdWM9Z5_hbO3w85qkVbUd1VMN-yQft8WfYr9toHczJxOtTHk3GqDoU12gy_BUI5Qt1uMLHkKoAHDwnHfq3JxGx2DsBNXRrgnz4BhAAyUbarZbfOX8zRmclwYFNSIaQi2zPDIc3LHPTvWHtypko4vvjxe6_OX7UTrWxIB"
    }
  ];

  return (
    <div style={{ width: "100%", background: tokens.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 1. Header Único Logado do Portal */}
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

      <main style={{ flex: 1, paddingBottom: "60px" }}>
        {/* 01 — PERSONAL GREETING */}
        <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "20px", width: "100%" }}>
            <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "44px", margin: 0, fontWeight: "700" }}>
              Boa noite, Felipe.
            </Text>
            <Text variant="body" style={{ color: tokens.textMuted, fontSize: "16px" }}>
              Seu próximo momento começa aqui.
            </Text>
          </div>
        </SectionContainer>

        {/* PRIMARY HIERARCHY: 02 - NEXT BOX & 03 - QUICK MEMBERSHIP SUMMARY */}
        <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", width: "100%", alignItems: "stretch" }}>
            
            {/* 02 — NEXT BOX (PRIMARY FEATURE) */}
            <Surface
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: "24px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                boxSizing: "border-box",
                gridColumn: "span 2"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ color: tokens.copper, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
                      CAIXA DE SETEMBRO
                    </span>
                    <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "32px", margin: "4px 0 0 0", fontWeight: "700" }}>
                      Minha próxima caixa
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: tokens.surfaceContainer, padding: "6px 14px", borderRadius: "12px", border: `1px solid ${tokens.border}` }}>
                    <TruckIcon size={18} color={tokens.copper} />
                    <span style={{ color: tokens.text, fontSize: "13px", fontWeight: "600" }}>Entrega prevista para 12 de setembro</span>
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: tokens.surfaceContainer, borderRadius: "12px", border: `1px solid ${tokens.border}` }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: tokens.copper, boxShadow: `0 0 10px ${tokens.copper}` }} />
                  <span style={{ color: tokens.text, fontSize: "14px", fontWeight: "600" }}>Status: Preparando sua caixa</span>
                </div>

                {/* Preview dos Cortes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: tokens.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Cortes selecionados para esta caixa:
                  </span>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {nextBoxCuts.map((cut, idx) => (
                      <div key={idx} style={{ background: "rgba(184, 115, 51, 0.08)", border: `1px solid rgba(184, 115, 51, 0.25)`, padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <StoreIcon size={16} color={tokens.copper} />
                        <span style={{ color: tokens.text, fontSize: "14px", fontWeight: "600" }}>{cut.name}</span>
                        <span style={{ color: tokens.copper, fontSize: "12px", fontWeight: "700" }}>({cut.detail})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Timeline Compacta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${tokens.border}`, fontSize: "12px" }}>
                  <span style={{ color: tokens.text, fontWeight: "600" }}>✓ Pedido confirmado</span>
                  <span style={{ color: tokens.copper, fontWeight: "700" }}>● Preparando</span>
                  <span style={{ color: tokens.textMuted }}>○ Embalando</span>
                  <span style={{ color: tokens.textMuted }}>○ Em trânsito</span>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingTop: "16px", borderTop: `1px solid ${tokens.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <SnowflakeIcon size={16} color={tokens.copper} />
                  <span style={{ color: tokens.textMuted, fontSize: "12px", fontWeight: "600" }}>Cadeia de frio garantida (-2°C)</span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button appearance="outline" tone="neutral" size="sm" onClick={() => onNavigate && onNavigate("/portal-minha-caixa")}>
                    Alterar caixa
                  </Button>
                  <Button appearance="solid" tone="primary" size="sm" onClick={() => onNavigate && onNavigate("/portal-minha-caixa")}>
                    Ver minha caixa ➔
                  </Button>
                </div>
              </div>
            </Surface>

            {/* 03 — QUICK MEMBERSHIP SUMMARY */}
            <Surface
              style={{
                background: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: "24px",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <span style={{ color: tokens.copper, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
                    SEU CLUBE
                  </span>
                  <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "28px", margin: "4px 0 0 0", fontWeight: "700" }}>
                    Royal Prime Monthly
                  </Text>
                </div>

                <div style={{ display: "inline-block", background: "rgba(34, 197, 94, 0.15)", color: "#22C55E", fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "8px", width: "fit-content" }}>
                  Membro ativo
                </div>

                <div style={{ borderLeft: `3px solid ${tokens.copper}`, paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "800", color: tokens.text }}>R$ 279 / mês</span>
                  <span style={{ fontSize: "13px", color: tokens.textMuted }}>Próxima cobrança: 10 de setembro</span>
                </div>
              </div>

              <Button appearance="outline" tone="neutral" size="sm" style={{ width: "100%" }} onClick={() => onNavigate && onNavigate("/portal-minha-conta")}>
                Gerenciar assinatura
              </Button>
            </Surface>

          </div>
        </SectionContainer>

        {/* SECONDARY HIERARCHY: 04 - RECENT BOX */}
        <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
          <Surface
            style={{
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ color: tokens.copper, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
                  ÚLTIMA CAIXA
                </span>
                <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "24px", margin: "2px 0 0 0", fontWeight: "700" }}>
                  Caixa de Agosto — Entregue em 12 de agosto
                </Text>
              </div>
              <span style={{ fontSize: "13px", color: tokens.copper, fontWeight: "700", cursor: "pointer" }} onClick={() => onNavigate && onNavigate("/portal-minha-caixa")}>
                Ver caixa anterior ➔
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {recentCuts.map((cut, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px", background: tokens.surfaceContainer, padding: "12px", borderRadius: "16px", border: `1px solid ${tokens.border}` }}>
                  <img src={cut.image} alt={cut.name} style={{ width: "56px", height: "56px", borderRadius: "10px", objectFit: "cover" }} />
                  <span style={{ color: tokens.text, fontSize: "15px", fontWeight: "600" }}>{cut.name}</span>
                </div>
              ))}
            </div>
          </Surface>
        </SectionContainer>

        {/* DISCOVERY HIERARCHY: 05 - DISCOVER PREMIUM CUTS */}
        <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
            <div>
              <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "36px", margin: 0, fontWeight: "700" }}>
                Descubra novos cortes
              </Text>
              <Text variant="body" style={{ color: tokens.textMuted, fontSize: "16px", marginTop: "4px" }}>
                Selecionados exclusivamente para membros Royal Prime.
              </Text>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", width: "100%" }}>
              {discoverCuts.map((item, idx) => (
                <Surface
                  key={idx}
                  style={{
                    background: tokens.surface,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: "24px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box"
                  }}
                >
                  <div style={{ height: "240px", overflow: "hidden" }}>
                    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "14px", flexGrow: 1 }}>
                    <div>
                      <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: tokens.text, fontSize: "22px", margin: 0, fontWeight: "700" }}>
                        {item.title}
                      </Text>
                      <span style={{ fontSize: "12px", color: tokens.copper, fontWeight: "600", display: "block", marginTop: "2px" }}>
                        {item.origin}
                      </span>
                    </div>
                    <Text variant="body" style={{ color: tokens.textMuted, fontSize: "14px", fontStyle: "italic", lineHeight: 1.6, flexGrow: 1 }}>
                      "{item.descriptor}"
                    </Text>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: `1px solid ${tokens.border}` }}>
                      <span style={{ fontSize: "12px", color: tokens.textMuted }}>Disponível para você</span>
                      <Button appearance="outline" tone="neutral" size="sm" onClick={() => onNavigate && onNavigate("/portal-cortes")}>
                        Ver corte
                      </Button>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          </div>
        </SectionContainer>
      </main>

      {/* 2. BottomTabBar Mobile */}
      <BottomTabBar activeTab="portal-home" onNavigate={onNavigate} isDark={isDark} />

      {/* 3. Footer */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
