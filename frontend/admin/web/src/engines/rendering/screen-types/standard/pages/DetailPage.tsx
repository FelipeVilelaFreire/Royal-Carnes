import React, { useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { AvatarCell } from "@foundation/ui/Avatar";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { EditIcon, ArrowBackIcon } from "@foundation/ui/Icon/AppIcons";

export interface DetailPageProps {
  entityName: string;
  row: Record<string, any>;
  onBack: () => void;
  onEdit?: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ entityName, row, onBack, onEdit }) => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;
  const [activeTab, setActiveTab] = useState<string>("summary");

  const tabs = [
    { id: "summary", label: adminPtBR.details.tabs.summary },
    { id: "specs", label: adminPtBR.details.tabs.specs },
    { id: "history", label: adminPtBR.details.tabs.history }
  ];

  const displayName = row.name || row.customerName || row.title || row.code || entityName;

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          {/* Header de Detalhes com AvatarCell Executivo */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Button appearance="outline" tone="neutral" size="sm" onClick={onBack}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ArrowBackIcon size={16} color={text} /> {adminPtBR.common.back}
                </span>
              </Button>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <AvatarCell size="lg" name={displayName} image={row.image} />
                <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "32px", margin: 0, fontWeight: "800" }}>
                  {displayName}
                </Text>
              </div>
            </div>

            {onEdit && (
              <Button appearance="solid" tone="primary" size="md" onClick={onEdit}>
                <EditIcon size={16} color="#0B0908" style={{ marginRight: "8px" }} /> {adminPtBR.common.edit} {entityName}
              </Button>
            )}
          </div>

          {/* Abas de Detalhes */}
          <div style={{ display: "flex", gap: "24px", borderBottom: `1px solid ${border}`, paddingBottom: "12px" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? `2px solid ${primary}` : "2px solid transparent",
                  color: activeTab === tab.id ? primary : textMuted,
                  fontSize: "14px",
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo da Aba */}
          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box"
            }}
          >
            {activeTab === "summary" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                {Object.entries(row).map(([k, v]) => (
                  <div key={k} style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                    <span style={{ fontSize: "12px", color: textMuted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>
                      {k}
                    </span>
                    <span style={{ fontSize: "16px", color: text, fontWeight: "600" }}>
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specs" && (
              <Text variant="body" style={{ color: textMuted, fontSize: "15px" }}>
                {adminPtBR.details.specsContent}
              </Text>
            )}

            {activeTab === "history" && (
              <Text variant="body" style={{ color: textMuted, fontSize: "15px" }}>
                {adminPtBR.details.historyContent}
              </Text>
            )}
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
