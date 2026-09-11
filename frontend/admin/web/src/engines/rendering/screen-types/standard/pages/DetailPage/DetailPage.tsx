import React from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { AssetPicker } from "@foundation/ui/web/AssetPicker";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { DataField } from "@foundation/ui/web/DataField";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Input } from "@foundation/ui/web/Input";
import { MultiSelect } from "@foundation/ui/web/MultiSelect";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { SegmentedControl } from "@foundation/ui/web/SegmentedControl";
import { Select } from "@foundation/ui/web/Select";
import { Text } from "@foundation/ui/web/Text";
import { TextArea } from "@foundation/ui/web/TextArea";
import { ArrowBackIcon, CheckIcon, CloseIcon, EditIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type {
  AdminStandardDetailViewModel,
  AdminStandardLineItemColumnViewModel,
  AdminStandardRelatedListColumnViewModel,
} from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import { RelatedList } from "../../components/RelatedList";
import styles from "./DetailPage.module.css";

type DetailEntry = AdminStandardDetailViewModel["entries"][number];

function resolveDisplayValue(
  entry: DetailEntry,
  t: AdminTranslate,
): string {
  if (entry.valueType === "optionLabel") {
    const option = entry.options?.find((candidate) => String(candidate.value) === String(entry.rawValue));
    return option?.label || t(option?.labelKey || "", entry.value);
  }
  if (entry.valueType === "translationKey") return t(entry.value, "");
  return entry.value;
}

function resolveEntrySpan(entry: DetailEntry) {
  return entry.layout === "full" ? "full" : 1;
}

export interface DetailPageProps {
  entityName: string;
  formValues?: Record<string, any>;
  image?: string;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onCancelEdit?: () => void;
  onEdit?: () => void;
  onFieldChange?: (key: string, value: any) => void;
  onSaveEdit?: () => void;
  onTabChange: (tab: string) => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}

function renderEditableEntryValue(
  entry: DetailEntry,
  formValues: Record<string, any>,
  onFieldChange: DetailPageProps["onFieldChange"],
  t: AdminTranslate,
) {
  if (entry.type === "asset") {
    return (
      <AssetPicker
        cancelRemoveLabel={t("common.cancel")}
        chooseFileLabel={t("forms.assetChooseFile")}
        confirmRemoveDescription={t("forms.confirmRemoveImageDescription")}
        confirmRemoveLabel={t("forms.confirmRemoveAction")}
        confirmRemoveTitle={t("forms.confirmRemoveImageTitle")}
        dropzoneLabel={t("forms.assetDropzone")}
        onChange={(value) => onFieldChange?.(entry.key, value)}
        previewAlt={t(entry.labelKey, entry.key)}
        removeModalCloseLabel={t("forms.closeConfirmation")}
        removeLabel={t("forms.assetRemove")}
        urlPlaceholder={t("forms.assetUrlPlaceholder")}
        value={formValues[entry.key] ?? entry.rawValue ?? ""}
      />
    );
  }

  if (entry.type === "lineItems") {
    return (
      <LineItemsEditor
        addLabel={t(entry.addLabelKey || "forms.addLineItem")}
        columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]}
        emptyLabel={t("forms.emptyLineItems")}
        onChange={(value) => onFieldChange?.(entry.key, value)}
        removeLabel={t("forms.removeLineItem")}
        t={t}
        value={Array.isArray(formValues[entry.key]) ? formValues[entry.key] : []}
      />
    );
  }

  if (entry.type === "multiSelect") {
    return (
      <MultiSelect
        cancelRemoveLabel={t("common.cancel")}
        confirmRemoveDescription={(option) => t("forms.confirmRemoveSelectedOptionDescription", "", { option })}
        confirmRemoveLabel={t("forms.confirmRemoveAction")}
        confirmRemoveTitle={t("forms.confirmRemoveSelectedOptionTitle")}
        emptyOptionLabel={t("forms.selectOption")}
        onChange={(value) => onFieldChange?.(entry.key, value)}
        options={(entry.options || []).map((option) => ({
          label: option.label || t(option.labelKey || "", option.value),
          value: option.value,
        }))}
        removeModalCloseLabel={t("forms.closeConfirmation")}
        removeLabel={(option) => t("forms.removeSelectedOption", "", { option })}
        value={Array.isArray(formValues[entry.key]) ? formValues[entry.key].map(String) : []}
      />
    );
  }

  if (entry.type === "select") {
    return (
      <Select
        onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
        options={(entry.options || []).map((option) => ({
          label: option.label || t(option.labelKey || "", option.value),
          value: option.value,
        }))}
        value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
      />
    );
  }

  if (entry.type === "currency") {
    const fieldValue = formValues[entry.key];
    const emptyValue =
      fieldValue === "" ||
      fieldValue === null ||
      (fieldValue === undefined && (entry.rawValue === null || entry.rawValue === undefined));

    return (
      <CurrencyInput
        currency={entry.currency}
        locale={entry.locale}
        onChange={(value) => onFieldChange?.(entry.key, value)}
        value={emptyValue ? null : Number(fieldValue ?? entry.rawValue)}
      />
    );
  }

  if (entry.type === "textarea") {
    return (
      <TextArea
        onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
        rows={4}
        value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
      />
    );
  }

  return (
    <Input
      onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
      type={entry.type === "number" ? "number" : entry.type === "datetime" ? "datetime-local" : "text"}
      value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
    />
  );
}

function renderReadonlyEntryValue(
  entry: DetailEntry,
  viewModel: AdminStandardDetailViewModel,
  onFieldChange: DetailPageProps["onFieldChange"],
  t: AdminTranslate,
) {
  if (entry.type === "lineItems") {
    return (
      <LineItemsEditor
        addLabel={t(entry.addLabelKey || "forms.addLineItem")}
        columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]}
        emptyLabel={t(viewModel.emptyKey || "forms.emptyLineItems")}
        onChange={(value) => onFieldChange?.(entry.key, value)}
        readOnly
        removeLabel={t("forms.removeLineItem")}
        t={t}
        value={Array.isArray(entry.rawValue) ? entry.rawValue : []}
      />
    );
  }

  if (entry.type === "relatedList") {
    return (
      <RelatedList
        columns={(entry.columns || []) as AdminStandardRelatedListColumnViewModel[]}
        emptyLabel={t(viewModel.emptyKey || "details.emptySummary")}
        rows={Array.isArray(entry.rawValue) ? entry.rawValue : []}
        t={t}
      />
    );
  }

  if (entry.type === "asset" && entry.value) {
    return <img alt={viewModel.displayName} className={styles.assetPreview} src={entry.value} />;
  }

  return resolveDisplayValue(entry, t);
}

export const DetailPage: React.FC<DetailPageProps> = ({
  entityName,
  formValues = {},
  image,
  isEditing = false,
  isSubmitting = false,
  onBack,
  onCancelEdit,
  onEdit,
  onFieldChange,
  onSaveEdit,
  onTabChange,
  t,
  viewModel,
}) => {
  const sections = viewModel.sections.length
    ? viewModel.sections
    : [{ entries: viewModel.entries, key: "default" }];

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="center" justify="between" wrap>
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

              <Inline align="center" gap="md" wrap={false}>
                <AvatarCell image={image} name={viewModel.displayName} showName={false} size="lg" />
                <Text as="h1" variant="h1">
                  {viewModel.displayName}
                </Text>
              </Inline>
            </Inline>

            {isEditing ? (
              <Inline align="center" gap="sm" wrap>
                <Button
                  appearance="outline"
                  icon={<CloseIcon aria-hidden="true" />}
                  onClick={onCancelEdit}
                  size="md"
                  tone="neutral"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  appearance="solid"
                  disabled={isSubmitting}
                  icon={<CheckIcon aria-hidden="true" />}
                  onClick={onSaveEdit}
                  size="md"
                  tone="neutral"
                >
                  {isSubmitting ? t("standard.saving") : t("common.save")}
                </Button>
              </Inline>
            ) : onEdit ? (
              <Button
                appearance="solid"
                icon={<EditIcon aria-hidden="true" />}
                onClick={onEdit}
                size="md"
                tone="neutral"
              >
                {t("common.edit")} {entityName}
              </Button>
            ) : null}
          </Inline>

          <SegmentedControl
            items={viewModel.tabs.map((tab) => ({
              key: tab.id,
              label: t(tab.labelKey),
            }))}
            onChange={onTabChange}
            value={viewModel.activeTab}
            width="content"
          />

          <Card className={styles.detailCard} size="lg">
            {viewModel.entries.length ? (
              <Stack className={styles.detailSections} gap="lg">
                {sections.map((section) => (
                  <Stack className={styles.detailSection} gap="md" key={section.key}>
                    {section.titleKey ? (
                      <Text as="h2" className={styles.sectionTitle} variant="h3">
                        {t(section.titleKey)}
                      </Text>
                    ) : null}
                    <FieldGrid className={styles.detailGrid} columns="auto" gap="md">
                      {section.entries.map((entry) => (
                        <FieldGridItem key={entry.key} span={resolveEntrySpan(entry)}>
                          <DataField
                            label={t(entry.labelKey, entry.key)}
                            value={
                              isEditing && entry.editable
                                ? renderEditableEntryValue(entry, formValues, onFieldChange, t)
                                : renderReadonlyEntryValue(entry, viewModel, onFieldChange, t)
                            }
                          />
                        </FieldGridItem>
                      ))}
                    </FieldGrid>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Text tone="muted" variant="body">
                {t(viewModel.emptyKey || "details.emptySummary")}
              </Text>
            )}
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
