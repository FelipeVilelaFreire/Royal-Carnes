import React from "react";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import type { AdminStandardDetailFieldsSectionViewModel } from "@/view-models/standard.view-model";
import { DetailDataFieldSkeleton } from "../DetailDataFieldSkeleton";
import { DetailSectionCardSkeleton } from "../DetailSectionCardSkeleton";
import styles from "../DetailPageSkeleton.module.css";

export const DetailFieldsSectionSkeleton: React.FC<{ section: AdminStandardDetailFieldsSectionViewModel }> = ({ section }) => (
  <DetailSectionCardSkeleton hasTitle={Boolean(section.titleKey)}>
    <FieldGrid className={styles.detailGrid} columns={section.grid?.desktop || 4} density="regular" gap="lg" responsiveColumns={section.grid}>
      {section.entries.map((entry) => (
        <FieldGridItem key={entry.key} span={entry.span || 1}>
          <DetailDataFieldSkeleton valueWidth={entry.span === "full" ? "full" : "md"} />
        </FieldGridItem>
      ))}
    </FieldGrid>
  </DetailSectionCardSkeleton>
);
