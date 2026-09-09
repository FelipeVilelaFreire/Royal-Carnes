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
  onEditRow?: () => void;
  onSelectRow?: (row: any) => void;
  onSubmit?: (values: Record<string, any>) => void;
  routeAction: "create" | "detail" | "list";
  selectedRow?: Record<string, any> | null;
}

export const StandardScreen: React.FC<StandardScreenProps> = ({
  apiConfig,
  entityConfig,
  onBackToList,
  onCreateRow,
  onEditRow,
  onSelectRow,
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
  });
  const entityName = t(entityConfig?.entityNameKey || "", entityConfig?.entityName || t("common.records"));

  if (routeAction === "create") {
    return (
      <AddPage
        entityName={entityName}
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
        entityName={entityName}
        formValues={standard.formValues}
        image={selectedRow.image}
        isEditing={standard.isEditingDetail}
        isSubmitting={standard.isSubmitting}
        onBack={onBackToList}
        onCancelEdit={standard.cancelDetailEdit}
        onEdit={standard.beginDetailEdit || onEditRow}
        onFieldChange={standard.setFormValue}
        onSaveEdit={standard.submitDetailEdit}
        onTabChange={standard.setActiveTab}
        t={t}
        viewModel={standard.detailViewModel}
      />
    );
  }

  return (
    <ListPage
      entityName={entityName}
      isLoading={standard.isLoading}
      onCreateRow={onCreateRow}
      onSearchChange={standard.setSearch}
      onSelectRow={onSelectRow}
      onSetFilter={standard.setFilterValue}
      search={standard.search}
      t={t}
      viewModel={standard.listViewModel}
    />
  );
};
