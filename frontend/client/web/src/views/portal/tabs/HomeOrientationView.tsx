"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, Button, Footer } from "../../../design-system";
import { themeColorsDefault, themeSpacingDefault } from "@foundation/tokens/theme.tokens";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import {
  BoxIcon,
  CheckIcon,
  CutMeatIcon,
  FlameIcon,
  KnifeIcon,
  OfferTagIcon,
  SparklesIcon,
  SpicesIcon,
  TruckIcon
} from "../../../design-system/Icons";

export interface HomeOrientationViewProps {
  onNavigate?: (path: string) => void;
  showHeader?: boolean;
}

const pathIcons = [OfferTagIcon, BoxIcon, TruckIcon];

const catalogImages = [
  {
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80"
  },
  {
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80"
  },
  {
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80"
  },
  {
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80"
  }
];

export const HomeOrientationView: React.FC<HomeOrientationViewProps> = ({
  onNavigate,
  showHeader = true
}) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

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
  const strings = clientPtBR.home.orientation;
  const pathCards = strings.paths.map((item, index) => ({ ...item, icon: pathIcons[index] || OfferTagIcon }));
  const catalogHighlights = strings.catalogs.items.map((item, index) => ({
    ...item,
    image: catalogImages[index]?.image || catalogImages[0].image
  }));
  const planSummary = strings.planSummary.plans;
  const accent = tokens.copper || tokens.primary;
  const mediaText = tokens.ivory || tokens.surface;
  const shadowColor = tokens.charcoal || tokens.text;
  const softSurface = tokens.surfaceContainer || tokens.surface;
  const px = themeSpacingDefault;
  const alpha = (color: string, opacity: number) => {
    if (color.startsWith("#")) {
      const normalized = color.replace("#", "");
      const full = normalized.length === 3
        ? normalized.split("").map((char) => `${char}${char}`).join("")
        : normalized;
      const value = Number.parseInt(full, 16);
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };
  const shadow = (y: number, blur: number, opacity: number) => `0 ${y}px ${blur}px ${alpha(shadowColor, opacity)}`;
  const overlay = (start: number, end: number) =>
    `linear-gradient(180deg, ${alpha(shadowColor, start)}, ${alpha(shadowColor, end)})`;
  const accentWash = (strong: number, soft: number) =>
    `linear-gradient(145deg, ${alpha(accent, strong)}, ${alpha(softSurface, soft)})`;

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    localStorage.setItem("royal_prime_theme", next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const cardStyle: React.CSSProperties = {
    background: tokens.surfaceContainer,
    border: `1px solid ${tokens.border}`,
    borderRadius: "18px",
    boxShadow: shadow(18, 48, isDark ? 0.22 : 0.08)
  };

  const sectionShellStyle: React.CSSProperties = {
    maxWidth: "1560px",
    margin: "0 auto",
    padding: `36px ${px.lg} 26px`,
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: showHeader ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        background: tokens.background,
        color: tokens.text,
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {showHeader ? (
        <PortalHeader
          activeTab="portal-home"
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onNavigate={onNavigate}
        />
      ) : null}

      <style>{`
        @media (max-width: 900px) {
          .home-orientation-hero {
            grid-template-columns: 1fr !important;
          }

          .home-orientation-hero-media {
            min-height: 280px !important;
          }

          .home-orientation-paths {
            grid-template-columns: 1fr !important;
          }

          .home-product-highlight-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .home-horizontal-vitrine {
          scrollbar-width: thin;
          scrollbar-color: ${accent} transparent;
        }
      `}</style>

      <main style={{ flex: 1, width: "100%" }}>
        <section
          style={{
            ...sectionShellStyle,
            padding: showHeader ? "44px 24px 30px" : "28px 24px 30px"
          }}
        >
          <div
            className="home-orientation-hero"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(360px, 1.1fr)",
              gap: "34px",
              alignItems: "center",
              marginBottom: "28px"
            }}
          >
            <div
              className="home-orientation-hero-copy"
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "26px"
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 12px",
                    color: accent,
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}
                >
                  {strings.hero.badge}
                </p>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(42px, 6.2vw, 76px)",
                    lineHeight: 1.02,
                    margin: 0,
                    color: tokens.text,
                    maxWidth: "680px"
                  }}
                >
                  {strings.hero.title}
                </h1>
                <p
                  style={{
                    margin: "18px 0 0",
                    color: tokens.textMuted,
                    fontSize: "18px",
                    lineHeight: 1.55,
                    maxWidth: "620px"
                  }}
                >
                  {strings.hero.description}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button variant="primary" size="lg" isDark={isDark} onClick={() => navigateTo("/cortes")}>
                  {strings.hero.ctaCatalog}
                </Button>
                <Button variant="outline" size="lg" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                  {strings.hero.ctaProducts}
                </Button>
              </div>
            </div>

            <div
              className="home-orientation-hero-media"
              style={{
                minWidth: 0,
                minHeight: "420px",
                borderRadius: "24px",
                overflow: "hidden",
                border: `1px solid ${tokens.border}`,
                boxShadow: shadow(22, 58, isDark ? 0.26 : 0.1),
                position: "relative",
                background: tokens.surfaceContainer
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=82"
                alt={strings.hero.catalogCardTitle}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: overlay(isDark ? 0.04 : 0, isDark ? 0.52 : 0.26)
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "22px",
                  right: "22px",
                  bottom: "22px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "end",
                  color: mediaText
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif", fontSize: "30px", lineHeight: 1.08 }}>
                    {strings.hero.catalogCardTitle}
                  </h2>
                  <p style={{ margin: 0, maxWidth: "470px", color: alpha(mediaText, 0.84), lineHeight: 1.5 }}>
                    {strings.hero.catalogCardDescription}
                  </p>
                </div>
                <Button variant="accent" isDark={isDark} onClick={() => navigateTo("/cortes")}>
                  {strings.hero.catalogCardCta}
                </Button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
              marginBottom: "18px",
              borderTop: `1px solid ${tokens.border}`,
              borderBottom: `1px solid ${tokens.border}`,
              padding: "14px 0"
            }}
          >
            {strings.hero.stats.map((stat) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: "8px", minWidth: 0 }}>
                <strong style={{ color: tokens.text, fontSize: "20px", whiteSpace: "nowrap" }}>
                  {stat.value}
                </strong>
                <span style={{ color: tokens.textMuted, fontSize: "13px", fontWeight: 700 }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="home-orientation-paths"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px",
              marginTop: "18px"
            }}
          >
            {pathCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  style={{
                    ...cardStyle,
                    padding: "24px",
                    minHeight: "285px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                    background: index === 1
                      ? isDark
                        ? accentWash(0.15, 0.04)
                        : accentWash(0.13, 0.74)
                      : tokens.surfaceContainer
                  }}
                >
                  <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", marginBottom: "18px" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "16px",
                        display: "grid",
                        placeItems: "center",
                        color: index === 1 ? mediaText : accent,
                        background: index === 1 ? accent : alpha(accent, isDark ? 0.12 : 0.16)
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span style={{ color: accent, fontSize: "13px", fontWeight: 900 }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "25px", color: tokens.text, fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: "0 0 4px", color: tokens.text, fontWeight: 800 }}>
                    {item.eyebrow}
                  </p>
                  <p style={{ margin: "0 0 18px", color: tokens.textMuted, lineHeight: 1.55 }}>
                    {item.description}
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "22px", flexWrap: "wrap" }}>
                    {item.bullets.map((bullet) => (
                      <span
                        key={bullet}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: tokens.textMuted,
                          fontSize: "13px",
                          border: `1px solid ${tokens.border}`,
                          borderRadius: "999px",
                          padding: "7px 10px",
                          background: alpha(softSurface, isDark ? 0.34 : 0.58)
                        }}
                      >
                        <CheckIcon size={15} color={accent} />
                        {bullet}
                      </span>
                    ))}
                  </div>
                  </div>
                  <Button
                    variant={index === 1 ? "primary" : "outline"}
                    isDark={isDark}
                    onClick={() => navigateTo("/produtos")}
                  >
                    {item.cta}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        <section style={sectionShellStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "end", flexWrap: "wrap", marginBottom: "18px" }}>
            <div>
              <p style={{ margin: "0 0 8px", color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {strings.catalogs.badge}
              </p>
              <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "34px", color: tokens.text }}>
                {strings.catalogs.title}
              </h2>
            </div>
            <Button variant="outline" isDark={isDark} onClick={() => navigateTo("/cortes")}>
              {strings.catalogs.cta}
            </Button>
          </div>

          <div
            className="home-horizontal-vitrine"
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "minmax(290px, 380px)",
              gap: "16px",
              overflowX: "auto",
              padding: "2px 2px 14px"
            }}
          >
            {catalogHighlights.map((item) => (
              <article key={item.title} style={{ ...cardStyle, minHeight: "250px", overflow: "hidden", position: "relative" }}>
                <img src={item.image} alt={item.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: overlay(0.04, 0.72) }} />
                <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "20px", color: mediaText }}>
                  <h3 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif", fontSize: "26px" }}>{item.title}</h3>
                  <p style={{ margin: 0, color: alpha(mediaText, 0.82), lineHeight: 1.5 }}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...sectionShellStyle, paddingTop: "58px" }}>
          <div style={{ marginBottom: "26px", textAlign: "center" }}>
            <p style={{ margin: 0, color: accent, fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 3vw, 44px)", fontWeight: 700, lineHeight: 1.05 }}>
              {strings.planSummary.badge}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {planSummary.map((plan, index) => (
                <article
                  key={plan.name}
                  style={{
                    ...cardStyle,
                    border: `1px solid ${index === 1 ? accent : tokens.border}`,
                    borderRadius: "18px",
                    padding: "24px",
                    minHeight: "270px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: index === 1
                      ? isDark
                        ? accentWash(0.2, 0.04)
                        : accentWash(0.16, 0.82)
                      : alpha(softSurface, isDark ? 0.34 : 0.66)
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
                      <div>
                        <span style={{ color: accent, fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          Plano {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 style={{ margin: "5px 0 0", fontSize: "28px", color: tokens.text, fontFamily: "'Playfair Display', serif" }}>{plan.name}</h3>
                      </div>
                      {index === 1 ? (
                        <span style={{ border: `1px solid ${accent}`, color: accent, borderRadius: "999px", padding: "5px 9px", fontSize: "11px", fontWeight: 900 }}>
                          Destaque
                        </span>
                      ) : null}
                    </div>
                    <p style={{ margin: "0 0 16px", color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                      {index === 0
                        ? "Entrada enxuta para churrasco simples."
                        : index === 1
                          ? "O pacote mais equilibrado para família."
                          : "Experiência completa com linha nobre."}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: "9px" }}>
                    {plan.details.map((detail) => (
                      <span key={detail} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px", alignItems: "center", color: tokens.text, fontSize: "14px" }}>
                        <CheckIcon size={14} color={accent} />
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "14px", marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "end" }}>
                    <div>
                      <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "3px" }}>
                        Referência
                      </span>
                      <strong style={{ color: tokens.text, fontSize: "18px" }}>{plan.price}</strong>
                    </div>
                    <span style={{ color: tokens.textMuted, fontSize: "12px", textAlign: "right" }}>{plan.annual}</span>
                  </div>
                </article>
              ))}
            </div>
        </section>

        <section style={sectionShellStyle}>
          <div
            className="home-product-highlight-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
              gap: "18px",
              alignItems: "stretch"
            }}
          >
            <article
              style={{
                ...cardStyle,
                overflow: "hidden",
                display: "grid",
                gridTemplateRows: "210px 1fr",
                border: `1px solid ${accent}`,
                background: accentWash(isDark ? 0.12 : 0.1, isDark ? 0.3 : 0.72)
              }}
            >
              <div style={{ position: "relative", background: tokens.surfaceContainer }}>
                <img
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=84"
                  alt={strings.royalBox.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
                <div style={{ position: "absolute", inset: 0, background: overlay(0.02, 0.46) }} />
                <div
                  style={{
                    position: "absolute",
                    left: "20px",
                    bottom: "18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    color: mediaText,
                    background: alpha(shadowColor, 0.48),
                    border: `1px solid ${alpha(mediaText, 0.2)}`,
                    borderRadius: "999px",
                    padding: "9px 12px",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}
                >
                  <BoxIcon size={16} color={accent} />
                  {strings.royalBox.badge}
                </div>
              </div>
              <div style={{ padding: "28px" }}>
              <div>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                <BoxIcon size={30} color={accent} />
                <div>
                  <p style={{ margin: 0, color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {strings.royalBox.badge}
                  </p>
                  <h2 style={{ margin: "4px 0 0", fontFamily: "'Playfair Display', serif", fontSize: "32px", color: tokens.text, lineHeight: 1.08 }}>
                    {strings.royalBox.title}
                  </h2>
                </div>
              </div>
              <p style={{ margin: "0 0 20px", color: tokens.textMuted, lineHeight: 1.6, fontSize: "15px" }}>
                {strings.royalBox.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "22px" }}>
                {strings.royalBox.features.map((item) => (
                  <span key={item} style={{ border: `1px solid ${tokens.border}`, borderRadius: "999px", padding: "10px 12px", color: tokens.textMuted, fontSize: "13px" }}>
                    {item}
                  </span>
                ))}
              </div>
              </div>
              <Button variant="primary" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                {strings.royalBox.cta}
              </Button>
              </div>
            </article>

            <article style={{ ...cardStyle, overflow: "hidden", display: "grid", gridTemplateRows: "180px 1fr" }}>
              <div style={{ position: "relative", background: tokens.surfaceContainer }}>
                <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1000&q=82" alt={strings.delivery.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                <TruckIcon size={30} color={accent} />
                <div>
                  <p style={{ margin: 0, color: accent, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {strings.delivery.badge}
                  </p>
                  <h2 style={{ margin: "4px 0 0", fontFamily: "'Playfair Display', serif", fontSize: "32px", color: tokens.text }}>
                    {strings.delivery.title}
                  </h2>
                </div>
              </div>
              <p style={{ margin: "0 0 20px", color: tokens.textMuted, lineHeight: 1.6 }}>
                {strings.delivery.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "22px" }}>
                {strings.delivery.features.map((item) => (
                  <span key={item} style={{ border: `1px solid ${tokens.border}`, borderRadius: "999px", padding: "10px 12px", color: tokens.textMuted, fontSize: "13px" }}>
                    {item}
                  </span>
                ))}
              </div>
              <Button variant="outline" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                {strings.delivery.cta}
              </Button>
              </div>
            </article>
          </div>
        </section>

        <section style={{ ...sectionShellStyle, padding: "36px 24px 72px" }}>
          <div style={{ ...cardStyle, padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {strings.trust.map((label, index) => {
              const trustIcons = [CutMeatIcon, KnifeIcon, FlameIcon, SparklesIcon, SpicesIcon];
              const Icon = trustIcons[index] || SparklesIcon;
              return (
                <div key={label} style={{ display: "flex", gap: "10px", alignItems: "center", color: tokens.textMuted }}>
                  <Icon size={20} color={accent} />
                  <span style={{ fontWeight: 700 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {showHeader ? <Footer /> : null}
    </div>
  );
};
