import React from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { Input } from "@foundation/ui/web/Input";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { Text } from "@foundation/ui/web/Text";
import { ArrowBackIcon, ArrowForwardIcon, CloseIcon, EditIcon, SearchIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { ApiErrorEnvelope } from "@shared-core";
import type { AdminStandardColumnViewModel, AdminStandardListViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import styles from "./ListPage.module.css";
import { ListPageSkeleton } from "./ListPageSkeleton";

function formatCurrencyCents(value: unknown, currency = "BRL", locale = "pt-BR"): string {
  if (value === undefined || value === null || value === "") return "";
  const amountCents = Number(value);
  if (!Number.isFinite(amountCents)) return "";
  return new Intl.NumberFormat(locale, { currency, style: "currency" }).format(amountCents / 100);
}

function resolveStatusPresentation(value: unknown): { statusColor?: string; tone: "danger" | "neutral" | "success" | "warning" } {
  const status = String(value || "").toLowerCase();
  if (/(active|approved|completed|delivered|paid|fulfilled)/.test(status)) return { statusColor: "active", tone: "success" };
  if (/(ready)/.test(status)) return { statusColor: "ready", tone: "neutral" };
  if (/(received)/.test(status)) return { statusColor: "received", tone: "neutral" };
  if (/(separating)/.test(status)) return { statusColor: "separating", tone: "warning" };
  if (/(cancelled|canceled|failed|refunded|blocked|archived)/.test(status)) return { statusColor: "canceled", tone: "danger" };
  if (/(pending|pastdue|past_due|paused|draft|preparing)/.test(status)) return { statusColor: "paused", tone: "warning" };
  return { tone: "neutral" };
}

function isStatusColumn(column: AdminStandardColumnViewModel): boolean {
  return column.valueType === "status" || column.key.toLowerCase().includes("status");
}

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

  const hasActiveFilters = Boolean(search.trim()) || viewModel.activeFilterCount > 0;
  const renderCell = (row: any, column: AdminStandardColumnViewModel) => {
    const value = row[column.key];
    const label = column.valueType === "translationKey" ? t(String(value || ""), "") : String(value ?? "");
    if (column.showAvatar) return <AvatarCell image={row.image} name={String(value || row.name || row.customerName || "")} />;
    if (column.showMedia) return <Inline gap="sm" wrap={false}>{row.image ? <img alt={String(value || "")} className={styles.mediaThumb} src={row.image} /> : null}<Text as="span" tone="default" variant="body" weight="var(--theme--typography-bold)">{label}</Text></Inline>;
    if (column.render) return column.render(row);
    if (isStatusColumn(column)) {
      const presentation = resolveStatusPresentation(value);
      return <Badge appearance="soft" indicator statusColor={presentation.statusColor} tone={presentation.tone}>{label}</Badge>;
    }
    if (column.valueType === "currency") return formatCurrencyCents(value, column.currency, column.locale);
    return label || t("common.emptyValue");
  };

  return <div className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="md">
        <Inline align="start" className={styles.header} justify="between" wrap={false}>
          <Stack className={styles.heading} gap="xs">
            <Inline align="center" gap="sm" wrap>
              <Text as="h1" variant="h1">{t(viewModel.titleKey || "", entityName)}</Text>
              <Badge appearance="soft" indicator={viewModel.filteredRowsTotal > 0} tone="neutral">{t("standard.resultsCount", undefined, { count: viewModel.filteredRowsTotal })}</Badge>
              {isLoading ? <Badge appearance="soft" tone="neutral">{t("standard.loading")}</Badge> : null}
            </Inline>
            {viewModel.subtitleKey ? <Text tone="muted" variant="body">{t(viewModel.subtitleKey)}</Text> : null}
          </Stack>
          {onCreateRow && viewModel.actionLabelKey ? <Button className={styles.createButton} appearance="glass" icon={<CloseIcon aria-hidden="true" className={styles.createIcon} />} onClick={onCreateRow} size="md" tone="primary">{t(viewModel.actionLabelKey, entityName)}</Button> : null}
        </Inline>

        <Card className={styles.toolbarCard} size="sm"><div className={styles.toolbar}>
          <Input className={styles.searchInput} icon={<SearchIcon aria-hidden="true" />} label={t("standard.searchLabel")} onChange={(event) => onSearchChange(event.target.value)} placeholder={t(viewModel.searchPlaceholderKey || "common.searchPlaceholder")} type="search" value={search} />
          {viewModel.filters.map((filter) => <DropdownPicker ariaLabel={t(filter.labelKey, filter.key)} className={[styles.filterPicker, filter.key === "status" ? styles.statusFilterPicker : ""].filter(Boolean).join(" ")} key={filter.key} label={t(filter.labelKey, filter.key)} onChange={(value) => onSetFilter(filter.key, value)} options={[{ label: `${t("common.allFilter")} ${t(filter.labelKey, filter.key)}`, value: "all" }, ...filter.options.map((option) => ({ label: t(option.labelKey, option.value), value: option.value }))]} value={filter.value} />)}
        </div></Card>

        {error ? <Card className={styles.errorCard} size="md"><Stack gap="xs"><Text as="strong" variant="body">{t("standard.apiErrorTitle")}</Text><Text tone="muted" variant="caption">{error.status ? `${t("standard.apiErrorStatus")} ${error.status}` : t("standard.apiErrorUnknown")}{error.message ? ` - ${error.message}` : ""}</Text></Stack></Card> : null}

        <Card className={styles.tableCard} size="sm">
          <div className={styles.tableScroller}><table className={styles.table}><thead><tr>
            {viewModel.columns.map((column) => <th aria-sort={viewModel.sortKey === column.key ? (viewModel.sortDirection === "asc" ? "ascending" : "descending") : "none"} key={column.key} scope="col">{column.sortable ? <button className={styles.sortButton} data-sorted={viewModel.sortKey === column.key || undefined} onClick={() => onSort(column.key)} type="button"><span>{t(column.labelKey, column.key)}</span><ArrowForwardIcon aria-hidden="true" className={[styles.sortMark, viewModel.sortKey === column.key && viewModel.sortDirection === "asc" ? styles.sortAscending : viewModel.sortKey === column.key ? styles.sortDescending : ""].filter(Boolean).join(" ")} /></button> : t(column.labelKey, column.key)}</th>)}
            {viewModel.showActions ? <th scope="col">{t("common.actions")}</th> : null}
          </tr></thead><tbody>
            {isLoading ? <tr><td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>{t("standard.loadingRows")}</td></tr> : viewModel.rows.length === 0 ? <tr><td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>{hasActiveFilters ? t("standard.emptyFiltered") : t("common.emptyState")}</td></tr> : viewModel.rows.map((row, rowIndex) => <tr key={row.id || row.code || rowIndex} onClick={() => onSelectRow?.(row)}>{viewModel.columns.map((column) => <td key={column.key}>{renderCell(row, column)}</td>)}{viewModel.showActions ? <td className={styles.actionCell}><Button aria-label={t("common.edit")} appearance="transparent" icon={<EditIcon aria-hidden="true" />} iconPosition="only" onClick={(event) => { event.stopPropagation(); onSelectRow?.(row); }} size="xs" tone="neutral">{t("common.edit")}</Button></td> : null}</tr>)}
          </tbody></table></div>
          {!isLoading && viewModel.filteredRowsTotal > 0 ? <div className={styles.tableFooter}><Text as="p" tone="muted" variant="caption">{t("standard.showingPage", undefined, { shown: viewModel.rows.length, total: viewModel.filteredRowsTotal })}</Text>{viewModel.pageCount > 1 ? <nav aria-label={t("standard.paginationAriaLabel")} className={styles.footerPagination}><Button aria-label={t("standard.previousPage")} appearance="transparent" disabled={viewModel.page === 1} icon={<ArrowBackIcon aria-hidden="true" />} iconPosition="only" onClick={() => onPageChange(viewModel.page - 1)} size="sm" tone="neutral">{t("standard.previousPage")}</Button><Button aria-label={t("standard.nextPage")} appearance="transparent" disabled={viewModel.page === viewModel.pageCount} icon={<ArrowForwardIcon aria-hidden="true" />} iconPosition="only" onClick={() => onPageChange(viewModel.page + 1)} size="sm" tone="neutral">{t("standard.nextPage")}</Button></nav> : null}</div> : null}
        </Card>
      </Stack>
    </SectionContainer>
  </div>;
};
