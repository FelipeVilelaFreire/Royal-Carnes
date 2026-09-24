import React, { useState } from "react";
import { WorkflowBoard } from "@product-components/ecommerce";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { AdminScreenHeader } from "../../../../components/AdminScreenHeader/AdminScreenHeader";
import type { ApiErrorEnvelope } from "@shared-core";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import styles from "./ListPage.module.css";
import { ListPageFeedback } from "./ListPageFeedback";
import { ListPageHeader, ListPageMetadata } from "./ListPageHeader";
import { ListPageSkeleton } from "./ListPageSkeleton";
import { ListPageTable } from "./ListPageTable";
import { ListPageToolbar } from "./ListPageToolbar";

export interface ListPageProps {
  entityName: string;
  error?: ApiErrorEnvelope | null;
  isLoading?: boolean;
  onCreateRow?: () => void;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onSelectRow?: (row: any) => void;
  onSetFilter: (key: string, value: string) => void;
  onSort: (key: string) => void;
  onWorkflowStatusChange?: (rowId: string | number, statusKey: string) => void;
  search: string;
  t: AdminTranslate;
  updatingWorkflowRowId?: string | number | null;
  viewModel: AdminStandardListViewModel;
}

export const ListPage: React.FC<ListPageProps> = ({
  entityName, error, isLoading = false, onCreateRow, onPageChange,
  onSearchChange, onSelectRow, onSetFilter, onSort, onWorkflowStatusChange, search, t, updatingWorkflowRowId, viewModel,
}) => {
  const [viewMode, setViewMode] = useState(viewModel.workflow?.defaultView || "table");
  if (isLoading) return <ListPageSkeleton columnCount={viewModel.columns.length + (viewModel.showActions ? 1 : 0)} filterCount={viewModel.filters.length} />;

  return <div className={styles.page}>
    <AdminScreenHeader
      actions={<ListPageHeader entityName={entityName} onCreateRow={onCreateRow} onViewModeChange={setViewMode} t={t} viewMode={viewMode} viewModel={viewModel} />}
      description={viewModel.subtitleKey ? t(viewModel.subtitleKey) : undefined}
      metadata={<ListPageMetadata isLoading={isLoading} t={t} viewModel={viewModel} />}
      title={t(viewModel.titleKey || "", entityName)}
    />
    <SectionContainer atmosphere="transparent" headerSafety usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="md">
        <ListPageToolbar onSearchChange={onSearchChange} onSetFilter={onSetFilter} search={search} t={t} viewModel={viewModel} />
        <ListPageFeedback error={error} t={t} />
        {viewModel.workflow && viewMode === "kanban" ? <div className={styles.workflowBoard}><WorkflowBoard
          cardAriaLabel={(card) => `${t(viewModel.workflow.openLabelKey)} ${card.title}`}
          columns={viewModel.workflow.columns}
          onSelectCard={(card) => onSelectRow?.(card.sourceRow)}
          onStatusChange={onWorkflowStatusChange}
          updatingCardId={updatingWorkflowRowId}
        /></div> : null}
        {viewMode === "table" ? <ListPageTable isLoading={isLoading} onPageChange={onPageChange} onSelectRow={onSelectRow} onSort={onSort} search={search} t={t} viewModel={viewModel} /> : null}
      </Stack>
    </SectionContainer>
  </div>;
};
