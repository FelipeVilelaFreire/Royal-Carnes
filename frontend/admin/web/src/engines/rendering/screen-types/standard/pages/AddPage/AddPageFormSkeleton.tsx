import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import { AddPageFormFieldSkeleton } from "./AddPageFormFieldSkeleton";
import styles from "./AddPageSkeleton.module.css";

export const AddPageFormSkeleton: React.FC<{ viewModel: AdminStandardFormViewModel }> = ({ viewModel }) => {
  const sections = viewModel.sections.length ? viewModel.sections : [{ fields: viewModel.fields, key: "default" }];
  return (
    <Card className={styles.formCard} size="lg">
      <Stack className={styles.form} gap="2xl">
        {sections.map((section) => (
          <Stack className={styles.formSection} gap="md" key={section.key}>
            {section.titleKey ? <Skeleton shape="text" size="sm" width="md" /> : null}
            <FieldGrid className={styles.fieldGrid} columns={2} density="comfortable" gap="lg">
              {section.fields.map((field) => (
                <FieldGridItem key={field.key} span={field.layout === "full" ? "full" : 1}>
                  <AddPageFormFieldSkeleton field={field} />
                </FieldGridItem>
              ))}
            </FieldGrid>
          </Stack>
        ))}
        <Inline className={styles.formActions} gap="md" wrap>
          <ButtonSkeleton size="md" width="md" />
          <ButtonSkeleton size="md" width="md" />
        </Inline>
      </Stack>
    </Card>
  );
};
