import React from "react";
import { AssetPicker } from "@foundation/ui/web/AssetPicker";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { Field } from "@foundation/ui/web/Field";
import { Input } from "@foundation/ui/web/Input";
import { MultiSelect } from "@foundation/ui/web/MultiSelect";
import { Select } from "@foundation/ui/web/Select";
import { TextArea } from "@foundation/ui/web/TextArea";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import styles from "./AddPage.module.css";

type FormField = AdminStandardFormViewModel["fields"][number];

interface AddPageFormFieldProps { field: FormField; onFieldChange: (key: string, value: any) => void; t: AdminTranslate; }

export const AddPageFormField: React.FC<AddPageFormFieldProps> = ({ field, onFieldChange, t }) => {
  const fieldLabel = t(field.labelKey, field.key);
  const label = field.required ? <>{fieldLabel} <span aria-hidden className={styles.requiredMarker} /></> : fieldLabel;
  const placeholder = field.placeholderKey ? t(field.placeholderKey) : t("forms.typePlaceholderFor", "", { field: fieldLabel.toLowerCase() }) || `${t("forms.typePlaceholder")} ${fieldLabel.toLowerCase()}`;
  return <Field description={field.helperKey ? t(field.helperKey) : undefined} label={label}>{field.type === "asset" ? <AssetPicker cancelRemoveLabel={t("common.cancel")} chooseFileLabel={t("forms.assetChooseFile")} confirmRemoveDescription={t("forms.confirmRemoveImageDescription")} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveImageTitle")} dropzoneLabel={t("forms.assetDropzone")} onChange={(value) => onFieldChange(field.key, value)} previewAlt={fieldLabel} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={t("forms.assetRemove")} urlPlaceholder={t("forms.assetUrlPlaceholder")} value={field.value} /> : field.type === "lineItems" ? <LineItemsEditor addLabel={t(field.addLabelKey || "forms.addLineItem")} columns={field.columns || []} emptyLabel={t("forms.emptyLineItems")} onChange={(value) => onFieldChange(field.key, value)} removeLabel={t("forms.removeLineItem")} t={t} value={Array.isArray(field.value) ? field.value : []} /> : field.type === "multiSelect" ? <MultiSelect cancelRemoveLabel={t("common.cancel")} confirmRemoveDescription={(option) => t("forms.confirmRemoveSelectedOptionDescription", "", { option })} confirmRemoveLabel={t("forms.confirmRemoveAction")} confirmRemoveTitle={t("forms.confirmRemoveSelectedOptionTitle")} emptyOptionLabel={t("forms.selectOption")} onChange={(value) => onFieldChange(field.key, value)} options={(field.options || []).map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value }))} removeModalCloseLabel={t("forms.closeConfirmation")} removeLabel={(option) => t("forms.removeSelectedOption", "", { option })} value={Array.isArray(field.value) ? field.value.map(String) : []} /> : field.type === "select" ? <Select onChange={(event) => onFieldChange(field.key, event.target.value)} options={[{ label: t("forms.selectOption"), value: "" }, ...(field.options || []).map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value }))]} value={field.value || ""} /> : field.type === "currency" ? <CurrencyInput currency={field.currency} locale={field.locale} onChange={(value) => onFieldChange(field.key, value)} placeholder={placeholder} value={field.value === "" || field.value === null || field.value === undefined ? null : Number(field.value)} /> : field.type === "textarea" ? <TextArea onChange={(event) => onFieldChange(field.key, event.target.value)} placeholder={placeholder} rows={4} value={field.value || ""} /> : <Input onChange={(event) => onFieldChange(field.key, event.target.value)} placeholder={placeholder} type={field.type === "number" ? "number" : field.type === "datetime" ? "datetime-local" : "text"} value={field.value || ""} />}</Field>;
};
