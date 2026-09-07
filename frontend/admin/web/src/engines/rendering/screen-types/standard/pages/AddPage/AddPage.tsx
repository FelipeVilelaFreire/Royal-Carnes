import React from "react";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Field } from "@foundation/ui/Field";
import { Input } from "@foundation/ui/Input";
import { Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Select } from "@foundation/ui/Select";
import { Text } from "@foundation/ui/Text";
import { TextArea } from "@foundation/ui/TextArea";
import { ArrowBackIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import styles from "./AddPage.module.css";

export interface AddPageProps {
  entityName: string;
  onBack: () => void;
  onFieldChange: (key: string, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  t: AdminTranslate;
  viewModel: AdminStandardFormViewModel;
}

export const AddPage: React.FC<AddPageProps> = ({
  entityName,
  onBack,
  onFieldChange,
  onSubmit,
  t,
  viewModel,
}) => {
  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="center" gap="md" wrap>
            <Button
              appearance="outline"
              icon={<ArrowBackIcon aria-hidden="true" />}
              onClick={onBack}
              size="sm"
              tone="neutral"
            >
              {t("common.back")}
            </Button>
            <Text as="h1" variant="h1">
              {t("forms.addTitle")} {entityName}
            </Text>
          </Inline>

          <Card className={styles.formCard} size="lg">
            <form className={styles.form} onSubmit={onSubmit}>
              {viewModel.fields.map((field) => {
                const label = t(field.labelKey, field.key);
                const placeholder = t("forms.typePlaceholderFor", "", { field: label.toLowerCase() }) ||
                  `${t("forms.typePlaceholder")} ${label.toLowerCase()}`;

                return (
                  <Field key={field.key} label={label} required={field.required}>
                    {field.type === "select" ? (
                      <Select
                        onChange={(event) => onFieldChange(field.key, event.target.value)}
                        options={[
                          { label: t("forms.selectOption"), value: "" },
                          ...(field.options || []).map((option) => ({
                            label: t(option.labelKey, option.value),
                            value: option.value,
                          })),
                        ]}
                        value={field.value || ""}
                      />
                    ) : field.type === "textarea" ? (
                      <TextArea
                        onChange={(event) => onFieldChange(field.key, event.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        value={field.value || ""}
                      />
                    ) : (
                      <Input
                        onChange={(event) => onFieldChange(field.key, event.target.value)}
                        placeholder={placeholder}
                        type="text"
                        value={field.value || ""}
                      />
                    )}
                  </Field>
                );
              })}

              <Inline className={styles.formActions} gap="md" wrap>
                <Button appearance="outline" onClick={onBack} size="md" tone="neutral" type="button">
                  {t("common.cancel")}
                </Button>
                <Button appearance="solid" size="md" tone="neutral" type="submit">
                  {t("common.save")} {entityName}
                </Button>
              </Inline>
            </form>
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
