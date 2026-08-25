import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { TrashIcon } from "@foundation/ui/Icon/AppIcons";

export const TrashPage: React.FC = () => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TrashIcon size={32} color={primary} />
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                Lixeira do Sistema
              </Text>
            </div>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              Itens removidos recentemente com retenção temporária de 30 dias para recuperação.
            </Text>
          </div>

          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
              color: textMuted,
              fontSize: "15px"
            }}
          >
            Nenhum item na lixeira.
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
