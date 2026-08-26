import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { trashConfig } from "@/manifests/pages/trash.config";
import { TrashIcon } from "@foundation/ui/Icon/AppIcons";

export interface TrashPageProps {
  config?: typeof trashConfig;
}

export const TrashPage: React.FC<TrashPageProps> = ({ config = trashConfig }) => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;

  const items = config?.items || [];

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TrashIcon size={32} color={primary} />
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                {adminPtBR.lixeira.title}
              </Text>
            </div>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              {adminPtBR.lixeira.subtitle}
            </Text>
          </div>

          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxSizing: "border-box"
            }}
          >
            {items.length === 0 ? (
              <div style={{ textAlign: "center", color: textMuted, padding: "32px 0", fontSize: "15px" }}>
                {adminPtBR.lixeira.emptyText}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.lixeira.tableHeaders.title}
                      </th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.lixeira.tableHeaders.type}
                      </th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.lixeira.tableHeaders.deletedBy}
                      </th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.lixeira.tableHeaders.deletedAt}
                      </th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.lixeira.tableHeaders.retention}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${border}` }}>
                        <td style={{ padding: "16px", color: text, fontWeight: "600", fontSize: "14px" }}>{item.title}</td>
                        <td style={{ padding: "16px", color: primary, fontSize: "13px", fontWeight: "700" }}>{item.entityType}</td>
                        <td style={{ padding: "16px", color: textMuted, fontSize: "13px" }}>{item.deletedBy}</td>
                        <td style={{ padding: "16px", color: textMuted, fontSize: "13px" }}>{item.deletedAt}</td>
                        <td style={{ padding: "16px", color: "#F59E0B", fontSize: "13px", fontWeight: "600" }}>
                          {item.daysRemaining} dias restantes
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
