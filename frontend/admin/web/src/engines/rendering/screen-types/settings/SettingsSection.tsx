import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Card } from "@foundation/ui/web/Card";
import { DataField } from "@foundation/ui/web/DataField";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { settingsConfig } from "@/manifest/pages/settings.config";
import styles from "./SettingsPage.module.css";

type SettingsTab = NonNullable<typeof settingsConfig.tabs>[number];
type SettingsField = SettingsTab["sections"][number]["fields"][number] & { layout?: "default" | "full"; statusTone?: "success" | "warning" | "neutral" | "primary"; };
const valueFor = (field: SettingsField, t: (key: string, fallback?: string) => string) => "valueKey" in field && field.valueKey ? t(field.valueKey, field.valueKey) : "value" in field ? String(field.value || "") : "";

export const SettingsSection: React.FC<{ section: SettingsTab["sections"][number]; t: (key: string, fallback?: string) => string }> = ({ section, t }) => (
  <Card className={styles.settingsSection} size="md">
    <Stack gap="lg">
      <Stack className={styles.sectionHeading} gap="2xs">
        <Text as="h2" variant="h3">{t(section.titleKey, section.key)}</Text>
        <Text tone="muted" variant="body">{t(section.descriptionKey, "")}</Text>
      </Stack>
      <FieldGrid className={styles.settingsGrid} columns={section.grid.columns} density={section.grid.density} gap={section.grid.gap}>
        {section.fields.map((field) => (
          <FieldGridItem className={styles.fieldItem} key={field.key} span={(field as SettingsField).layout === "full" ? "full" : 1}>
            <DataField
              className={styles.settingField}
              label={t(field.labelKey, field.key)}
              level="sm"
              value={(
                <Inline align="center" className={styles.fieldValue} gap="sm" wrap>
                  <Text as="span" tone="text" variant="body" weight="semibold">{valueFor(field as SettingsField, t)}</Text>
                  {field.statusKey ? <Badge appearance="soft" tone={(field as SettingsField).statusTone || "neutral"}>{t(field.statusKey)}</Badge> : null}
                </Inline>
              )}
            />
          </FieldGridItem>
        ))}
      </FieldGrid>
    </Stack>
  </Card>
);
