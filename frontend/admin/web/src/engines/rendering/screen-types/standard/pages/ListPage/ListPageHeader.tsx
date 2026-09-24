import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { Inline } from "@foundation/ui/web/Layout";
import { CloseIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import styles from "./ListPage.module.css";

interface ListPageHeaderProps { entityName: string; onCreateRow?: () => void; onViewModeChange?: (value: string) => void; t: AdminTranslate; viewMode?: string; viewModel: AdminStandardListViewModel; }
interface ListPageMetadataProps { isLoading: boolean; t: AdminTranslate; viewModel: AdminStandardListViewModel; }

export const ListPageMetadata: React.FC<ListPageMetadataProps> = ({ isLoading, t, viewModel }) => (
  <Inline align="center" className={styles.headerMetadata} gap="sm" wrap>
    <Badge appearance="soft" indicator={viewModel.filteredRowsTotal > 0} tone="neutral">{t("standard.resultsCount", undefined, { count: viewModel.filteredRowsTotal })}</Badge>
    {isLoading ? <Badge appearance="soft" tone="neutral">{t("standard.loading")}</Badge> : null}
  </Inline>
);

export const ListPageHeader: React.FC<ListPageHeaderProps> = ({ entityName, onCreateRow, onViewModeChange, t, viewMode, viewModel }) => (
  <Inline align="end" className={styles.headerActions} gap="sm" wrap>
    {viewModel.workflow?.viewModes.length && onViewModeChange ? <DropdownPicker ariaLabel={t(viewModel.workflow.viewLabelKey)} className={styles.viewPicker} controlSize="md" label={t(viewModel.workflow.viewLabelKey)} labelPlacement="top" onChange={onViewModeChange} options={viewModel.workflow.viewModes.map((mode) => ({ label: t(mode.labelKey), value: mode.value }))} showSelectionIndicator={false} value={viewMode || viewModel.workflow.defaultView} width="auto" /> : null}
    {onCreateRow && viewModel.actionLabelKey ? <Button className={styles.createButton} appearance="glass" icon={<CloseIcon aria-hidden="true" className={styles.createIcon} />} onClick={onCreateRow} size="md" tone="primary">{t(viewModel.actionLabelKey, entityName)}</Button> : null}
  </Inline>
);
