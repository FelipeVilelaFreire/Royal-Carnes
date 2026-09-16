import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import type { ApiErrorEnvelope } from "@shared-core";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import styles from "./ListPage.module.css";
import { ListPageFeedback } from "./ListPageFeedback";
import { ListPageHeader } from "./ListPageHeader";
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
  search: string;
  t: AdminTranslate;
  viewModel: AdminStandardListViewModel;
}

export const ListPage: React.FC<ListPageProps> = ({
  entityName, error, isLoading = false, onCreateRow, onPageChange,
  onSearchChange, onSelectRow, onSetFilter, onSort, search, t, viewModel,
}) => {
  if (isLoading) return <ListPageSkeleton columnCount={viewModel.columns.length + (viewModel.showActions ? 1 : 0)} />;

  return <div className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="md">
        <ListPageHeader entityName={entityName} isLoading={isLoading} onCreateRow={onCreateRow} t={t} viewModel={viewModel} />
        <ListPageToolbar onSearchChange={onSearchChange} onSetFilter={onSetFilter} search={search} t={t} viewModel={viewModel} />
        <ListPageFeedback error={error} t={t} />
        <ListPageTable isLoading={isLoading} onPageChange={onPageChange} onSelectRow={onSelectRow} onSort={onSort} search={search} t={t} viewModel={viewModel} />
      </Stack>
    </SectionContainer>
  </div>;
};
