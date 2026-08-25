import React, { useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { clientThemeManifest } from "@/manifest/theme.manifest";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";

export interface HomePlansSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HomePlansSection: React.FC<HomePlansSectionProps> = ({ onRouteClick }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface, surfaceContainer } = themeColors;
  const strings = clientPtBR.landing.plans;

  const isAnnual = billingCycle === "annual";

  return (
    <div style={{ width: "100%" }}>
      {/* Header da Seção */}
      <ScrollToAppear direction="up">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: primary, letterSpacing: "2px", textTransform: "uppercase" }}>
            {strings.badge}
          </span>
          <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: "8px 0 0 0", fontWeight: "800" }}>
            {strings.title}
          </Text>
          <Text variant="body" style={{ color: textMuted, fontSize: "16px", marginTop: "8px" }}>
            {strings.subtitle}
          </Text>
        </div>
      </ScrollToAppear>

      {/* Segmented Control Toggle: Mensal vs Anual 20% OFF */}
      <ScrollToAppear delayMs={100} direction="up">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px",
              borderRadius: "9999px",
              background: surfaceContainer || surface,
              border: `1px solid ${border}`,
              gap: "8px"
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                border: "none",
                background: !isAnnual ? primary : "transparent",
                color: !isAnnual ? "#0B0908" : textMuted,
                fontWeight: "800",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {strings.billingMonthly}
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                border: "none",
                background: isAnnual ? primary : "transparent",
                color: isAnnual ? "#0B0908" : textMuted,
                fontWeight: "800",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span>{strings.billingAnnual}</span>
              <span
                style={{
                  background: "#A40213",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "700"
                }}
              >
                {strings.annualDiscountBadge}
              </span>
            </button>
          </div>
        </div>
      </ScrollToAppear>

      {/* Banner de Resumo da Cobrança Anual */}
      {isAnnual && (
        <ScrollToAppear delayMs={150} direction="up">
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto 48px",
              background: surface,
              border: `1px solid ${primary}`,
              borderRadius: "24px",
              padding: "28px 36px",
              boxShadow: "0 15px 35px rgba(255, 198, 101, 0.15)"
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "center" }}>
              <div>
                <span style={{ fontSize: "14px", color: primary, fontWeight: "700" }}>ECONOMIA</span>
                <Text variant="h3" style={{ color: text, fontSize: "16px", margin: "6px 0 2px 0", fontWeight: "700" }}>
                  {strings.annualBanner.savings}
                </Text>
                <Text variant="caption" style={{ color: textMuted, fontSize: "13px" }}>
                  {strings.annualBanner.savingsDesc}
                </Text>
              </div>
              <div style={{ borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}`, padding: "0 16px" }}>
                <span style={{ fontSize: "14px", color: primary, fontWeight: "700" }}>BRINDE</span>
                <Text variant="h3" style={{ color: text, fontSize: "16px", margin: "6px 0 2px 0", fontWeight: "700" }}>
                  {strings.annualBanner.gift}
                </Text>
                <Text variant="caption" style={{ color: textMuted, fontSize: "13px" }}>
                  {strings.annualBanner.giftDesc}
                </Text>
              </div>
              <div>
                <span style={{ fontSize: "14px", color: primary, fontWeight: "700" }}>GARANTIA</span>
                <Text variant="h3" style={{ color: text, fontSize: "16px", margin: "6px 0 2px 0", fontWeight: "700" }}>
                  {strings.annualBanner.priceLock}
                </Text>
                <Text variant="caption" style={{ color: textMuted, fontSize: "13px" }}>
                  {strings.annualBanner.priceLockDesc}
                </Text>
              </div>
            </div>
          </div>
        </ScrollToAppear>
      )}

      {/* Grid de Cards dos 3 Planos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", width: "100%", alignItems: "stretch" }}>
        
        {/* Plano 1: Essencial */}
        <ScrollToAppear delayMs={0} direction="up">
          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "28px",
              padding: "36px 32px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: textMuted, background: surfaceContainer || surface, padding: "6px 14px", borderRadius: "16px" }}>
                  {strings.essential.badge}
                </span>
                {isAnnual && (
                  <span style={{ fontSize: "11px", color: primary, fontWeight: "700" }}>
                    {strings.essential.annualSavings}
                  </span>
                )}
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "30px", margin: "0 0 8px 0", fontWeight: "700" }}>
                {strings.essential.title}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "14px", lineHeight: 1.5, marginBottom: "28px" }}>
                {strings.essential.subtitle}
              </Text>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "18px", color: primary, fontWeight: "700" }}>R$</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "52px", color: text, fontWeight: "800" }}>
                  {isAnnual ? strings.essential.annualPrice : strings.essential.monthlyPrice}
                </span>
                <span style={{ fontSize: "14px", color: textMuted }}>/mês</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
                {strings.essential.features.map((feat, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: text }}>
                    <span style={{ color: primary, fontWeight: "700" }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              appearance="outline"
              tone="neutral"
              size="lg"
              onClick={() => onRouteClick("plans")}
            >
              {strings.essential.cta}
            </Button>
          </Surface>
        </ScrollToAppear>

        {/* Plano 2: Master Churrasco (Featured / Destaque) */}
        <ScrollToAppear delayMs={120} direction="up">
          <Surface
            style={{
              background: surface,
              border: `2px solid ${primary}`,
              borderRadius: "28px",
              padding: "36px 32px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              boxShadow: "0 25px 50px rgba(255, 198, 101, 0.2)",
              boxSizing: "border-box"
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: primary,
                color: "#0B0908",
                fontSize: "11px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                padding: "6px 20px",
                borderRadius: "20px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.5)"
              }}
            >
              {strings.master.tagFeatured}
            </span>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", marginTop: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: primary, background: "rgba(255,198,101,0.15)", padding: "6px 14px", borderRadius: "16px", border: `1px solid ${border}` }}>
                  {strings.master.badge}
                </span>
                {isAnnual && (
                  <span style={{ fontSize: "11px", color: primary, fontWeight: "700" }}>
                    {strings.master.annualSavings}
                  </span>
                )}
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "30px", margin: "0 0 8px 0", fontWeight: "700" }}>
                {strings.master.title}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "14px", lineHeight: 1.5, marginBottom: "28px" }}>
                {strings.master.subtitle}
              </Text>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "18px", color: primary, fontWeight: "700" }}>R$</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "52px", color: text, fontWeight: "800" }}>
                  {isAnnual ? strings.master.annualPrice : strings.master.monthlyPrice}
                </span>
                <span style={{ fontSize: "14px", color: textMuted }}>/mês</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
                {strings.master.features.map((feat, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: idx >= 3 ? primary : text, fontWeight: idx >= 3 ? "700" : "400" }}>
                    <span style={{ color: primary, fontWeight: "700" }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              appearance="solid"
              tone="primary"
              size="lg"
              onClick={() => onRouteClick("plans")}
            >
              {strings.master.cta}
            </Button>
          </Surface>
        </ScrollToAppear>

        {/* Plano 3: Exclusive Wagyu */}
        <ScrollToAppear delayMs={240} direction="up">
          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "28px",
              padding: "36px 32px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#F87171", background: "rgba(164,2,19,0.2)", padding: "6px 14px", borderRadius: "16px", border: "1px solid rgba(164,2,19,0.4)" }}>
                  {strings.wagyu.badge}
                </span>
                {isAnnual && (
                  <span style={{ fontSize: "11px", color: primary, fontWeight: "700" }}>
                    {strings.wagyu.annualSavings}
                  </span>
                )}
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "30px", margin: "0 0 8px 0", fontWeight: "700" }}>
                {strings.wagyu.title}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "14px", lineHeight: 1.5, marginBottom: "28px" }}>
                {strings.wagyu.subtitle}
              </Text>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "28px" }}>
                <span style={{ fontSize: "18px", color: primary, fontWeight: "700" }}>R$</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "52px", color: text, fontWeight: "800" }}>
                  {isAnnual ? strings.wagyu.annualPrice : strings.wagyu.monthlyPrice}
                </span>
                <span style={{ fontSize: "14px", color: textMuted }}>/mês</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
                {strings.wagyu.features.map((feat, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: text }}>
                    <span style={{ color: primary, fontWeight: "700" }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              appearance="outline"
              tone="neutral"
              size="lg"
              onClick={() => onRouteClick("plans")}
            >
              {strings.wagyu.cta}
            </Button>
          </Surface>
        </ScrollToAppear>

      </div>
    </div>
  );
};
