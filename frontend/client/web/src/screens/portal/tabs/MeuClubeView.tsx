"use client";

import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { clientPtBR } from "@/locales/pt-BR";
import { clientThemeManifest } from "@/manifests/theme.manifest";
import { catalogSubscriptionPlansMock } from "@/mocks/catalog";
import { royalCustomerMock } from "@/mocks/customer.mock";
import { CheckIcon, UserIcon, TruckIcon, SettingsIcon, StarIcon, LogoutIcon, ChevronRightIcon } from "@foundation/ui/Icon/AppIcons";

export interface MeuClubeViewProps {
  onNavigate?: (path: string) => void;
}

export const MeuClubeView: React.FC<MeuClubeViewProps> = ({ onNavigate }) => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;
  const strings = clientPtBR.meuClube;
  const activePlan = catalogSubscriptionPlansMock.find((plan) => plan.key === royalCustomerMock.activeSubscription?.planKey) || catalogSubscriptionPlansMock[0];
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "R$ 279";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(amount);
  };
  const fallbackBenefitsList = [
    "Acesso a cortes exclusivos",
    "Condições especiais para membros",
    "Acesso antecipado a edições limitadas",
    "Flexibilidade para pausar ou alterar sua caixa"
  ];
  const benefitsList = activePlan?.features || [];
  const planName = activePlan ? activePlan.name : "Royal Prime Monthly";
  const planPrice = formatCurrency(activePlan?.monthlyPrice);

  const accountMenuItems = [
    { label: "Dados pessoais", icon: "person" },
    { label: "Endereço de entrega", icon: "truck" },
    { label: "Forma de pagamento", icon: "card" },
    { label: "Preferências", icon: "tune" },
    { label: "Notificações", icon: "bell" }
  ];

  return (
    <div style={{ width: "100%", background: background || "#0B0908", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", paddingTop: "20px", width: "100%" }}>
          {/* Header da Página */}
          <div>
            <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "52px", margin: 0, fontWeight: "800" }}>
              Meu Clube
            </Text>
          </div>

          {/* Grid Principal de 2 Colunas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "48px", width: "100%", alignItems: "start" }}>
            {/* Coluna Esquerda: Perfil, Card de Assinatura & Benefícios */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
              {/* Header do Perfil do Sócio */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: surfaceContainer || surface,
                    border: `1px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: primary, fontWeight: "700" }}>
                    F
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "32px", margin: 0, fontWeight: "700" }}>
                    {strings.userName}
                  </Text>
                  <Text variant="body" style={{ color: textMuted, fontSize: "15px" }}>
                    Membro Royal Prime desde agosto de 2026
                  </Text>
                </div>
              </div>

              {/* Card de Assinatura VIP */}
              <Surface
                style={{
                  background: surface,
                  border: `1px solid ${primary}`,
                  borderRadius: "28px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  boxSizing: "border-box",
                  width: "100%"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span
                      style={{
                        background: "rgba(255,198,101,0.15)",
                        color: primary,
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        border: `1px solid rgba(255,198,101,0.3)`
                      }}
                    >
                      MEMBRO ATIVO
                    </span>
                    <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "28px", margin: "16px 0 0 0", fontWeight: "700" }}>
                      {planName}
                    </Text>
                  </div>
                  <StarIcon size={24} color={primary} />
                </div>

                <div style={{ borderLeft: `3px solid ${primary}`, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: text }}>
                    {planPrice} <span style={{ fontSize: "14px", fontWeight: "400", color: textMuted }}>/ mês</span>
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: textMuted }}>
                    Mock local enquanto shared-core funcional renasce por kit
                  </p>
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
                  <Button appearance="solid" tone="primary" size="md">
                    GERENCIAR ASSINATURA
                  </Button>
                  <Button appearance="outline" tone="neutral" size="md">
                    PAUSAR ASSINATURA
                  </Button>
                </div>

                <div>
                  <span style={{ fontSize: "13px", color: textMuted, textDecoration: "underline", cursor: "pointer" }}>
                    Cancelar assinatura
                  </span>
                </div>
              </Surface>

              {/* Benefícios do Seu Plano */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                <Text variant="caption" style={{ color: textMuted, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", borderBottom: `1px solid ${border}`, paddingBottom: "12px" }}>
                  Benefícios do seu plano
                </Text>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {benefitsList.map((benefit, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <CheckIcon size={18} color={primary} />
                      <span style={{ color: text, fontSize: "15px", fontWeight: "500" }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita: Minha Conta & Opções de Menu */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", borderLeft: `1px solid ${border}`, paddingLeft: "32px", width: "100%", boxSizing: "border-box" }}>
              <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "28px", margin: 0, fontWeight: "700", paddingBottom: "8px" }}>
                Minha conta
              </Text>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {accountMenuItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px 0",
                      borderBottom: `1px solid ${border}`,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {item.icon === "person" ? <UserIcon size={20} color={textMuted} /> : item.icon === "truck" ? <TruckIcon size={20} color={textMuted} /> : <SettingsIcon size={20} color={textMuted} />}
                      <span style={{ color: text, fontSize: "16px", fontWeight: "500" }}>
                        {item.label}
                      </span>
                    </div>
                    <ChevronRightIcon size={18} color={textMuted} />
                  </div>
                ))}

                {/* Botão de Sair */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "24px 0",
                    marginTop: "16px",
                    cursor: "pointer"
                  }}
                >
                  <LogoutIcon size={20} color="#EF4444" />
                  <span style={{ color: "#EF4444", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Sair da conta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
