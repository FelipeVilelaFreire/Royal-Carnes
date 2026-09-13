import React from "react";
import { AssetPicker } from "@foundation/ui/web/AssetPicker";
import { Card } from "@foundation/ui/web/Card";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { DataField } from "@foundation/ui/web/DataField";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Stack } from "@foundation/ui/web/Layout";
import { Input } from "@foundation/ui/web/Input";
import { MultiSelect } from "@foundation/ui/web/MultiSelect";
import { Select } from "@foundation/ui/web/Select";
import { Text } from "@foundation/ui/web/Text";
import { TextArea } from "@foundation/ui/web/TextArea";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel, AdminStandardLineItemColumnViewModel, AdminStandardRelatedListColumnViewModel } from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import { RelatedList } from "../../components/RelatedList";
import { DetailSectionCard } from "./DetailSectionCard";
import styles from "./DetailPage.module.css";

type DetailEntry = AdminStandardDetailViewModel["entries"][number];

interface DetailContentCardProps {
  formValues: Record<string, any>;
  isEditing: boolean;
  onFieldChange?: (key: string, value: any) => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}

function resolveDisplayValue(entry: DetailEntry, t: AdminTranslate): string {
  if (entry.valueType === "optionLabel") {
    const option = entry.options?.find((candidate) => String(candidate.value) === String(entry.rawValue));
    return option?.label || t(option?.labelKey || "", entry.value);
  }
  return entry.valueType === "translationKey" ? t(entry.value, "") : entry.value;
}

function renderEditableValue(entry: DetailEntry, formValues: Record<string, any>, onFieldChange: DetailContentCardProps["onFieldChange"], t: AdminTranslate) {
  if (entry.type === "asset") return <AssetPicker cancelRemoveLabel={t("common.cancel")} chooseFileLabel={t("forms.assetChooseFile")} confirmRemoveDescription={t("forms.confirmRemoveImageDescription")} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveImageTitle")} dropzoneLabel={t("forms.assetDropzone")} onChange={(value) => onFieldChange?.(entry.key, value)} previewAlt={t(entry.labelKey, entry.key)} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={t("forms.assetRemove")} urlPlaceholder={t("forms.assetUrlPlaceholder")} value={formValues[entry.key] ?? entry.rawValue ?? ""} />;
  if (entry.type === "lineItems") return <LineItemsEditor addLabel={t(entry.addLabelKey || "forms.addLineItem")} columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]} emptyLabel={t("forms.emptyLineItems")} onChange={(value) => onFieldChange?.(entry.key, value)} removeLabel={t("forms.removeLineItem")} t={t} value={Array.isArray(formValues[entry.key]) ? formValues[entry.key] : []} />;
  if (entry.type === "multiSelect") return <MultiSelect cancelRemoveLabel={t("common.cancel")} confirmRemoveDescription={(option) => t("forms.confirmRemoveSelectedOptionDescription", "", { option })} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveSelectedOptionTitle")} emptyOptionLabel={t("forms.selectOption")} onChange={(value) => onFieldChange?.(entry.key, value)} options={(entry.options || []).map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value }))} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={(option) => t("forms.removeSelectedOption", "", { option })} value={Array.isArray(formValues[entry.key]) ? formValues[entry.key].map(String) : []} />;
  if (entry.type === "select") return <Select onChange={(event) => onFieldChange?.(entry.key, event.target.value)} options={(entry.options || []).map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value }))} value={String(formValues[entry.key] ?? entry.rawValue ?? "")} />;
  if (entry.type === "currency") {
    const fieldValue = formValues[entry.key];
    const emptyValue = fieldValue === "" || fieldValue === null || (fieldValue === undefined && (entry.rawValue === null || entry.rawValue === undefined));
    return <CurrencyInput currency={entry.currency} locale={entry.locale} onChange={(value) => onFieldChange?.(entry.key, value)} value={emptyValue ? null : Number(fieldValue ?? entry.rawValue)} />;
  }
  if (entry.type === "textarea") return <TextArea onChange={(event) => onFieldChange?.(entry.key, event.target.value)} rows={4} value={String(formValues[entry.key] ?? entry.rawValue ?? "")} />;
  return <Input onChange={(event) => onFieldChange?.(entry.key, event.target.value)} type={entry.type === "number" ? "number" : entry.type === "datetime" ? "datetime-local" : "text"} value={String(formValues[entry.key] ?? entry.rawValue ?? "")} />;
}

function renderReadonlyValue(entry: DetailEntry, onFieldChange: DetailContentCardProps["onFieldChange"], t: AdminTranslate, viewModel: AdminStandardDetailViewModel) {
  if (entry.type === "lineItems") return <LineItemsEditor addLabel={t(entry.addLabelKey || "forms.addLineItem")} columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]} emptyLabel={t(viewModel.emptyKey || "forms.emptyLineItems")} onChange={(value) => onFieldChange?.(entry.key, value)} readOnly removeLabel={t("forms.removeLineItem")} t={t} value={Array.isArray(entry.rawValue) ? entry.rawValue : []} />;
  if (entry.type === "relatedList") return <RelatedList columns={(entry.columns || []) as AdminStandardRelatedListColumnViewModel[]} emptyLabel={t(viewModel.emptyKey || "details.emptySummary")} rows={Array.isArray(entry.rawValue) ? entry.rawValue : []} t={t} />;
  if (entry.type === "asset" && entry.value) return <img alt={viewModel.displayName} className={styles.assetPreview} src={entry.value} />;
  return resolveDisplayValue(entry, t);
}

function renderFieldValue(entry: DetailEntry, props: DetailContentCardProps) {
  const value = props.isEditing && entry.editable
    ? renderEditableValue(entry, props.formValues, props.onFieldChange, props.t)
    : renderReadonlyValue(entry, props.onFieldChange, props.t, props.viewModel);
  return typeof value === "string" ? <Text as="span" tone="muted" variant="caption" weight="semibold">{value}</Text> : value;
}

export const DetailContentCard: React.FC<DetailContentCardProps> = (props) => {
  const { t, viewModel } = props;
  const sections = viewModel.sections.length ? viewModel.sections : [{ entries: viewModel.entries, key: "default" }];
  return (
    <Card className={styles.detailCard} size="lg">
      {viewModel.entries.length ? (
        <Stack className={styles.detailSections} gap="xl">
          {sections.map((section) => (
            <DetailSectionCard key={section.key} section={section} t={t}>
                <FieldGrid className={styles.detailGrid} columns={section.entries.length === 1 ? 1 : 2} density="comfortable" gap="lg">
                  {section.entries.map((entry) => (
                    <FieldGridItem key={entry.key} span={entry.layout === "full" ? "full" : 1}>
                      <DataField className={styles.detailField} label={<Text as="span" variant="body" weight="bold">{t(entry.labelKey, entry.key)}</Text>} level="sm" valueWeight={entry.type === "currency" ? "bold" : "semibold"} value={renderFieldValue(entry, props)} />
                    </FieldGridItem>
                  ))}
                </FieldGrid>
            </DetailSectionCard>
          ))}
        </Stack>
      ) : <Text tone="muted" variant="body">{t(viewModel.emptyKey || "details.emptySummary")}</Text>}
    </Card>
  );
};
