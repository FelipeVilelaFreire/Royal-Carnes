import React from "react";
import { AssetPicker } from "@foundation/ui/web/AssetPicker";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { Stack } from "@foundation/ui/web/Layout";
import { FormattedInput, formatFormattedInputValue } from "@foundation/ui/web/FormattedInput";
import { MultiSelect } from "@foundation/ui/web/MultiSelect";
import { Text } from "@foundation/ui/web/Text";
import { TextArea } from "@foundation/ui/web/TextArea";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel, AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import { DetailFieldsSection } from "./sections/DetailFieldsSection";
import { DetailLineItemsSection } from "./sections/DetailLineItemsSection";
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
  const value = entry.valueType === "translationKey" ? t(entry.value, "") : entry.value;
  return entry.format ? formatFormattedInputValue(value, entry.format) : value;
}

function resolveEditableOptions(entry: DetailEntry) {
  const options = entry.options || [];
  if (!entry.transitionOnly) return options;
  const currentValue = String(entry.rawValue ?? "");
  const currentOption = options.find((option) => option.value === currentValue);
  const allowedNextKeys = Array.isArray(currentOption?.meta?.allowedNextKeys)
    ? currentOption.meta.allowedNextKeys.map(String)
    : [];
  return options.filter((option) => option.value === currentValue || allowedNextKeys.includes(option.value));
}

function renderEditableValue(entry: DetailEntry, formValues: Record<string, any>, onFieldChange: DetailContentCardProps["onFieldChange"], t: AdminTranslate, disabled = false) {
  const editType = entry.editType || entry.type;
  if (editType === "asset") return <AssetPicker cancelRemoveLabel={t("common.cancel")} chooseFileLabel={t("forms.assetChooseFile")} confirmRemoveDescription={t("forms.confirmRemoveImageDescription")} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveImageTitle")} disabled={disabled} dropzoneLabel={t("forms.assetDropzone")} onChange={(value) => onFieldChange?.(entry.key, value)} previewAlt={t(entry.labelKey, entry.key)} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={t("forms.assetRemove")} urlPlaceholder={t("forms.assetUrlPlaceholder")} value={formValues[entry.key] ?? entry.rawValue ?? ""} />;
  if (editType === "lineItems") return <LineItemsEditor addLabel={t(entry.addLabelKey || "forms.addLineItem")} columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]} emptyLabel={t("forms.emptyLineItems")} hierarchy={entry.hierarchy} onChange={(value) => onFieldChange?.(entry.key, value)} readOnly={disabled} removeLabel={t("forms.removeLineItem")} t={t} value={Array.isArray(formValues[entry.key]) ? formValues[entry.key] : Array.isArray(entry.rawValue) ? entry.rawValue : []} />;
  if (editType === "multiSelect") return <MultiSelect cancelRemoveLabel={t("common.cancel")} confirmRemoveDescription={(option) => t("forms.confirmRemoveSelectedOptionDescription", "", { option })} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveSelectedOptionTitle")} disabled={disabled} emptyOptionLabel={t("forms.selectOption")} emptySearchLabel={entry.searchEmptyKey ? t(entry.searchEmptyKey) : undefined} onChange={(value) => onFieldChange?.(entry.key, value)} optionPresentation={entry.optionPresentation} options={(entry.options || []).map((option) => ({ description: typeof option.meta?.description === "string" ? option.meta.description : undefined, imageAlt: typeof option.meta?.imageAlt === "string" ? option.meta.imageAlt : undefined, imageSrc: typeof option.meta?.imageSrc === "string" ? option.meta.imageSrc : undefined, label: option.label || t(option.labelKey || "", option.value), value: option.value }))} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={(option) => t("forms.removeSelectedOption", "", { option })} searchable={entry.searchable} searchPlaceholder={entry.searchPlaceholderKey ? t(entry.searchPlaceholderKey) : undefined} value={Array.isArray(formValues[entry.key]) ? formValues[entry.key].map(String) : Array.isArray(entry.rawValue) ? entry.rawValue.map(String) : []} />;
  if (editType === "select") return <DropdownPicker ariaLabel={t(entry.labelKey, entry.key)} disabled={disabled} onChange={(value) => onFieldChange?.(entry.key, value)} options={resolveEditableOptions(entry).map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value }))} value={String(formValues[entry.key] ?? entry.rawValue ?? "")} />;
  if (editType === "currency") {
    const fieldValue = formValues[entry.key];
    const emptyValue = fieldValue === "" || fieldValue === null || (fieldValue === undefined && (entry.rawValue === null || entry.rawValue === undefined));
    return <CurrencyInput currency={entry.currency} disabled={disabled} locale={entry.locale} onChange={(value) => onFieldChange?.(entry.key, value)} value={emptyValue ? null : Number(fieldValue ?? entry.rawValue)} />;
  }
  if (editType === "textarea") return <TextArea disabled={disabled} onChange={(event) => onFieldChange?.(entry.key, event.target.value)} rows={4} value={String(formValues[entry.key] ?? entry.rawValue ?? "")} />;
  return <FormattedInput disabled={disabled} format={entry.format} max={entry.max} min={entry.min} onValueChange={(value) => onFieldChange?.(entry.key, value)} suffix={entry.suffixKey ? t(entry.suffixKey) : undefined} type={editType === "number" ? "number" : editType === "date" ? "date" : editType === "datetime" ? "datetime-local" : "text"} value={String(disabled ? resolveDisplayValue(entry, t) : formValues[entry.key] ?? entry.rawValue ?? "")} />;
}

function renderReadonlyValue(entry: DetailEntry, onFieldChange: DetailContentCardProps["onFieldChange"], t: AdminTranslate, viewModel: AdminStandardDetailViewModel) {
  if (entry.type === "lineItems") return <LineItemsEditor addLabel={t(entry.addLabelKey || "forms.addLineItem")} columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]} emptyLabel={t(viewModel.emptyKey || "forms.emptyLineItems")} hierarchy={entry.hierarchy} onChange={(value) => onFieldChange?.(entry.key, value)} readOnly removeLabel={t("forms.removeLineItem")} t={t} value={Array.isArray(entry.value) ? entry.value : []} />;
  if (entry.type === "asset" && entry.value) return <img alt={viewModel.displayName} className={styles.assetPreview} src={entry.value} />;
  return resolveDisplayValue(entry, t);
}

function renderFieldValue(entry: DetailEntry, props: DetailContentCardProps) {
  const value = props.isEditing
    ? renderEditableValue(entry, props.formValues, props.onFieldChange, props.t, !entry.editable)
    : renderReadonlyValue(entry, props.onFieldChange, props.t, props.viewModel);
  return typeof value === "string" ? <Text as="span" className={styles.detailFieldValue} tone="default" variant="body" weight="semibold">{value}</Text> : value;
}

export const DetailContentCard: React.FC<DetailContentCardProps> = (props) => {
  const { t, viewModel } = props;
  const sections = viewModel.sections.length ? viewModel.sections : [{ entries: viewModel.entries, key: "default" }];
  const defaultGrid = { desktop: 4 as const, tablet: 2 as const, mobile: 1 as const };
  return (
    <div className={styles.detailCard}>
      {viewModel.entries.length ? (
        <Stack className={styles.detailSections} gap="xl">
          {sections.map((section) => (
            section.type === "lineItems" ? (
              <DetailLineItemsSection key={section.key} renderEntry={(entry) => renderFieldValue(entry, props)} section={section} t={t} />
            ) : (
              <DetailFieldsSection defaultGrid={defaultGrid} key={section.key} renderEntry={(entry) => renderFieldValue(entry, props)} section={section} t={t} />
            )
          ))}
        </Stack>
      ) : <Text tone="muted" variant="body">{t(viewModel.emptyKey || "details.emptySummary")}</Text>}
    </div>
  );
};
