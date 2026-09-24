import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { ConfirmationModal } from "@foundation/ui/web/Modal";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { AdminScreenHeader } from "../../../../components/AdminScreenHeader/AdminScreenHeader";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import { DetailContentCard } from "./DetailContentCard";
import { DetailHeader } from "./DetailHeader";
import { DetailQuickInfo } from "./DetailQuickInfo";
import { DetailPageSkeleton } from "./DetailPageSkeleton";
import { DetailTabs } from "./DetailTabs";
import { ListPageFeedback } from "../ListPage/ListPageFeedback";
import type { ApiErrorEnvelope } from "@shared-core";
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
  error?: ApiErrorEnvelope | null;
  formValues?: Record<string, any>;
  image?: string;
  isLoading?: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onCancelEdit?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onFieldChange?: (key: string, value: any) => void;
  onOpenRelatedRow?: (screenKey: string, row: Record<string, any>) => void;
  onSaveEdit?: () => void;
  onWorkflowStatusChange?: (statusKey: string) => void;
  onTabChange: (tab: string) => void;
  t: AdminTranslate;
  workflowUpdating?: boolean;
  viewModel: AdminStandardDetailViewModel;
}


export const DetailPage: React.FC<DetailPageProps> = ({
  deleteAction,
  error,
  formValues = {},
  image,
  isLoading = false,
  isEditing = false,
  isDeleting = false,
  isSubmitting = false,
  onBack,
  onCancelEdit,
  onDelete,
  onEdit,
  onFieldChange,
  onOpenRelatedRow,
  onSaveEdit,
  onWorkflowStatusChange,
  onTabChange,
  t,
  viewModel,
  workflowUpdating = false,
}) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = React.useState(false);
  const canDelete = Boolean(deleteAction && onDelete);
  if (isLoading) return <DetailPageSkeleton hasDeleteAction={canDelete} hasEditAction={Boolean(onEdit)} viewModel={viewModel} />;
  return (
    <div className={styles.page}>
      <AdminScreenHeader title={viewModel.displayName} />
      <SectionContainer atmosphere="transparent" headerSafety usefulColumns={20} heightRecipe="auto">
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
            <ListPageFeedback error={error} t={t} />
            <DetailQuickInfo items={viewModel.quickInfo.map((entry) => ({ key: entry.key, label: t(entry.labelKey, entry.key), value: resolveQuickInfoValue(entry, t) }))} />
            <DetailTabs onChange={onTabChange} t={t} viewModel={viewModel} />
            <DetailContentCard formValues={formValues} isEditing={isEditing} onFieldChange={onFieldChange} onOpenRelatedRow={onOpenRelatedRow} onWorkflowStatusChange={onWorkflowStatusChange} t={t} viewModel={viewModel} workflowUpdating={workflowUpdating} />
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
