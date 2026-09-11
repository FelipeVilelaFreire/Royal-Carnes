import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { SegmentedControl } from "@foundation/ui/web/SegmentedControl";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { CheckIcon, SettingsIcon } from "@foundation/ui/web/Icon/AppIcons";
import { adminPtBR } from "@/locales/pt-BR";
import { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";

export interface SettingsPageProps {
  config?: typeof settingsConfig;
}

type SettingsTab = NonNullable<typeof settingsConfig.tabs>[number];
type SettingsField = SettingsTab["sections"][number]["fields"][number];

function readLocale(path: string, fallback = ""): string {
  return path.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, adminPtBR) as string || fallback || path;
}

function resolveFieldValue(field: SettingsField): string {
  if ("valueKey" in field && field.valueKey) return readLocale(field.valueKey, field.valueKey);
  return "value" in field ? String(field.value || "") : "";
}

function resolveBadgeTone(statusKey?: string): "success" | "warning" | "neutral" | "primary" {
  if (!statusKey) return "neutral";
  if (statusKey.endsWith(".review") || statusKey.endsWith(".pendingManifestSync")) return "warning";
  if (statusKey.endsWith(".connected") || statusKey.endsWith(".monitoring")) return "primary";
  return "success";
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config = settingsConfig }) => {
  const tabs = config.tabs || [];
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || "");
  const selectedTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="start" className={styles.header} justify="between" wrap>
            <Stack gap="xs">
              <Inline align="center" className={styles.titleLine} gap="sm" wrap={false}>
                <SettingsIcon aria-hidden="true" size={32} />
                <Text as="h1" variant="h1">
                  {readLocale(config.titleKey, adminPtBR.configuracoes.title)}
                </Text>
              </Inline>
              <Text tone="muted" variant="body">
                {readLocale(config.subtitleKey, adminPtBR.configuracoes.subtitle)}
              </Text>
            </Stack>

            <Inline align="center" gap="sm" wrap>
              {(config.actions || []).map((action) => (
                <Button
                  appearance={action.variant === "primary" ? "solid" : "outline"}
                  disabled={action.disabled}
                  icon={action.variant === "primary" ? <CheckIcon aria-hidden="true" /> : undefined}
                  key={action.key}
                  size="md"
                  tone="neutral"
                >
                  {readLocale(action.labelKey, action.key)}
                </Button>
              ))}
            </Inline>
          </Inline>

          <SegmentedControl
            items={tabs.map((tab) => ({
              key: tab.id,
              label: readLocale(tab.labelKey, tab.id),
            }))}
            onChange={setActiveTab}
            value={selectedTab?.id}
            width="content"
          />

          <Stack gap="lg">
            {(selectedTab?.sections || []).map((section) => (
              <Surface className={styles.surface} key={section.key}>
                <Inline align="start" justify="between" wrap>
                  <Stack className={styles.sectionHeading} gap="xs">
                    <Text as="h2" variant="h2">
                      {readLocale(section.titleKey, section.key)}
                    </Text>
                    <Text tone="muted" variant="body">
                      {readLocale(section.descriptionKey, "")}
                    </Text>
                  </Stack>
                  <Badge appearance="soft" tone="neutral">
                    {readLocale("configuracoes.badges.manifestReady")}
                  </Badge>
                </Inline>

                <div className={styles.settingList}>
                  {section.fields.map((field) => (
                    <div className={styles.settingItem} key={field.key}>
                      <Stack className={styles.settingText} gap="xs">
                        <Text as="span" className={styles.fieldLabel} tone="muted" variant="caption" weight="bold">
                          {readLocale(field.labelKey, field.key)}
                        </Text>
                        <Text as="strong" className={styles.fieldValue} variant="body" weight="semibold">
                          {resolveFieldValue(field)}
                        </Text>
                      </Stack>
                      <Badge appearance="soft" tone={resolveBadgeTone(field.statusKey)}>
                        {readLocale(field.statusKey || "configuracoes.status.active")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Surface>
            ))}
          </Stack>
        </Stack>
      </SectionContainer>
    </div>
  );
};
