import type React from "react";

export interface AdminStandardFilterViewModel {
  key: string;
  labelKey: string;
  options: Array<{ labelKey: string; value: string }>;
  value: string;
}

export interface AdminStandardColumnViewModel {
  key: string;
  labelKey: string;
  showAvatar?: boolean;
  showMedia?: boolean;
  render?: (row: any) => React.ReactNode;
}

export interface AdminStandardListViewModel {
  actionLabelKey?: string;
  columns: AdminStandardColumnViewModel[];
  emptyColSpan: number;
  filters: AdminStandardFilterViewModel[];
  rows: any[];
  rowsTotal: number;
  searchPlaceholderKey?: string;
  showActions: boolean;
  subtitleKey?: string;
  titleKey?: string;
}

export interface AdminStandardFormFieldViewModel {
  key: string;
  labelKey: string;
  options?: Array<{ labelKey: string; value: string }>;
  required?: boolean;
  type: "asset" | "select" | "textarea" | "text";
  value: any;
}

export interface AdminStandardFormViewModel {
  fields: AdminStandardFormFieldViewModel[];
  values: Record<string, any>;
}

export interface AdminStandardDetailEntryViewModel {
  key: string;
  value: string;
}

export interface AdminStandardDetailTabViewModel {
  id: string;
  labelKey: string;
}

export interface AdminStandardDetailViewModel {
  activeTab: string;
  displayName: string;
  entries: AdminStandardDetailEntryViewModel[];
  tabs: AdminStandardDetailTabViewModel[];
}

const excludedSummaryKeys = new Set([
  "boxMonth",
  "customerName",
  "id",
  "image",
  "member",
  "name",
  "priceMonthlyFormatted",
  "statusLabel",
  "title",
  "totalFormatted",
]);

export function createAdminStandardInitialFilters(filters: any[] = []) {
  return Object.fromEntries(filters.map((filter) => [filter.key, "all"]));
}

export function createAdminStandardListViewModel(
  entityConfig: any,
  search: string,
  filterValues: Record<string, string>,
  rowsOverride?: any[] | null,
): AdminStandardListViewModel {
  const config = entityConfig?.listPage || entityConfig || {};
  const columns = config.columns || [];
  const rowsSource = rowsOverride || config.rows || [];
  const filters = config.filters || [];
  const showActions = Boolean(config.showActions);
  const normalizedSearch = search.trim().toLowerCase();

  const rows = rowsSource.filter((row: any) => {
    const rowValuesString = Object.values(row).join(" ").toLowerCase();
    const matchesSearch = !normalizedSearch || rowValuesString.includes(normalizedSearch);
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (value === "all") return true;
      const rowValue = String(row[key] || "").toLowerCase();
      return rowValue === value.toLowerCase();
    });
    return matchesSearch && matchesFilters;
  });

  return {
    actionLabelKey: config.actionLabelKey,
    columns,
    emptyColSpan: Math.max(1, columns.length + (showActions ? 1 : 0)),
    filters: filters.map((filter: any) => ({
      key: filter.key,
      labelKey: filter.labelKey,
      options: filter.options || [],
      value: filterValues[filter.key] || "all",
    })),
    rows,
    rowsTotal: rowsSource.length,
    searchPlaceholderKey: config.searchPlaceholderKey,
    showActions,
    subtitleKey: config.subtitleKey,
    titleKey: config.titleKey,
  };
}

export function createAdminStandardFormViewModel(
  formConfig: any,
  values: Record<string, any>,
): AdminStandardFormViewModel {
  return {
    fields: (formConfig?.fields || []).map((field: any) => ({
      key: field.key,
      labelKey: field.labelKey,
      options: field.options || [],
      required: field.required,
      type: field.type || "text",
      value: values[field.key] || "",
    })),
    values,
  };
}

export function createAdminStandardDetailViewModel(
  entityName: string,
  row: Record<string, any>,
  activeTab: string,
): AdminStandardDetailViewModel {
  const displayName = row.name || row.customerName || row.title || row.code || entityName;
  const entries = Object.entries(row)
    .filter(([key, value]) => !excludedSummaryKeys.has(key) && value !== undefined && value !== null && typeof value !== "object")
    .map(([key, value]) => ({
      key,
      value: String(value),
    }));

  return {
    activeTab,
    displayName,
    entries,
    tabs: [
      { id: "summary", labelKey: "details.tabs.summary" },
      { id: "specs", labelKey: "details.tabs.specs" },
      { id: "history", labelKey: "details.tabs.history" },
    ],
  };
}
