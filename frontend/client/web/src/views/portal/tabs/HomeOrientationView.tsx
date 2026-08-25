"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, Button, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
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
  const gold = "#C8A24A";

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
    boxShadow: isDark ? "0 18px 48px rgba(0, 0, 0, 0.22)" : "0 18px 48px rgba(40, 29, 18, 0.08)"
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

      <main style={{ flex: 1, width: "100%" }}>
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: showHeader ? "44px 24px 28px" : "28px 24px 28px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              alignItems: "stretch"
            }}
          >
            <div
              style={{
                gridColumn: "span 2",
                minWidth: 0,
                ...cardStyle,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                background: `linear-gradient(135deg, ${tokens.surfaceContainer} 0%, ${isDark ? "#17110D" : "#FFF9EF"} 100%)`
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 12px",
                    color: gold,
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
                    fontSize: "clamp(34px, 5vw, 58px)",
                    lineHeight: 1.02,
                    margin: 0,
                    color: tokens.text
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
                    maxWidth: "680px"
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
              style={{
                minWidth: 0,
                ...cardStyle,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px"
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  color: gold,
                  background: isDark ? "rgba(200, 162, 74, 0.12)" : "rgba(200, 162, 74, 0.16)"
                }}
              >
                <CutMeatIcon size={24} />
              </div>
              <div>
                <h2 style={{ margin: "0 0 10px", fontSize: "22px", color: tokens.text }}>
                  {strings.hero.catalogCardTitle}
                </h2>
                <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.55 }}>
                  {strings.hero.catalogCardDescription}
                </p>
              </div>
              <Button variant="outline" isDark={isDark} onClick={() => navigateTo("/cortes")}>
                {strings.hero.catalogCardCta}
              </Button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
              marginTop: "18px"
            }}
          >
            {pathCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} style={{ ...cardStyle, padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        color: gold,
                        background: isDark ? "rgba(200, 162, 74, 0.12)" : "rgba(200, 162, 74, 0.16)"
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <span style={{ color: gold, fontSize: "12px", fontWeight: 800 }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: "22px", color: tokens.text }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ margin: "0 0 4px", color: tokens.text, fontWeight: 800 }}>
                    {item.eyebrow}
                  </p>
                  <p style={{ margin: "0 0 18px", color: tokens.textMuted, lineHeight: 1.55 }}>
                    {item.description}
                  </p>
                  <div style={{ display: "grid", gap: "9px", marginBottom: "22px" }}>
                    {item.bullets.map((bullet) => (
                      <span
                        key={bullet}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: tokens.textMuted,
                          fontSize: "14px"
                        }}
                      >
                        <CheckIcon size={15} color={gold} />
                        {bullet}
                      </span>
                    ))}
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

        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "34px 24px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "end", flexWrap: "wrap", marginBottom: "18px" }}>
            <div>
              <p style={{ margin: "0 0 8px", color: gold, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
            {catalogHighlights.map((item) => (
              <article key={item.title} style={{ ...cardStyle, overflow: "hidden" }}>
                <div style={{ height: "170px", background: tokens.surfaceContainer }}>
                  <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ margin: "0 0 8px", color: tokens.text, fontSize: "20px" }}>{item.title}</h3>
                  <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.5 }}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "34px 24px", boxSizing: "border-box" }}>
          <div style={{ ...cardStyle, padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "center", flexWrap: "wrap", marginBottom: "22px" }}>
              <div>
                <p style={{ margin: "0 0 8px", color: gold, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {strings.planSummary.badge}
                </p>
                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "34px", color: tokens.text }}>
                  {strings.planSummary.title}
                </h2>
              </div>
              <Button variant="primary" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                {strings.planSummary.cta}
              </Button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px" }}>
              {planSummary.map((plan) => (
                <article
                  key={plan.name}
                  style={{
                    border: `1px solid ${tokens.border}`,
                    borderRadius: "14px",
                    padding: "20px",
                    background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.65)"
                  }}
                >
                  <h3 style={{ margin: "0 0 6px", fontSize: "24px", color: tokens.text }}>{plan.name}</h3>
                  <p style={{ margin: "0 0 2px", color: gold, fontWeight: 900 }}>{plan.price}</p>
                  <p style={{ margin: "0 0 16px", color: tokens.textMuted, fontSize: "13px" }}>{plan.annual}</p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {plan.details.map((detail) => (
                      <span key={detail} style={{ display: "flex", gap: "8px", alignItems: "center", color: tokens.textMuted, fontSize: "14px" }}>
                        <CheckIcon size={14} color={gold} />
                        {detail}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "34px 24px", boxSizing: "border-box" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "18px" }}>
            <article style={{ ...cardStyle, padding: "28px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                <BoxIcon size={30} color={gold} />
                <div>
                  <p style={{ margin: 0, color: gold, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {strings.royalBox.badge}
                  </p>
                  <h2 style={{ margin: "4px 0 0", fontFamily: "'Playfair Display', serif", fontSize: "32px", color: tokens.text }}>
                    {strings.royalBox.title}
                  </h2>
                </div>
              </div>
              <p style={{ margin: "0 0 20px", color: tokens.textMuted, lineHeight: 1.6 }}>
                {strings.royalBox.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "22px" }}>
                {strings.royalBox.features.map((item) => (
                  <span key={item} style={{ border: `1px solid ${tokens.border}`, borderRadius: "12px", padding: "12px", color: tokens.textMuted }}>
                    {item}
                  </span>
                ))}
              </div>
              <Button variant="primary" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                {strings.royalBox.cta}
              </Button>
            </article>

            <article style={{ ...cardStyle, padding: "28px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                <TruckIcon size={30} color={gold} />
                <div>
                  <p style={{ margin: 0, color: gold, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
                  <span key={item} style={{ border: `1px solid ${tokens.border}`, borderRadius: "12px", padding: "12px", color: tokens.textMuted }}>
                    {item}
                  </span>
                ))}
              </div>
              <Button variant="outline" isDark={isDark} onClick={() => navigateTo("/produtos")}>
                {strings.delivery.cta}
              </Button>
            </article>
          </div>
        </section>

        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "34px 24px 72px", boxSizing: "border-box" }}>
          <div style={{ ...cardStyle, padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {strings.trust.map((label, index) => {
              const trustIcons = [CutMeatIcon, KnifeIcon, FlameIcon, SparklesIcon, SpicesIcon];
              const Icon = trustIcons[index] || SparklesIcon;
              return (
                <div key={label} style={{ display: "flex", gap: "10px", alignItems: "center", color: tokens.textMuted }}>
                  <Icon size={20} color={gold} />
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
