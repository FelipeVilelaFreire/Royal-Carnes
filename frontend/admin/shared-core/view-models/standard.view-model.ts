import type React from "react";

export interface AdminStandardFilterViewModel {
  key: string;
  labelKey: string;
  options: AdminStandardFieldOption[];
  value: string;
}

export interface AdminStandardColumnViewModel {
  currency?: string;
  format?: "cpf" | "cnpj" | "taxIdBR" | "phoneBR" | "postalCodeBR" | "decimalBR";
  key: string;
  labelKey: string;
  locale?: string;
  showAvatar?: boolean;
  showMedia?: boolean;
  sortable?: boolean;
  statusColorKey?: string;
  statusToneKey?: string;
  valueType?: "currency" | "status" | "text" | "translationKey";
  render?: (row: any) => React.ReactNode;
}

export interface AdminStandardListViewModel {
  activeFilterCount: number;
  actionLabelKey?: string;
  columns: AdminStandardColumnViewModel[];
  emptyColSpan: number;
  filters: AdminStandardFilterViewModel[];
  filteredRowsTotal: number;
  page: number;
  pageCount: number;
  rows: any[];
  rowsTotal: number;
  searchPlaceholderKey?: string;
  showActions: boolean;
  sortDirection: "asc" | "desc";
  sortKey: string;
  subtitleKey?: string;
  titleKey?: string;
}

export interface AdminStandardFormFieldViewModel {
  addLabelKey?: string;
  columns?: AdminStandardLineItemColumnViewModel[];
  currency?: string;
  defaultValue?: any;
  displayKey?: string;
  format?: "cpf" | "cnpj" | "taxIdBR" | "phoneBR" | "postalCodeBR" | "decimalBR";
  helperKey?: string;
  key: string;
  labelKey: string;
  locale?: string;
  max?: number;
  min?: number;
  layout?: "full";
  options?: AdminStandardFieldOption[];
  placeholderKey?: string;
  required?: boolean;
  source?: string;
  suffixKey?: string;
  type: "asset" | "currency" | "date" | "datetime" | "lineItems" | "multiSelect" | "number" | "select" | "textarea" | "text";
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
  addLabelKey?: string;
  columns?: AdminStandardLineItemColumnViewModel[];
  currency?: string;
  displayKey?: string;
  format?: "cpf" | "cnpj" | "taxIdBR" | "phoneBR" | "postalCodeBR" | "decimalBR";
  hierarchy?: AdminStandardLineItemsHierarchyViewModel;
  editable?: boolean;
  editType?: "asset" | "currency" | "date" | "datetime" | "lineItems" | "multiSelect" | "number" | "select" | "textarea" | "text";
  key: string;
  labelKey: string;
  locale?: string;
  max?: number;
  min?: number;
  layout?: "full";
  options?: AdminStandardFieldOption[];
  optionPresentation?: "media" | "text";
  source?: string;
  searchable?: boolean;
  searchEmptyKey?: string;
  searchPlaceholderKey?: string;
  suffixKey?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | "full";
  transitionOnly?: boolean;
  type?: "asset" | "currency" | "date" | "datetime" | "lineItems" | "multiSelect" | "number" | "select" | "textarea" | "text";
  value: any;
  rawValue: any;
  valueType?: "optionLabel" | "text" | "translationKey";
}

interface AdminStandardDetailSectionBaseViewModel {
  grid?: { desktop?: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; mobile?: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; tablet?: 1 | 2 | 3 | 4 | 5 | 6 | "auto"; };
  iconIntent?: string;
  key: string;
  titleKey?: string;
}

export interface AdminStandardDetailFieldsSectionViewModel extends AdminStandardDetailSectionBaseViewModel {
  entries: AdminStandardDetailEntryViewModel[];
  type: "fields";
}

export interface AdminStandardDetailLineItemsSectionViewModel extends AdminStandardDetailSectionBaseViewModel {
  entry: AdminStandardDetailEntryViewModel;
  type: "lineItems";
}

export type AdminStandardDetailSectionViewModel =
  | AdminStandardDetailFieldsSectionViewModel
  | AdminStandardDetailLineItemsSectionViewModel;

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
  headerMeta: AdminStandardDetailEntryViewModel[];
  headerStatus?: AdminStandardDetailEntryViewModel;
  quickInfo: AdminStandardDetailEntryViewModel[];
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
  meta?: Record<string, unknown>;
  value: string;
}

export type AdminStandardOptionSources = Record<string, AdminStandardFieldOption[]>;

export interface AdminStandardLineItemColumnViewModel {
  align?: "end" | "start";
  currency?: string;
  format?: "decimalBR";
  key: string;
  labelKey: string;
  locale?: string;
  maxKey?: string;
  presentation?: "media" | "text";
  options?: AdminStandardFieldOption[];
  required?: boolean;
  readOnly?: boolean;
  source?: string;
  sourceBy?: string;
  sourceOptions?: Record<string, AdminStandardFieldOption[]>;
  span?: 1 | 2 | 3 | 4 | 5 | 6;
  sources?: Record<string, string>;
  suffixKey?: string;
  type: "currency" | "number" | "select" | "text";
  writeOptionMeta?: Record<string, string>;
  writeValues?: Record<string, unknown>;
}

export interface AdminStandardLineItemsHierarchyViewModel {
  limitLabelKey: string;
  maxSelectionsLabelKey?: string;
  maxSelectionsKey?: string;
  pathKey: string;
  quantityKey: string;
}

function resolveLineItemColumns(
  columns: any[] = [],
  optionSources: AdminStandardOptionSources,
): AdminStandardLineItemColumnViewModel[] {
  return columns.map((column: any) => ({
    align: column.align,
    currency: column.currency,
    format: column.format,
    key: column.key,
    labelKey: column.labelKey,
    locale: column.locale,
    maxKey: column.maxKey,
    presentation: column.presentation,
    readOnly: column.readOnly,
    options: resolveOptions(column, optionSources),
    required: column.required,
    source: column.source,
    sourceBy: column.sourceBy,
    sourceOptions: Object.fromEntries(
      Object.entries(column.sources || {}).map(([value, source]) => [
        value,
        optionSources[String(source)] || [],
      ]),
    ),
    sources: column.sources,
    span: column.span,
    suffixKey: column.suffixKey,
    type: column.type || "text",
    writeOptionMeta: column.writeOptionMeta,
    writeValues: column.writeValues,
  }));
}

function resolveEntryColumns(
  field: any,
  optionSources: AdminStandardOptionSources,
): AdminStandardLineItemColumnViewModel[] {
  return resolveLineItemColumns(field.columns, optionSources);
}

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

function resolveFieldValue(row: Record<string, any>, field: any): any {
  const displayValue = field.displayKey ? row[field.displayKey] : row[field.key];
  if (Array.isArray(displayValue)) return field.type === "lineItems" ? displayValue : displayValue.join(", ");
  if (displayValue === undefined || displayValue === null) return "";
  return String(displayValue);
}

function resolveDetailFieldSpan(field: any): AdminStandardDetailEntryViewModel["span"] {
  if (field.span) return field.span;
  if (field.layout === "full" || ["asset", "lineItems", "textarea"].includes(field.type)) {
    return "full";
  }
  return undefined;
}

function resolveDetailSectionIconIntent(tabId = "", sectionKey = ""): string {
  const intentKey = `${tabId} ${sectionKey}`.toLocaleLowerCase("pt-BR");
  if (/(dados|data|identity|summary|resumo|cliente|customer|perfil|profile)/.test(intentKey)) return "identity";
  if (/(catalog|categoria|category|colec|collection)/.test(intentKey)) return "catalog";
  if (/(preco|price|valor|value|pagamento|payment|commerc|commercial)/.test(intentKey)) return "commerce";
  if (/(entrega|delivery|address|enderec|fulfillment)/.test(intentKey)) return "delivery";
  if (/(midia|media|variant|variante|item|pedido|order|ciclo|cycle)/.test(intentKey)) return "box";
  return "settings";
}

function hasVisibleDetailEntry(
  tab: any,
  row: Record<string, any>,
  optionSources: AdminStandardOptionSources,
): boolean {
  const tabFields = tab.sections?.flatMap((section: any) => (
    section.type === "lineItems"
      ? [{ ...section, key: section.itemsKey, labelKey: section.labelKey || section.titleKey, type: "lineItems" }]
      : section.fields || []
  )) || tab.fields || [];
  return tabFields
    .map((field: any) => createDetailEntry(field, row, optionSources))
    .some((entry: AdminStandardDetailEntryViewModel) => entry.value !== "" || entry.editable);
}

function createDetailEntry(
  field: any,
  row: Record<string, any>,
  optionSources: AdminStandardOptionSources,
): AdminStandardDetailEntryViewModel {
  const display = field.display && typeof field.display === "object" ? field.display : {};
  const edit = field.edit && typeof field.edit === "object" ? field.edit : {};
  const displayField = {
    ...field,
    displayKey: display.key || field.displayKey,
    type: display.type || field.type || "text",
    valueType: display.valueType || field.valueType,
  };
  const editorField = { ...field, ...edit };
  return {
    addLabelKey: editorField.addLabelKey,
    columns: resolveEntryColumns(editorField, optionSources),
    currency: editorField.currency || displayField.currency,
    displayKey: displayField.displayKey,
    editable: Boolean(field.edit || field.editable),
    editType: editorField.type,
    format: editorField.format,
    hierarchy: editorField.hierarchy,
    key: field.key,
    labelKey: field.labelKey,
    locale: editorField.locale || displayField.locale,
    max: editorField.max,
    min: editorField.min,
    layout: displayField.layout || (displayField.type === "lineItems" ? "full" : undefined),
    options: resolveOptions(editorField, optionSources),
    optionPresentation: editorField.optionPresentation,
    rawValue: row[field.key],
    source: editorField.source,
    searchable: Boolean(editorField.searchable),
    searchEmptyKey: editorField.searchEmptyKey,
    searchPlaceholderKey: editorField.searchPlaceholderKey,
    suffixKey: editorField.suffixKey,
    span: resolveDetailFieldSpan(displayField),
    transitionOnly: Boolean(editorField.transitionOnly),
    type: displayField.type,
    value: resolveFieldValue(row, displayField),
    valueType: displayField.valueType,
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
  page = 1,
  pageSize = 10,
  sortKey = "",
  sortDirection: "asc" | "desc" = "asc",
): AdminStandardListViewModel {
  const config = entityConfig?.listPage || entityConfig || {};
  const columns = (config.columns || []).map((column: any) => ({
    ...column,
    sortable: column.sortable !== false,
  }));
  const rowsSource = rowsOverride || config.rows || [];
  const filters = config.filters || [];
  const showActions = Boolean(config.showActions);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = rowsSource.filter((row: any) => {
    const rowValuesString = Object.values(row).join(" ").toLowerCase();
    const matchesSearch = !normalizedSearch || rowValuesString.includes(normalizedSearch);
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (value === "all") return true;
      const rowValue = String(row[key] || "").toLowerCase();
      return rowValue === value.toLowerCase();
    });
    return matchesSearch && matchesFilters;
  });
  const sortedRows = [...filteredRows].sort((left: any, right: any) => {
    if (!sortKey) return 0;
    const leftValue = left[sortKey];
    const rightValue = right[sortKey];
    const direction = sortDirection === "desc" ? -1 : 1;
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * direction;
    }
    return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), "pt-BR", {
      numeric: true,
      sensitivity: "base",
    }) * direction;
  });
  const normalizedPageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / normalizedPageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const firstRowIndex = (currentPage - 1) * normalizedPageSize;
  const rows = sortedRows.slice(firstRowIndex, firstRowIndex + normalizedPageSize);
  const activeFilterCount = Object.values(filterValues).filter((value) => value !== "all").length;

  return {
    activeFilterCount,
    actionLabelKey: config.actionLabelKey,
    columns,
    emptyColSpan: Math.max(1, columns.length + (showActions ? 1 : 0)),
    filters: filters.map((filter: any) => ({
      key: filter.key,
      labelKey: filter.labelKey,
      options: filter.options || [],
      value: filterValues[filter.key] || "all",
    })),
    filteredRowsTotal: filteredRows.length,
    page: currentPage,
    pageCount,
    rows,
    rowsTotal: rowsSource.length,
    searchPlaceholderKey: config.searchPlaceholderKey,
    showActions,
    sortDirection,
    sortKey,
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
      addLabelKey: field.addLabelKey,
      columns: resolveEntryColumns(field, optionSources),
      defaultValue: field.defaultValue,
      currency: field.currency,
      displayKey: field.displayKey,
      format: field.format,
      helperKey: field.helperKey,
      key: field.key,
      labelKey: field.labelKey,
      locale: field.locale,
      max: field.max,
      min: field.min,
      layout: field.layout || (field.type === "lineItems" ? "full" : undefined),
      options: resolveOptions(field, optionSources),
      placeholderKey: field.placeholderKey,
      required: field.required,
      source: field.source,
      suffixKey: field.suffixKey,
      type: field.type || "text",
      value: resolveFormFieldValue(values, field),
    })),
    missingFieldKeys,
    sections: sections.map((section: any) => ({
      fields: (section.fields || []).map((field: any) => ({
        addLabelKey: field.addLabelKey,
        columns: resolveEntryColumns(field, optionSources),
        defaultValue: field.defaultValue,
        currency: field.currency,
        displayKey: field.displayKey,
        format: field.format,
        helperKey: field.helperKey,
        key: field.key,
        labelKey: field.labelKey,
        locale: field.locale,
        max: field.max,
        min: field.min,
        layout: field.layout || (field.type === "lineItems" ? "full" : undefined),
        options: resolveOptions(field, optionSources),
        placeholderKey: field.placeholderKey,
        required: field.required,
        source: field.source,
        suffixKey: field.suffixKey,
        type: field.type || "text",
        value: resolveFormFieldValue(values, field),
      })),
      key: section.key,
      iconIntent: section.iconIntent,
      grid: section.grid,
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
  const configuredTabs = detailConfig?.tabs || [
    { id: "summary", labelKey: "details.tabs.summary" },
  ];
  const visibleTabs = configuredTabs.filter(
    (tab: any) => tab.hideWhenEmpty === false || hasVisibleDetailEntry(tab, row, optionSources),
  );
  const tabs = visibleTabs.length ? visibleTabs : configuredTabs;
  const currentTab = tabs.find((tab: any) => tab.id === activeTab) || tabs[0];
  const configuredSections = currentTab?.sections || [];
  const configuredDetailSections = configuredSections
    .map((section: any): AdminStandardDetailSectionViewModel | null => {
      const base = {
        grid: section.grid,
        iconIntent: section.iconIntent || resolveDetailSectionIconIntent(currentTab?.id, section.key),
        key: section.key,
        titleKey: section.titleKey || currentTab?.labelKey,
      };

      if (section.type === "lineItems") {
        const entry = createDetailEntry({
          ...section,
          key: section.itemsKey,
          labelKey: section.labelKey || section.titleKey,
          type: "lineItems",
        }, row, optionSources);
        return entry.value !== "" || entry.editable ? { ...base, entry, type: "lineItems" } : null;
      }

      const entries = (section.fields || [])
        .map((field: any) => createDetailEntry(field, row, optionSources))
        .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== "" || entry.editable);
      return entries.length ? { ...base, entries, type: "fields" } : null;
    })
    .filter((section: AdminStandardDetailSectionViewModel | null): section is AdminStandardDetailSectionViewModel => Boolean(section));
  const fields = currentTab?.fields || [];
  const directEntries = fields
    .map((field: any) => createDetailEntry(field, row, optionSources))
    .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== "" || entry.editable);
  const sections = configuredDetailSections.length
    ? configuredDetailSections
    : directEntries.length
    ? [{
        entries: directEntries,
        iconIntent: resolveDetailSectionIconIntent(currentTab?.id, currentTab?.id),
        key: currentTab?.id || "default",
        titleKey: currentTab?.labelKey,
        type: "fields" as const,
      }]
    : [];
  const headerMeta = (detailConfig?.header?.meta || [])
    .map((field: any) => createDetailEntry(field, row, optionSources))
    .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== "");
  const headerStatus = detailConfig?.header?.status
    ? createDetailEntry(detailConfig.header.status, row, optionSources)
    : undefined;
  const quickInfo = (detailConfig?.quickInfo || [])
    .map((field: any) => createDetailEntry(field, row, optionSources))
    .filter((entry: AdminStandardDetailEntryViewModel) => entry.value !== "");
  const entries = sections.length
    ? sections.flatMap((section: AdminStandardDetailSectionViewModel) => (
        section.type === "lineItems" ? [section.entry] : section.entries
      ))
    : fields.length
    ? directEntries
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
    headerMeta,
    headerStatus,
    quickInfo,
    sections,
    tabs,
    titleKey: detailConfig?.titleKey,
  };
}
