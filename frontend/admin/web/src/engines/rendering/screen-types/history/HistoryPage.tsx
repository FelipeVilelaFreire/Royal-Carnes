import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";

export const HistoryPage: React.FC = () => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;

  const historyEvents = [
    { id: 1, title: "Envio de Lote de Setembro/2026", description: "Iniciado despacho de 480 caixas", actor: "Admin Master", severity: "success", date: "Hoje, 14:20" },
    { id: 2, title: "Alteração de Plano de Sócio", description: "Felipe S. alterou plano para Wagyu VIP", actor: "Sistema", severity: "info", date: "Ontem, 19:15" },
    { id: 3, title: "Alerta de Cadeia de Frio (-2°C)", description: "Temperatura verificada no sensor #2", actor: "Sensor IOT", severity: "warning", date: "22/08/2026" }
  ];

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
              Histórico & Auditoria do Sistema
            </Text>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              Registro imutável de eventos de despacho, auditoria e alterações da plataforma.
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
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Evento</th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Descrição</th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Autor</th>
                    <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {historyEvents.map((event) => (
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
