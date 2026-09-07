import React from "react";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { CheckIcon, SettingsIcon, SnowflakeIcon, StoreIcon } from "@foundation/ui/Icon/AppIcons";
import { adminPtBR } from "@/locales/pt-BR";
import { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";

export interface SettingsPageProps {
  config?: typeof settingsConfig;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config = settingsConfig }) => {
  const settingsData = config?.settings || {
    brandName: "ROYAL PRIME",
    recurrencyProvider: "Stripe Subscriptions",
    recurrencyStatus: "ativo",
    coldChainSensor: "Sensor IoT -2Â°C",
    coldChainStatus: "monitorando",
    fulfillmentWarehouse: "Central GastronÃ´mica SP-01",
  };

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Stack gap="xs">
            <Inline align="center" className={styles.titleLine} gap="sm" wrap={false}>
              <SettingsIcon aria-hidden="true" size={32} />
              <Text as="h1" variant="h1">
                {adminPtBR.configuracoes.title}
              </Text>
            </Inline>
            <Text tone="muted" variant="body">
              {adminPtBR.configuracoes.subtitle}
            </Text>
          </Stack>

          <Surface className={styles.surface}>
            <Text as="h2" variant="h2">
              {adminPtBR.configuracoes.sectionOperation}
            </Text>

            <Grid className={styles.settingsGrid} columns={4} gap="md">
              <div className={styles.settingCard}>
                <Text as="span" variant="body" weight="var(--theme--typography-bold)">
                  {adminPtBR.configuracoes.cards.brand}
                </Text>
                <Text as="span" tone="muted" variant="caption">
                  {settingsData.brandName}
                </Text>
              </div>

              <div className={styles.settingCard}>
                <Text as="span" variant="body" weight="var(--theme--typography-bold)">
                  {adminPtBR.configuracoes.cards.recurrency}
                </Text>
                <Inline align="center" className={styles.successValue} gap="xs" wrap={false}>
                  <CheckIcon aria-hidden="true" size={16} />
                  <Text as="span" variant="caption" weight="var(--theme--typography-semibold)">
                    {settingsData.recurrencyProvider} ({settingsData.recurrencyStatus})
                  </Text>
                </Inline>
              </div>

              <div className={styles.settingCard}>
                <Text as="span" variant="body" weight="var(--theme--typography-bold)">
                  {adminPtBR.configuracoes.cards.coldChain}
                </Text>
                <Inline align="center" className={styles.primaryValue} gap="xs" wrap={false}>
                  <SnowflakeIcon aria-hidden="true" size={16} />
                  <Text as="span" variant="caption" weight="var(--theme--typography-semibold)">
                    {settingsData.coldChainSensor} ({settingsData.coldChainStatus})
                  </Text>
                </Inline>
              </div>

              <div className={styles.settingCard}>
                <Text as="span" variant="body" weight="var(--theme--typography-bold)">
                  {adminPtBR.configuracoes.cards.warehouse}
                </Text>
                <Inline align="center" className={styles.mutedValue} gap="xs" wrap={false}>
                  <StoreIcon aria-hidden="true" size={16} />
                  <Text as="span" tone="muted" variant="caption">
                    {settingsData.fulfillmentWarehouse}
                  </Text>
                </Inline>
              </div>
            </Grid>
          </Surface>
        </Stack>
      </SectionContainer>
    </div>
  );
};
