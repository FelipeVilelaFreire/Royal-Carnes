import React from "react";
import { AssetPicker } from "@foundation/ui/AssetPicker";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { CurrencyInput } from "@foundation/ui/CurrencyInput";
import { Field } from "@foundation/ui/Field";
import { FieldGrid, FieldGridItem } from "@foundation/ui/FieldGrid";
import { Input } from "@foundation/ui/Input";
import { Inline, Stack } from "@foundation/ui/Layout";
import { MultiSelect } from "@foundation/ui/MultiSelect";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Select } from "@foundation/ui/Select";
import { Text } from "@foundation/ui/Text";
import { TextArea } from "@foundation/ui/TextArea";
import { ArrowBackIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import styles from "./AddPage.module.css";

type FormField = AdminStandardFormViewModel["fields"][number];

export interface AddPageProps {
  entityName: string;
  isSubmitting?: boolean;
  onBack: () => void;
  onFieldChange: (key: string, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  t: AdminTranslate;
  viewModel: AdminStandardFormViewModel;
}

function renderFormField(
  field: FormField,
  onFieldChange: AddPageProps["onFieldChange"],
  t: AdminTranslate,
) {
  const label = t(field.labelKey, field.key);
  const placeholder = field.placeholderKey
    ? t(field.placeholderKey)
    : t("forms.typePlaceholderFor", "", { field: label.toLowerCase() }) ||
      `${t("forms.typePlaceholder")} ${label.toLowerCase()}`;

  return (
    <Field description={field.helperKey ? t(field.helperKey) : undefined} label={label} required={field.required}>
      {field.type === "asset" ? (
        <AssetPicker
          cancelRemoveLabel={t("common.cancel")}
          chooseFileLabel={t("forms.assetChooseFile")}
          confirmRemoveDescription={t("forms.confirmRemoveImageDescription")}
          confirmRemoveLabel={t("forms.confirmRemoveAction")}
          confirmRemoveTitle={t("forms.confirmRemoveImageTitle")}
          dropzoneLabel={t("forms.assetDropzone")}
          onChange={(value) => onFieldChange(field.key, value)}
          previewAlt={label}
          removeModalCloseLabel={t("forms.closeConfirmation")}
          removeLabel={t("forms.assetRemove")}
          urlPlaceholder={t("forms.assetUrlPlaceholder")}
          value={field.value}
        />
      ) : field.type === "lineItems" ? (
        <LineItemsEditor
          addLabel={t(field.addLabelKey || "forms.addLineItem")}
          columns={field.columns || []}
          emptyLabel={t("forms.emptyLineItems")}
          onChange={(value) => onFieldChange(field.key, value)}
          removeLabel={t("forms.removeLineItem")}
          t={t}
          value={Array.isArray(field.value) ? field.value : []}
        />
      ) : field.type === "multiSelect" ? (
        <MultiSelect
          cancelRemoveLabel={t("common.cancel")}
          confirmRemoveDescription={(option) => t("forms.confirmRemoveSelectedOptionDescription", "", { option })}
          confirmRemoveLabel={t("forms.confirmRemoveAction")}
          confirmRemoveTitle={t("forms.confirmRemoveSelectedOptionTitle")}
          emptyOptionLabel={t("forms.selectOption")}
          onChange={(value) => onFieldChange(field.key, value)}
          options={(field.options || []).map((option) => ({
            label: option.label || t(option.labelKey || "", option.value),
            value: option.value,
          }))}
          removeModalCloseLabel={t("forms.closeConfirmation")}
          removeLabel={(option) => t("forms.removeSelectedOption", "", { option })}
          value={Array.isArray(field.value) ? field.value.map(String) : []}
        />
      ) : field.type === "select" ? (
        <Select
          onChange={(event) => onFieldChange(field.key, event.target.value)}
          options={[
            { label: t("forms.selectOption"), value: "" },
            ...(field.options || []).map((option) => ({
              label: option.label || t(option.labelKey || "", option.value),
              value: option.value,
            })),
          ]}
          value={field.value || ""}
        />
      ) : field.type === "currency" ? (
        <CurrencyInput
          currency={field.currency}
          locale={field.locale}
          onChange={(value) => onFieldChange(field.key, value)}
          placeholder={placeholder}
          value={field.value === "" || field.value === null || field.value === undefined ? null : Number(field.value)}
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
          type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"}
          value={field.value || ""}
        />
      )}
    </Field>
  );
}

export const AddPage: React.FC<AddPageProps> = ({
  entityName,
  isSubmitting = false,
  onBack,
  onFieldChange,
  onSubmit,
  t,
  viewModel,
}) => {
  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
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
              {viewModel.titleKey ? t(viewModel.titleKey) : `${t("forms.addTitle")} ${entityName}`}
            </Text>
          </Inline>

          <Card className={styles.formCard} size="lg">
            <form className={styles.form} onSubmit={onSubmit}>
              <Stack gap="lg">
                {(viewModel.sections.length ? viewModel.sections : [{ key: "default", fields: viewModel.fields }]).map((section) => (
                  <Stack className={styles.formSection} gap="md" key={section.key}>
                    {section.titleKey ? (
                      <Text as="h2" variant="h3">
                        {t(section.titleKey)}
                      </Text>
                    ) : null}

                    <FieldGrid columns="auto" gap="md">
                      {section.fields.map((field) => (
                        <FieldGridItem key={field.key} span={field.layout === "full" ? "full" : 1}>
                          {renderFormField(field, onFieldChange, t)}
                        </FieldGridItem>
                      ))}
                    </FieldGrid>
                  </Stack>
                ))}
              </Stack>

              <Inline className={styles.formActions} gap="md" wrap>
                <Button appearance="outline" onClick={onBack} size="md" tone="neutral" type="button">
                  {t("common.cancel")}
                </Button>
                <Button appearance="solid" disabled={isSubmitting || !viewModel.canSubmit} size="md" tone="neutral" type="submit">
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
