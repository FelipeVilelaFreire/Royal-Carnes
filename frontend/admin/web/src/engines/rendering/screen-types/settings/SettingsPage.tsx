import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Card } from "@foundation/ui/web/Card";
import { DataField } from "@foundation/ui/web/DataField";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { SegmentedControl } from "@foundation/ui/web/SegmentedControl";
import { Text } from "@foundation/ui/web/Text";
import { useAdminI18n } from "@/locales/i18n";
import { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";

export interface SettingsPageProps {
  config?: typeof settingsConfig;
}

type SettingsTab = NonNullable<typeof settingsConfig.tabs>[number];
type SettingsField = SettingsTab["sections"][number]["fields"][number] & {
  layout?: "default" | "full";
  statusTone?: "success" | "warning" | "neutral" | "primary";
};

function resolveFieldValue(field: SettingsField, t: (key: string, fallback?: string) => string): string {
  if ("valueKey" in field && field.valueKey) return t(field.valueKey, field.valueKey);
  return "value" in field ? String(field.value || "") : "";
}

function resolveBadgeTone(field: SettingsField): "success" | "warning" | "neutral" | "primary" {
  return field.statusTone || "neutral";
}

function resolveFieldSpan(field: SettingsField) {
  return field.layout === "full" ? "full" : 1;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config = settingsConfig }) => {
  const { t } = useAdminI18n();
  const tabs = config.tabs || [];
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || "");
  const selectedTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="start" className={styles.header} justify="between" wrap>
            <Stack gap="xs">
              <Stack className={styles.titleLine} gap="2xs">
                <Text as="h1" variant="h1">
                  {t(config.titleKey)}
                </Text>
              </Stack>
              <Text tone="muted" variant="body">
                {t(config.subtitleKey)}
              </Text>
            </Stack>
            <Badge appearance="soft" indicator tone="primary">
              {t(config.readOnlyBadgeKey)}
            </Badge>
          </Inline>

          <Stack className={styles.tabbedContent} gap="2xs">
            <SegmentedControl
              items={tabs.map((tab) => ({
                key: tab.id,
                label: t(tab.labelKey, tab.id),
              }))}
              level="md"
              onChange={setActiveTab}
              value={selectedTab?.id}
              variant="underline"
              width="full"
            />

            <Card className={styles.settingsCard} size="lg">
              <Stack className={styles.settingsSections} gap="xl">
                {(selectedTab?.sections || []).map((section) => (
                  <Stack className={styles.settingsSection} gap="lg" key={section.key}>
                    <Stack className={styles.sectionHeading} gap="2xs">
                      <Text as="h2" variant="h3">
                        {t(section.titleKey, section.key)}
                      </Text>
                      <Text tone="muted" variant="body">
                        {t(section.descriptionKey, "")}
                      </Text>
                    </Stack>

                    <FieldGrid className={styles.settingsGrid} columns={2} density="comfortable" gap="lg">
                      {section.fields.map((field) => (
                        <FieldGridItem key={field.key} span={resolveFieldSpan(field)}>
                          <DataField
                            className={styles.settingField}
                            label={t(field.labelKey, field.key)}
                            level="sm"
                            value={(
                              <Inline align="center" className={styles.fieldValue} gap="sm" wrap>
                                <Text as="span" variant="body" weight="semibold">
                                  {resolveFieldValue(field, t)}
                                </Text>
                                {field.statusKey ? (
                                  <Badge appearance="soft" tone={resolveBadgeTone(field)}>
                                    {t(field.statusKey)}
                                  </Badge>
                                ) : null}
                              </Inline>
                            )}
                          />
                        </FieldGridItem>
                      ))}
                    </FieldGrid>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </SectionContainer>
    </div>
  );
};
