import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { ConfirmationModal } from "@foundation/ui/web/Modal";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import { DetailContentCard } from "./DetailContentCard";
import { DetailHeader } from "./DetailHeader";
import { DetailQuickInfo } from "./DetailQuickInfo";
import { DetailTabs } from "./DetailTabs";
import styles from "./DetailPage.module.css";

function resolveQuickInfoValue(entry: AdminStandardDetailViewModel["quickInfo"][number], t: AdminTranslate): string {
  if (entry.valueType === "optionLabel") {
    const option = entry.options?.find((candidate) => String(candidate.value) === String(entry.rawValue));
    return option?.label || t(option?.labelKey || "", entry.value);
  }
  return entry.valueType === "translationKey" ? t(entry.value, "") : entry.value;
}

export interface DetailPageProps {
  deleteAction?: {
    confirmKey: string;
    descriptionKey: string;
    titleKey: string;
  };
  formValues?: Record<string, any>;
  image?: string;
  isEditing?: boolean;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onCancelEdit?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onFieldChange?: (key: string, value: any) => void;
  onSaveEdit?: () => void;
  onTabChange: (tab: string) => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}


export const DetailPage: React.FC<DetailPageProps> = ({
  deleteAction,
  formValues = {},
  image,
  isEditing = false,
  isDeleting = false,
  isSubmitting = false,
  onBack,
  onCancelEdit,
  onDelete,
  onEdit,
  onFieldChange,
  onSaveEdit,
  onTabChange,
  t,
  viewModel,
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = React.useState(false);
  const canDelete = Boolean(deleteAction && onDelete);
  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <DetailHeader
            image={image}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onBack={onBack}
            onCancelEdit={onCancelEdit}
            onEdit={onEdit}
            onRequestDelete={() => setIsDeleteConfirmationOpen(true)}
            onSaveEdit={onSaveEdit}
            t={t}
            viewModel={viewModel}
          />

          <Stack className={styles.tabbedContent} gap="md">
            <DetailQuickInfo items={viewModel.quickInfo.map((entry) => ({ key: entry.key, label: t(entry.labelKey, entry.key), value: resolveQuickInfoValue(entry, t) }))} />
            <DetailTabs onChange={onTabChange} t={t} viewModel={viewModel} />
            <DetailContentCard formValues={formValues} isEditing={isEditing} onFieldChange={onFieldChange} t={t} viewModel={viewModel} />
          </Stack>
        </Stack>
      </SectionContainer>
      {isDeleteConfirmationOpen ? (
        <ConfirmationModal
          cancelLabel={t("common.cancel")}
          closeLabel={t("forms.closeConfirmation")}
          confirmLabel={t(canDelete ? deleteAction?.confirmKey || "common.remove" : "common.close")}
          description={t(canDelete ? deleteAction?.descriptionKey || "" : "standard.removeUnavailableDescription")}
          onCancel={() => setIsDeleteConfirmationOpen(false)}
          onConfirm={() => {
            if (canDelete && !isDeleting) onDelete?.();
            else setIsDeleteConfirmationOpen(false);
          }}
          open={isDeleteConfirmationOpen}
          title={t(canDelete ? deleteAction?.titleKey || "common.remove" : "standard.removeUnavailableTitle")}
        />
      ) : null}
    </div>
  );
};
