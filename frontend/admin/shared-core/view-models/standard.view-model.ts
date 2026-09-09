import type React from "react";

export interface AdminStandardFilterViewModel {
  key: string;
  labelKey: string;
  options: AdminStandardFieldOption[];
  value: string;
}

export interface AdminStandardColumnViewModel {
  currency?: string;
  key: string;
  labelKey: string;
  locale?: string;
  showAvatar?: boolean;
  showMedia?: boolean;
  valueType?: "currency" | "text" | "translationKey";
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
  currency?: string;
  defaultValue?: any;
  displayKey?: string;
  helperKey?: string;
  key: string;
  labelKey: string;
  locale?: string;
  options?: AdminStandardFieldOption[];
  placeholderKey?: string;
  required?: boolean;
  source?: string;
  type: "asset" | "currency" | "multiSelect" | "number" | "select" | "textarea" | "text";
  value: any;
}

export interface AdminStandardFormSectionViewModel {
  fields: AdminStandardFormFieldViewModel[];
  key: string;
  titleKey?: string;
}

export interface AdminStandardFormViewModel {
  canSubmit: boolean;
  fields: AdminStandardFormFieldViewModel[];
  missingFieldKeys: string[];
  sections: AdminStandardFormSectionViewModel[];
  submitLabelKey?: string;
  titleKey?: string;
  values: Record<string, any>;
}

export interface AdminStandardDetailEntryViewModel {
  currency?: string;
  displayKey?: string;
  editable?: boolean;
  key: string;
  labelKey: string;
  locale?: string;
  options?: AdminStandardFieldOption[];
  source?: string;
  type?: "asset" | "currency" | "multiSelect" | "number" | "select" | "textarea" | "text";
  value: string;
  rawValue: any;
  valueType?: "optionLabel" | "text" | "translationKey";
}

export interface AdminStandardDetailSectionViewModel {
  entries: AdminStandardDetailEntryViewModel[];
  key: string;
  titleKey?: string;
}

export interface AdminStandardDetailTabViewModel {
  id: string;
  emptyKey?: string;
  labelKey: string;
}

export interface AdminStandardDetailViewModel {
  activeTab: string;
  displayName: string;
  entries: AdminStandardDetailEntryViewModel[];
  emptyKey?: string;
  sections: AdminStandardDetailSectionViewModel[];
  tabs: AdminStandardDetailTabViewModel[];
  titleKey?: string;
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

export interface AdminStandardFieldOption {
  label?: string;
  labelKey?: string;
  value: string;
}

export type AdminStandardOptionSources = Record<string, AdminStandardFieldOption[]>;

function resolveOptions(field: any, optionSources: AdminStandardOptionSources): AdminStandardFieldOption[] {
  return field.source ? optionSources[field.source] || [] : field.options || [];
}

function resolveFormFieldValue(values: Record<string, any>, field: any): any {
  return Object.prototype.hasOwnProperty.call(values, field.key)
    ? values[field.key]
    : field.defaultValue ?? "";
}

function isMissingRequiredValue(value: any): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function resolveFieldValue(row: Record<string, any>, field: any): string {
  const displayValue = field.displayKey ? row[field.displayKey] : row[field.key];
  if (Array.isArray(displayValue)) return displayValue.join(", ");
  if (displayValue === undefined || displayValue === null) return "";
  return String(displayValue);
}

function createDetailEntry(
  field: any,
  row: Record<string, any>,
  optionSources: AdminStandardOptionSources,
): AdminStandardDetailEntryViewModel {
  return {
    currency: field.currency,
    displayKey: field.displayKey,
    editable: field.editable,
    key: field.key,
    labelKey: field.labelKey,
    locale: field.locale,
    options: resolveOptions(field, optionSources),
    rawValue: row[field.key],
    source: field.source,
    type: field.type || "text",
    value: resolveFieldValue(row, field),
    valueType: field.valueType,
  };
}

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
  const showActions = false;
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
  optionSources: AdminStandardOptionSources = {},
): AdminStandardFormViewModel {
  const sections = formConfig?.sections || [];
  const flatFields = sections.length
    ? sections.flatMap((section: any) => section.fields || [])
    : formConfig?.fields || [];
  const missingFieldKeys = flatFields
    .filter((field: any) => field.required && isMissingRequiredValue(resolveFormFieldValue(values, field)))
    .map((field: any) => field.key);

  return {
    canSubmit: missingFieldKeys.length === 0,
    fields: flatFields.map((field: any) => ({
      defaultValue: field.defaultValue,
      currency: field.currency,
      displayKey: field.displayKey,
      helperKey: field.helperKey,
      key: field.key,
      labelKey: field.labelKey,
      locale: field.locale,
      options: resolveOptions(field, optionSources),
      placeholderKey: field.placeholderKey,
      required: field.required,
      source: field.source,
      type: field.type || "text",
      value: resolveFormFieldValue(values, field),
    })),
    missingFieldKeys,
    sections: sections.map((section: any) => ({
      fields: (section.fields || []).map((field: any) => ({
        defaultValue: field.defaultValue,
        currency: field.currency,
        displayKey: field.displayKey,
        helperKey: field.helperKey,
        key: field.key,
        labelKey: field.labelKey,
        locale: field.locale,
        options: resolveOptions(field, optionSources),
        placeholderKey: field.placeholderKey,
        required: field.required,
        source: field.source,
        type: field.type || "text",
        value: resolveFormFieldValue(values, field),
      })),
      key: section.key,
      titleKey: section.titleKey,
    })),
    submitLabelKey: formConfig?.submitLabelKey,
    titleKey: formConfig?.titleKey,
    values,
  };
}

export function createAdminStandardDetailViewModel(
  detailConfig: any,
  entityName: string,
  row: Record<string, any>,
  activeTab: string,
  optionSources: AdminStandardOptionSources = {},
): AdminStandardDetailViewModel {
  const displayNameKey = detailConfig?.displayNameKey;
  const displayName = (displayNameKey ? row[displayNameKey] : null) || row.name || row.customerName || row.title || row.code || entityName;
  const tabs = detailConfig?.tabs || [
    { id: "summary", labelKey: "details.tabs.summary" },
  ];
  const currentTab = tabs.find((tab: any) => tab.id === activeTab) || tabs[0];
  const configuredSections = currentTab?.sections || [];
  const sections = configuredSections
    .map((section: any) => ({
      entries: (section.fields || [])
        .map((field: any) => createDetailEntry(field, row, optionSources))
        .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== ""),
      key: section.key,
      titleKey: section.titleKey,
    }))
    .filter((section: AdminStandardDetailSectionViewModel) => section.entries.length > 0);
  const fields = currentTab?.fields || [];
  const entries = sections.length
    ? sections.flatMap((section: AdminStandardDetailSectionViewModel) => section.entries)
    : fields.length
      ? fields
        .map((field: any) => createDetailEntry(field, row, optionSources))
        .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== "")
    : Object.entries(row)
        .filter(([key, value]) => !excludedSummaryKeys.has(key) && value !== undefined && value !== null && typeof value !== "object")
        .map(([key, value]) => ({
          key,
          labelKey: `details.fields.${key}`,
          rawValue: value,
          type: "text",
          value: String(value),
        }));

  return {
    activeTab: currentTab?.id || activeTab,
    displayName,
    entries,
    emptyKey: currentTab?.emptyKey,
    sections,
    tabs,
    titleKey: detailConfig?.titleKey,
  };
}
