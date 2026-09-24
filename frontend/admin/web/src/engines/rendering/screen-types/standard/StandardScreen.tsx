import React from "react";
import type { ApiClientConfig } from "@shared-core";
import { useAdminI18n } from "@/locales/i18n";
import { useAdminStandardScreen } from "@/hooks/useAdminStandardScreen";
import { AddPage } from "./pages/AddPage/AddPage";
import { DetailPage } from "./pages/DetailPage/DetailPage";
import { ListPage } from "./pages/ListPage/ListPage";

export interface StandardScreenProps {
  apiConfig?: ApiClientConfig;
  entityConfig: any;
  onBackToList: () => void;
  onCreateRow?: () => void;
  onSelectRow?: (row: any) => void;
  onOpenRelatedRow?: (screenKey: string, row: Record<string, any>) => void;
  onSubmit?: (values: Record<string, any>) => void;
  routeAction: "create" | "detail" | "list";
  selectedRow?: Record<string, any> | null;
}

export const StandardScreen: React.FC<StandardScreenProps> = ({
  apiConfig,
  entityConfig,
  onBackToList,
  onCreateRow,
  onSelectRow,
  onOpenRelatedRow,
  onSubmit,
  routeAction,
  selectedRow,
}) => {
  const { t } = useAdminI18n();
  const standard = useAdminStandardScreen({
    apiConfig,
    entityConfig,
    initialSelectedRow: selectedRow,
    onBack: onBackToList,
    onSubmit,
    routeAction,
  });
  const entityName = t(entityConfig?.entityNameKey || "", entityConfig?.entityName || t("common.records"));

  if (routeAction === "create") {
    return (
      <AddPage
        entityName={entityName}
        isLoading={standard.isFormInitialLoading}
        isSubmitting={standard.isSubmitting}
        onBack={onBackToList}
        onFieldChange={standard.setFormValue}
        onSubmit={standard.submitForm}
        t={t}
        viewModel={standard.formViewModel}
      />
    );
  }

  if (routeAction === "detail" && selectedRow) {
    return (
      <DetailPage
        deleteAction={entityConfig?.detailPage?.deleteAction}
        error={standard.error}
        formValues={standard.formValues}
        image={selectedRow.image}
        isLoading={standard.isDetailInitialLoading}
        isEditing={standard.isEditingDetail}
        isDeleting={standard.isDeletingDetail}
        isSubmitting={standard.isSubmitting}
        onBack={onBackToList}
        onCancelEdit={standard.cancelDetailEdit}
        onDelete={entityConfig?.detailPage?.deleteAction ? standard.deleteDetail : undefined}
        onEdit={standard.hasEditableDetailFields ? standard.beginDetailEdit : undefined}
        onFieldChange={standard.setFormValue}
        onOpenRelatedRow={onOpenRelatedRow}
        onSaveEdit={standard.submitDetailEdit}
        onWorkflowStatusChange={(statusKey) => standard.transitionWorkflowRow(selectedRow.id, statusKey)}
        onTabChange={standard.setActiveTab}
        t={t}
        viewModel={standard.detailViewModel}
        workflowUpdating={String(standard.updatingWorkflowRowId) === String(selectedRow.id)}
      />
    );
  }

  return (
    <ListPage
      entityName={entityName}
      error={standard.error}
      isLoading={standard.isInitialLoading}
      onCreateRow={onCreateRow}
      onPageChange={standard.setCurrentPage}
      onSearchChange={standard.setSearch}
      onSelectRow={onSelectRow}
      onSetFilter={standard.setFilterValue}
      onSort={standard.cycleListSortDirection}
      onWorkflowStatusChange={standard.transitionWorkflowRow}
      search={standard.search}
      t={t}
      updatingWorkflowRowId={standard.updatingWorkflowRowId}
      viewModel={standard.listViewModel}
    />
  );
};
