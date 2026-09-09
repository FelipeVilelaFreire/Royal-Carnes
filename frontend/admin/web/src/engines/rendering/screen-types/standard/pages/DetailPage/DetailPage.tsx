import React from "react";
import { AvatarCell } from "@foundation/ui/Avatar";
import { AssetPicker } from "@foundation/ui/AssetPicker";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { CurrencyInput } from "@foundation/ui/CurrencyInput";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Input } from "@foundation/ui/Input";
import { MultiSelect } from "@foundation/ui/MultiSelect";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { SegmentedControl } from "@foundation/ui/SegmentedControl";
import { Select } from "@foundation/ui/Select";
import { Text } from "@foundation/ui/Text";
import { TextArea } from "@foundation/ui/TextArea";
import { ArrowBackIcon, CheckIcon, CloseIcon, EditIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type {
  AdminStandardDetailViewModel,
  AdminStandardLineItemColumnViewModel,
  AdminStandardRelatedListColumnViewModel,
} from "@/view-models/standard.view-model";
import { LineItemsEditor } from "../../components/LineItemsEditor";
import { RelatedList } from "../../components/RelatedList";
import styles from "./DetailPage.module.css";

function resolveDisplayValue(
  entry: AdminStandardDetailViewModel["entries"][number],
  t: AdminTranslate,
): string {
  if (entry.valueType === "optionLabel") {
    const option = entry.options?.find((candidate) => String(candidate.value) === String(entry.rawValue));
    return option?.label || t(option?.labelKey || "", entry.value);
  }
  if (entry.valueType === "translationKey") return t(entry.value, "");
  return entry.value;
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
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
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
                    <Grid className={styles.detailGrid} columns={3} gap="md">
                      {section.entries.map((entry) => (
                        <div
                          className={[
                            styles.detailEntry,
                            entry.layout === "full" ? styles.detailEntryFull : "",
                          ].filter(Boolean).join(" ")}
                          key={entry.key}
                        >
                          <Text as="span" className={styles.detailKey} tone="muted" variant="caption" weight="bold">
                            {t(entry.labelKey, entry.key)}
                          </Text>
                          {isEditing && entry.editable ? (
                            entry.type === "asset" ? (
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
                            ) : entry.type === "lineItems" ? (
                              <LineItemsEditor
                                addLabel={t(entry.addLabelKey || "forms.addLineItem")}
                                columns={(entry.columns || []) as AdminStandardLineItemColumnViewModel[]}
                                emptyLabel={t("forms.emptyLineItems")}
                                onChange={(value) => onFieldChange?.(entry.key, value)}
                                removeLabel={t("forms.removeLineItem")}
                                t={t}
                                value={Array.isArray(formValues[entry.key]) ? formValues[entry.key] : []}
                              />
                            ) : entry.type === "multiSelect" ? (
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
                            ) : entry.type === "select" ? (
                              <Select
                                onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
                                options={(entry.options || []).map((option) => ({
                                  label: option.label || t(option.labelKey || "", option.value),
                                  value: option.value,
                                }))}
                                value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
                              />
                            ) : entry.type === "currency" ? (
                              <CurrencyInput
                                currency={entry.currency}
                                locale={entry.locale}
                                onChange={(value) => onFieldChange?.(entry.key, value)}
                                value={
                                  formValues[entry.key] === "" || formValues[entry.key] === null ||
                                  (formValues[entry.key] === undefined && (entry.rawValue === null || entry.rawValue === undefined))
                                    ? null
                                    : Number(formValues[entry.key] ?? entry.rawValue)
                                }
                              />
                            ) : entry.type === "textarea" ? (
                              <TextArea
                                onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
                                rows={4}
                                value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
                              />
                            ) : (
                              <Input
                                onChange={(event) => onFieldChange?.(entry.key, event.target.value)}
                                type={entry.type === "number" ? "number" : entry.type === "datetime" ? "datetime-local" : "text"}
                                value={String(formValues[entry.key] ?? entry.rawValue ?? "")}
                              />
                            )
                          ) : entry.type === "lineItems" ? (
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
                          ) : entry.type === "relatedList" ? (
                            <RelatedList
                              columns={(entry.columns || []) as AdminStandardRelatedListColumnViewModel[]}
                              emptyLabel={t(viewModel.emptyKey || "details.emptySummary")}
                              rows={Array.isArray(entry.rawValue) ? entry.rawValue : []}
                              t={t}
                            />
                          ) : entry.type === "asset" && entry.value ? (
                            <img
                              alt={viewModel.displayName}
                              className={styles.assetPreview}
                              src={entry.value}
                            />
                          ) : (
                            <Text as="strong" tone="default" variant="body" weight="var(--theme--typography-semibold)">
                              {resolveDisplayValue(entry, t)}
                            </Text>
                          )}
                        </div>
                      ))}
                    </Grid>
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
