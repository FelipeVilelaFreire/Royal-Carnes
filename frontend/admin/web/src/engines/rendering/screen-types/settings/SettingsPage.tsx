import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { CartIcon, SettingsIcon, TruckIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Text } from "@foundation/ui/web/Text";
import { useAdminI18n } from "@/locales/i18n";
import { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsSection } from "./SettingsSection";

export interface SettingsPageProps {
  config?: typeof settingsConfig;
}

const tabIconByIntent = {
  commerce: CartIcon,
  frontend: SettingsIcon,
  operation: TruckIcon,
} as const;

export const SettingsPage: React.FC<SettingsPageProps> = ({ config = settingsConfig }) => {
  const { t } = useAdminI18n();
  const tabs = config.tabs || [];
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || "");
  const selectedTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={config.layout.usefulColumns} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <SettingsHeader config={config} t={t} />

          <div className={styles.settingsLayout} data-navigation={config.layout.navigation}>
            <aside aria-label={t(config.navigationLabelKey)} className={styles.settingsNavigation}>
              <Stack className={styles.navigationList} gap="xs">
                <Text className={styles.navigationLabel} tone="muted" variant="caption">{t(config.navigationLabelKey)}</Text>
                <div className={styles.navigationRail}>
                  <Stack className={styles.navigationItems} gap="2xs">
                    {tabs.map((tab) => {
                      const Icon = tabIconByIntent[tab.iconIntent as keyof typeof tabIconByIntent] || SettingsIcon;
                      const isActive = tab.id === selectedTab?.id;
                      return (
                        <Button aria-current={isActive ? "page" : undefined} appearance="transparent" className={styles.navigationButton} icon={<Icon aria-hidden="true" />} key={tab.id} onClick={() => setActiveTab(tab.id)} size="sm" tone={isActive ? "primary" : "neutral"}>
                          <Text as="span" tone="inherit" variant="body" weight="semibold">{t(tab.labelKey, tab.id)}</Text>
                        </Button>
                      );
                    })}
                  </Stack>
                </div>
              </Stack>
            </aside>

            <main className={styles.settingsContent}>
              <Stack gap="lg">
                <Stack className={styles.tabHeading} gap="2xs">
                  <Text as="h2" variant="h2">{selectedTab ? t(selectedTab.labelKey, selectedTab.id) : ""}</Text>
                  <Text tone="muted" variant="body">{selectedTab ? t(selectedTab.descriptionKey, "") : ""}</Text>
                </Stack>
                <Stack className={styles.settingsSections} gap="lg">
                  {(selectedTab?.sections || []).map((section) => <SettingsSection key={section.key} section={section} t={t} />)}
                </Stack>
              </Stack>
            </main>
          </div>
        </Stack>
      </SectionContainer>
    </div>
  );
};
