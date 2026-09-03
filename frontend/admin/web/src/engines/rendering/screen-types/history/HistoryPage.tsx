import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { historyConfig } from "@/manifest/pages/history.config";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";

export interface HistoryPageProps {
  config?: typeof historyConfig;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ config = historyConfig }) => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;

  const events = config?.events || [];

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
              {adminPtBR.historico.title}
            </Text>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              {adminPtBR.historico.subtitle}
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
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {adminPtBR.historico.tableHeaders.event}
                    </th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {adminPtBR.historico.tableHeaders.description}
                    </th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {adminPtBR.historico.tableHeaders.actor}
                    </th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {adminPtBR.historico.tableHeaders.date}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: "16px", color: primary, fontWeight: "700", fontSize: "14px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <CheckIcon size={16} color={primary} /> {event.title}
                        </span>
                      </td>
                      <td style={{ padding: "16px", color: text, fontSize: "14px" }}>{event.description}</td>
                      <td style={{ padding: "16px", color: textMuted, fontSize: "13px" }}>{event.actor}</td>
                      <td style={{ padding: "16px", color: textMuted, fontSize: "13px" }}>{event.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
