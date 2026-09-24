import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { AdminScreenHeader } from "../../../../components/AdminScreenHeader/AdminScreenHeader";
import { Text } from "@foundation/ui/web/Text";
import { ArrowBackIcon, CheckIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import styles from "./AddPage.module.css";
import { AddPageFormField } from "./AddPageFormField";
import { AddPageSkeleton } from "./AddPageSkeleton";

export interface AddPageProps {
  entityName: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onFieldChange: (key: string, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  t: AdminTranslate;
  viewModel: AdminStandardFormViewModel;
}

export const AddPage: React.FC<AddPageProps> = ({
  entityName,
  isLoading = false,
  isSubmitting = false,
  onBack,
  onFieldChange,
  onSubmit,
  t,
  viewModel,
}) => {
  if (isLoading) return <AddPageSkeleton viewModel={viewModel} />;
  return (
    <div className={styles.page}>
      <AdminScreenHeader title={viewModel.titleKey ? t(viewModel.titleKey) : `${t("forms.addTitle")} ${entityName}`} />
      <SectionContainer atmosphere="transparent" headerSafety usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="center" className={styles.pageHeader} justify="between" wrap>
            <Inline align="center" gap="md" wrap>
              <Button
                aria-label={t("common.back")}
                appearance="transparent"
                icon={<ArrowBackIcon aria-hidden="true" />}
                iconPosition="only"
                onClick={onBack}
                size="sm"
                tone="neutral"
              >{t("common.back")}</Button>
            </Inline>
          </Inline>

          <Card className={styles.formCard} size="lg">
            <form className={styles.form} onSubmit={onSubmit}>
              <Stack className={styles.formSections} gap="sm">
                {(viewModel.sections.length ? viewModel.sections : [{ key: "default", fields: viewModel.fields }]).map((section) => (
                  <Stack className={styles.formSection} gap="md" key={section.key}>
                    {section.titleKey ? (
                      <Text as="h2" className={styles.sectionTitle} variant="h3">
                        {t(section.titleKey)}
                      </Text>
                    ) : null}

                    <FieldGrid className={styles.fieldGrid} columns={2} density="comfortable" gap="lg">
                      {section.fields.map((field) => (
                        <FieldGridItem key={field.key} span={field.layout === "full" ? "full" : 1}>
                          <AddPageFormField field={field} onFieldChange={onFieldChange} t={t} />
                        </FieldGridItem>
                      ))}
                    </FieldGrid>
                  </Stack>
                ))}
              </Stack>

              <Inline className={styles.formActions} gap="md" wrap>
                <Button appearance="solid" onClick={onBack} size="md" tone="neutral" type="button">
                  {t("common.cancel")}
                </Button>
                <Button className={styles.submitButton} appearance="glass" disabled={isSubmitting || !viewModel.canSubmit} icon={<CheckIcon aria-hidden="true" />} size="md" tone="primary" type="submit">
                  {isSubmitting ? t("standard.saving") : t(viewModel.submitLabelKey || "common.save")} {entityName}
                </Button>
              </Inline>
            </form>
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
