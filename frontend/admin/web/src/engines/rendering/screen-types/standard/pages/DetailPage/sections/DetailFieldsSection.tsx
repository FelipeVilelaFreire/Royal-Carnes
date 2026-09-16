import React from "react";
import { DataField } from "@foundation/ui/web/DataField";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Text } from "@foundation/ui/web/Text";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailEntryViewModel, AdminStandardDetailFieldsSectionViewModel } from "@/view-models/standard.view-model";
import { DetailSectionCard } from "../DetailSectionCard";
import styles from "../DetailPage.module.css";

interface DetailFieldsSectionProps {
  defaultGrid: { desktop: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; mobile: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; tablet: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; };
  renderEntry: (entry: AdminStandardDetailEntryViewModel) => React.ReactNode;
  section: AdminStandardDetailFieldsSectionViewModel;
  t: AdminTranslate;
}

export const DetailFieldsSection: React.FC<DetailFieldsSectionProps> = ({ defaultGrid, renderEntry, section, t }) => (
  <DetailSectionCard section={section} t={t}>
    <FieldGrid className={styles.detailGrid} columns={section.grid?.desktop || defaultGrid.desktop} density="regular" gap="lg" responsiveColumns={section.grid || defaultGrid}>
      {section.entries.map((entry) => (
        <FieldGridItem key={entry.key} span={entry.span || 1}>
          <DataField className={styles.detailField} label={<Text as="span" variant="body" weight="bold">{t(entry.labelKey, entry.key)}</Text>} level="sm" valueWeight={entry.type === "currency" ? "bold" : "semibold"} value={renderEntry(entry)} />
        </FieldGridItem>
      ))}
    </FieldGrid>
  </DetailSectionCard>
);
