import React from "react";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Text } from "@foundation/ui/Text";
import { landingPageConfig } from "@/manifest/landing/pages/landing.config";
import { clientPtBR } from "@/locales/pt-BR";
import { clientThemeManifest } from "@/manifest/theme.manifest";

export const HomeView: React.FC = () => {
  const palette = clientThemeManifest.colors;

  return (
    <div style={{ width: "100%", padding: "32px", boxSizing: "border-box" }}>
      <Text variant="h1" style={{ color: palette.primary, marginBottom: "16px" }}>
        {landingPageConfig.hero.title}
      </Text>
      <Text variant="body" style={{ color: palette.textMuted || palette.text, marginBottom: "24px" }}>
        {landingPageConfig.hero.subtitle}
      </Text>
      <Card style={{ padding: "24px", maxWidth: "400px" }}>
        <Text variant="h3" style={{ marginBottom: "12px" }}>
          {clientPtBR.brand.name}
        </Text>
        <Button appearance="solid" tone="primary">
          {landingPageConfig.hero.ctaPlans}
        </Button>
      </Card>
    </div>
  );
};
