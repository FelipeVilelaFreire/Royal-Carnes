import React, { useMemo, useState } from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { ArrowBackIcon, ArrowForwardIcon, ChevronRightIcon, EditIcon } from "@foundation/ui/web/Icon/AppIcons";
import { formatFormattedInputValue } from "@foundation/ui/web/FormattedInput";
import { Inline } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardColumnViewModel, AdminStandardListViewModel, AdminStandardTreeViewModel } from "@/view-models/standard.view-model";
import styles from "./ListPage.module.css";

interface ListPageTableProps { isLoading: boolean; onPageChange: (page: number) => void; onSelectRow?: (row: any) => void; onSort: (key: string) => void; search: string; t: AdminTranslate; viewModel: AdminStandardListViewModel; }
interface TreeNode { children: TreeNode[]; depth: number; nodeKey: string; row: Record<string, any>; }

function formatCurrencyCents(value: unknown, currency = "BRL", locale = "pt-BR"): string { if (value === undefined || value === null || value === "") return ""; const amountCents = Number(value); return Number.isFinite(amountCents) ? new Intl.NumberFormat(locale, { currency, style: "currency" }).format(amountCents / 100) : ""; }
function resolveStatusPresentation(row: Record<string, unknown>, column: AdminStandardColumnViewModel): { statusColor?: string; tone: "danger" | "neutral" | "primary" | "success" | "warning" } { const statusColor = column.statusColorKey ? row[column.statusColorKey] : undefined; const statusTone = column.statusToneKey ? row[column.statusToneKey] : undefined; return { statusColor: typeof statusColor === "string" ? statusColor : undefined, tone: statusTone === "danger" || statusTone === "primary" || statusTone === "success" || statusTone === "warning" ? statusTone : "neutral" }; }
function resolveAvatarAccentColor(row: Record<string, unknown>, column: AdminStandardColumnViewModel): string | undefined { const accentColor = column.avatarColorKey ? row[column.avatarColorKey] : undefined; return typeof accentColor === "string" ? accentColor : undefined; }
function isStatusColumn(column: AdminStandardColumnViewModel): boolean { return column.valueType === "status" || column.key.toLowerCase().includes("status"); }

function createTree(rows: Array<Record<string, any>>, tree: AdminStandardTreeViewModel): TreeNode[] {
  const rowsByKey = new Map<string, Record<string, any>>();
  const childrenByParentKey = new Map<string, Array<Record<string, any>>>();
  rows.forEach((row) => { const nodeKey = String(row[tree.nodeKey] ?? row.id ?? ""); if (nodeKey) rowsByKey.set(nodeKey, row); });
  rows.forEach((row) => {
    const parentKey = String(row[tree.parentKey] ?? "");
    if (!parentKey || !rowsByKey.has(parentKey) || parentKey === String(row[tree.nodeKey] ?? row.id ?? "")) return;
    childrenByParentKey.set(parentKey, [...(childrenByParentKey.get(parentKey) || []), row]);
  });
  const attachedKeys = new Set<string>();
  const buildNode = (row: Record<string, any>, depth: number, ancestors: Set<string>): TreeNode => {
    const nodeKey = String(row[tree.nodeKey] ?? row.id ?? "");
    attachedKeys.add(nodeKey);
    const nextAncestors = new Set(ancestors);
    nextAncestors.add(nodeKey);
    return { children: (childrenByParentKey.get(nodeKey) || []).filter((child) => !nextAncestors.has(String(child[tree.nodeKey] ?? child.id ?? ""))).map((child) => buildNode(child, depth + 1, nextAncestors)), depth, nodeKey, row };
  };
  const roots = rows.filter((row) => { const parentKey = String(row[tree.parentKey] ?? ""); return !parentKey || !rowsByKey.has(parentKey) || parentKey === String(row[tree.nodeKey] ?? row.id ?? ""); }).map((row) => buildNode(row, 0, new Set()));
  rows.forEach((row) => { const nodeKey = String(row[tree.nodeKey] ?? row.id ?? ""); if (nodeKey && !attachedKeys.has(nodeKey)) roots.push(buildNode(row, 0, new Set())); });
  return roots;
}

function flattenTree(nodes: TreeNode[], collapsedNodeKeys: Set<string>): TreeNode[] { return nodes.flatMap((node) => [node, ...(collapsedNodeKeys.has(node.nodeKey) ? [] : flattenTree(node.children, collapsedNodeKeys))]); }

export const ListPageTable: React.FC<ListPageTableProps> = ({ isLoading, onPageChange, onSelectRow, onSort, search, t, viewModel }) => {
  const [collapsedNodeKeys, setCollapsedNodeKeys] = useState<Set<string>>(() => new Set());
  const hasActiveFilters = Boolean(search.trim()) || viewModel.activeFilterCount > 0;
  const treeNodes = useMemo(() => viewModel.tree ? createTree(viewModel.rows, viewModel.tree) : [], [viewModel.rows, viewModel.tree]);
  const displayRows = viewModel.tree ? flattenTree(treeNodes, collapsedNodeKeys) : viewModel.rows.map((row) => ({ children: [], depth: 0, nodeKey: String(row.id || row.code || ""), row }));
  const toggleNode = (nodeKey: string) => setCollapsedNodeKeys((current) => { const next = new Set(current); if (next.has(nodeKey)) next.delete(nodeKey); else next.add(nodeKey); return next; });
  const renderCell = (row: any, column: AdminStandardColumnViewModel, treeNode?: TreeNode) => {
    const value = row[column.key];
    const rawLabel = column.valueType === "translationKey" ? t(String(value || ""), "") : String(value ?? "");
    const label = column.format ? formatFormattedInputValue(rawLabel, column.format) : rawLabel;
    if (column.presentation === "tree" && treeNode) {
      const hasChildren = treeNode.children.length > 0;
      const isCollapsed = collapsedNodeKeys.has(treeNode.nodeKey);
      return <div className={styles.treeCell} data-depth={treeNode.depth}>
        {hasChildren ? <Button aria-expanded={!isCollapsed} aria-label={t(isCollapsed ? "standard.expandTreeNode" : "standard.collapseTreeNode", "", { name: label })} appearance="transparent" className={styles.treeToggle} icon={<ChevronRightIcon aria-hidden="true" />} iconPosition="only" onClick={(event) => { event.stopPropagation(); toggleNode(treeNode.nodeKey); }} size="xs" tone="neutral" /> : <span aria-hidden="true" className={styles.treeToggleSpacer} />}
        <Text as="span" className={styles.treeLabel} tone="default" variant="body" weight="var(--theme--typography-semibold)">{label}</Text>
      </div>;
    }
    if (column.showAvatar) return <AvatarCell accentColor={resolveAvatarAccentColor(row, column)} image={row.image} name={String(value || row.name || row.customerName || "")} showInitials={column.avatarShowInitials} />;
    if (column.showMedia) return <Inline gap="sm" wrap={false}><AvatarCell image={row.image} name={String(value || row.name || "")} showName={false} size="sm" /><Text as="span" tone="default" variant="body" weight="var(--theme--typography-bold)">{label}</Text></Inline>;
    if (column.render) return column.render(row);
    if (isStatusColumn(column)) { const presentation = resolveStatusPresentation(row, column); return <Badge appearance="soft" indicator statusColor={presentation.statusColor} tone={presentation.tone}>{label}</Badge>; }
    return column.valueType === "currency" ? formatCurrencyCents(value, column.currency, column.locale) : label || t("common.emptyValue");
  };
  return <Card className={styles.tableCard} size="sm"><div className={styles.tableScroller}><table className={styles.table}><thead><tr>{viewModel.columns.map((column) => {
    const criterion = viewModel.sortCriterion?.key === column.key ? viewModel.sortCriterion : null;
    const columnLabel = t(column.labelKey, column.key);
    const sortActionLabelKey = criterion?.direction === "desc"
        ? "standard.sortAscending"
        : "standard.sortDescending";
    return <th key={column.key} scope="col">{column.sortable ? <div className={styles.sortButton}><span>{columnLabel}</span><span className={styles.sortControl}><button aria-label={t(sortActionLabelKey, undefined, { column: columnLabel })} aria-pressed={Boolean(criterion)} className={styles.sortDirectionButton} data-active={criterion?.direction || undefined} onClick={() => onSort(column.key)} type="button"><ArrowForwardIcon aria-hidden="true" className={[styles.sortMark, criterion?.direction === "asc" ? styles.sortAscending : styles.sortDescending].join(" ")} /></button></span></div> : columnLabel}</th>;
  })}{viewModel.showActions ? <th scope="col">{t("common.actions")}</th> : null}</tr></thead><tbody>{isLoading ? <tr><td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>{t("standard.loadingRows")}</td></tr> : displayRows.length === 0 ? <tr><td className={styles.emptyCell} colSpan={viewModel.emptyColSpan}>{hasActiveFilters ? t("standard.emptyFiltered") : t("common.emptyState")}</td></tr> : displayRows.map(({ row, ...treeNode }, rowIndex) => <tr key={treeNode.nodeKey || row.id || row.code || rowIndex} onClick={() => onSelectRow?.(row)}>{viewModel.columns.map((column) => <td key={column.key}>{renderCell(row, column, viewModel.tree ? { ...treeNode, row } : undefined)}</td>)}{viewModel.showActions ? <td className={styles.actionCell}><Button aria-label={t("common.edit")} appearance="transparent" icon={<EditIcon aria-hidden="true" />} iconPosition="only" onClick={(event) => { event.stopPropagation(); onSelectRow?.(row); }} size="xs" tone="neutral">{t("common.edit")}</Button></td> : null}</tr>)}</tbody></table></div>{!isLoading && viewModel.filteredRowsTotal > 0 ? <div className={styles.tableFooter}><Text as="p" tone="muted" variant="caption">{t("standard.showingPage", undefined, { shown: displayRows.length, total: viewModel.filteredRowsTotal })}</Text>{viewModel.pageCount > 1 ? <nav aria-label={t("standard.paginationAriaLabel")} className={styles.footerPagination}><Button aria-label={t("standard.previousPage")} appearance="transparent" disabled={viewModel.page === 1} icon={<ArrowBackIcon aria-hidden="true" />} iconPosition="only" onClick={() => onPageChange(viewModel.page - 1)} size="sm" tone="neutral">{t("standard.previousPage")}</Button><Button aria-label={t("standard.nextPage")} appearance="transparent" disabled={viewModel.page === viewModel.pageCount} icon={<ArrowForwardIcon aria-hidden="true" />} iconPosition="only" onClick={() => onPageChange(viewModel.page + 1)} size="sm" tone="neutral">{t("standard.nextPage")}</Button></nav> : null}</div> : null}</Card>;
};
