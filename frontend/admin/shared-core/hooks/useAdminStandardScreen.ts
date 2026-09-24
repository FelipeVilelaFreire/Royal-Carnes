import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { ApiClientConfig, ApiErrorEnvelope } from "../../../shared-core";
import {
  createAdminStandardRow,
  deleteAdminStandardRow,
  loadAdminStandardOptionSources,
  loadAdminStandardRow,
  loadAdminStandardRows,
  transitionAdminStandardRow,
  updateAdminStandardRow,
  type AdminStandardDataSourceConfig,
  type AdminStandardOptionSourceScope,
} from "../data-sources/standard.data-source";
import {
  createAdminStandardDetailViewModel,
  createAdminStandardFormViewModel,
  createAdminStandardInitialFilters,
  createAdminStandardListViewModel,
  type AdminStandardOptionSources,
  type AdminStandardSortCriterionViewModel,
} from "../view-models/standard.view-model";
import { readAdminSessionCache, writeAdminSessionCache } from "../state/adminSessionCache";

export interface UseAdminStandardScreenOptions {
  entityConfig: any;
  apiConfig?: ApiClientConfig;
  initialSelectedRow?: Record<string, any> | null;
  onBack?: () => void;
  onSubmit?: (values: Record<string, any>) => void;
  routeAction?: "create" | "detail" | "list";
}

function collectFormFields(formConfig: any): any[] {
  const sections = formConfig?.sections || [];
  return sections.length
    ? sections.flatMap((section: any) => section.fields || [])
    : formConfig?.fields || [];
}

function collectDetailFields(detailConfig: any): any[] {
  return (detailConfig?.tabs || []).flatMap((tab: any) => [
    ...(tab.fields || []),
    ...(tab.sections || []).flatMap((section: any) => (
      section.type === "lineItems"
        ? [{ ...section, key: section.itemsKey, type: "lineItems" }]
        : section.fields || []
    )),
  ]);
}

function applyFormDefaults(formConfig: any, values: Record<string, any>): Record<string, any> {
  return collectFormFields(formConfig).reduce((nextValues, field) => {
    if (
      field.defaultValue !== undefined &&
      !Object.prototype.hasOwnProperty.call(nextValues, field.key)
    ) {
      return { ...nextValues, [field.key]: field.defaultValue };
    }
    return nextValues;
  }, values);
}

export function useAdminStandardScreen({
  apiConfig,
  entityConfig,
  initialSelectedRow,
  onBack,
  onSubmit,
  routeAction = "list",
}: UseAdminStandardScreenOptions) {
  const config = entityConfig?.listPage || entityConfig || {};
  const dataSource = entityConfig?.dataSource as AdminStandardDataSourceConfig | undefined;
  const rowsCacheKey = dataSource?.key ? `standard-rows:${dataSource.key}` : null;
  const cachedRows = rowsCacheKey ? readAdminSessionCache<any[]>(rowsCacheKey) : null;
  const optionSourceScope: AdminStandardOptionSourceScope = routeAction === "create"
    ? "form"
    : routeAction === "detail"
      ? "detail"
      : "list";
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    createAdminStandardInitialFilters(config.filters || []),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(config.pagination?.pageSize || 10);
  const [sortCriterion, setSortCriterion] = useState<AdminStandardSortCriterionViewModel | null>(() => (
    config.defaultSort?.key ? { key: config.defaultSort.key, direction: config.defaultSort.direction === "asc" ? "asc" : "desc" } : null
  ));
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("summary");
  const [rowsOverride, setRowsOverride] = useState<any[] | null>(cachedRows);
  const [loadedRowsCacheKey, setLoadedRowsCacheKey] = useState<string | null>(cachedRows ? rowsCacheKey : null);
  const [optionSources, setOptionSources] = useState<AdminStandardOptionSources>({});
  const [isOptionSourcesLoading, setIsOptionSourcesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(!cachedRows && Boolean(dataSource?.key));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingWorkflowRowId, setUpdatingWorkflowRowId] = useState<string | number | null>(null);
  const [isDeletingDetail, setIsDeletingDetail] = useState(false);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [selectedRowOverride, setSelectedRowOverride] = useState<Record<string, any> | null>(null);
  const [loadedDetailId, setLoadedDetailId] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const previousRouteActionRef = useRef(routeAction);
  const rowsForCurrentDataSource = loadedRowsCacheKey === rowsCacheKey ? rowsOverride : cachedRows;
  const selectedRowId = initialSelectedRow?.id === undefined ? null : String(initialSelectedRow.id);
  const enteredDetail = routeAction === "detail" && previousRouteActionRef.current !== "detail";
  const detailRow = selectedRowOverride && String(selectedRowOverride.id) === selectedRowId
    ? selectedRowOverride
    : initialSelectedRow || {};
  const detailConfig = entityConfig?.detailPage;
  const formConfig = entityConfig?.addPage || entityConfig?.form;
  const editableDetailFields = collectDetailFields(detailConfig).filter((field: any) => field.editable);

  useEffect(() => {
    let isActive = true;

    async function loadSources() {
      setIsOptionSourcesLoading(true);
      const result = await loadAdminStandardOptionSources(entityConfig, apiConfig, { scope: optionSourceScope });
      if (!isActive) return;
      setOptionSources(result.optionSources);
      if (result.error) setError(result.error);
      setIsOptionSourcesLoading(false);
    }

    loadSources();

    return () => {
      isActive = false;
    };
  }, [apiConfig, entityConfig, optionSourceScope]);

  useEffect(() => {
    let isActive = true;

    async function loadRows() {
      if (!dataSource?.key) {
        setRowsOverride(null);
        setLoadedRowsCacheKey(null);
        setIsFallback(false);
        setError(null);
        setIsLoading(false);
        return;
      }

      setRowsOverride(cachedRows);
      setLoadedRowsCacheKey(cachedRows ? rowsCacheKey : null);
      setIsLoading(!cachedRows);
      const result = await loadAdminStandardRows(dataSource, apiConfig);
      if (!isActive) return;

      const nextRows = result.error && cachedRows ? cachedRows : result.rows;
      setRowsOverride(nextRows);
      setLoadedRowsCacheKey(nextRows ? rowsCacheKey : null);
      if (!result.error && rowsCacheKey && Array.isArray(result.rows)) {
        writeAdminSessionCache(rowsCacheKey, result.rows);
      }
      setIsFallback(result.isFallback);
      setError(result.error);
      setIsLoading(false);
    }

    loadRows();

    return () => {
      isActive = false;
    };
  }, [apiConfig, dataSource, rowsCacheKey]);

  useEffect(() => {
    previousRouteActionRef.current = routeAction;
  }, [routeAction]);

  useEffect(() => {
    setSortCriterion(config.defaultSort?.key ? { key: config.defaultSort.key, direction: config.defaultSort.direction === "asc" ? "asc" : "desc" } : null);
    setCurrentPage(1);
  }, [config.defaultSort?.direction, config.defaultSort?.key]);

  useEffect(() => {
    let isActive = true;
    const rowId = initialSelectedRow?.id;

    async function loadDetail() {
      setSelectedRowOverride(null);
      setLoadedDetailId(null);
      if (routeAction !== "detail" || !dataSource?.key || rowId === undefined) {
        setIsDetailLoading(false);
        return;
      }

      setIsDetailLoading(true);

      const result = await loadAdminStandardRow(dataSource, rowId, apiConfig);
      if (!isActive) return;
      if (result.error) {
        setError(result.error);
        setLoadedDetailId(String(rowId));
        setIsDetailLoading(false);
        return;
      }
      setSelectedRowOverride(result.row);
      setLoadedDetailId(String(rowId));
      setIsDetailLoading(false);
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [apiConfig, dataSource, initialSelectedRow?.id, routeAction]);

  const setFilterValue = useCallback((key: string, value: string) => {
    setFilterValues((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  }, []);

  const setSearchValue = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const resetListFilters = useCallback(() => {
    setSearch("");
    setFilterValues(createAdminStandardInitialFilters(config.filters || []));
    setCurrentPage(1);
  }, [config.filters]);

  const cycleListSortDirection = useCallback((key: string) => {
    setSortCriterion((current) => {
      if (current?.key !== key) return { key, direction: "desc" };
      return { key, direction: current.direction === "desc" ? "asc" : "desc" };
    });
    setCurrentPage(1);
  }, []);

  const setFormValue = useCallback((key: string, value: any) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  }, []);

  const submitForm = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault();
      if (!dataSource?.key) {
        onSubmit?.(formValues);
        return;
      }

      setIsSubmitting(true);
      const submitValues = applyFormDefaults(formConfig, formValues);
      const result = await createAdminStandardRow(dataSource, submitValues, apiConfig);
      setIsSubmitting(false);
      if (result.error) {
        setError(result.error);
        return;
      }

      setFormValues({});
      setRowsOverride((current) => (result.row ? [result.row, ...(current || [])] : current));
      onSubmit?.(submitValues);
    },
    [apiConfig, dataSource, formConfig, formValues, onSubmit],
  );

  const beginDetailEdit = useCallback(() => {
    setFormValues(
      Object.fromEntries(editableDetailFields.map((field: any) => [field.key, detailRow[field.key] ?? ""])),
    );
    setIsEditingDetail(true);
  }, [detailRow, editableDetailFields]);

  const cancelDetailEdit = useCallback(() => {
    setFormValues({});
    setIsEditingDetail(false);
  }, []);

  const submitDetailEdit = useCallback(async () => {
    const rowId = detailRow?.id;
    if (!dataSource?.key || rowId === undefined) return;

    setIsSubmitting(true);
    const result = await updateAdminStandardRow(dataSource, rowId, formValues, apiConfig);
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.row) {
      setSelectedRowOverride(result.row);
      setRowsOverride((current) => current?.map((row) => (row.id === result.row.id ? result.row : row)) || current);
    }
    setFormValues({});
    setIsEditingDetail(false);
  }, [apiConfig, dataSource, detailRow, formValues]);

  const transitionWorkflowRow = useCallback(async (rowId: string | number, statusKey: string) => {
    const workflow = entityConfig?.listPage?.workflow;
    if (!workflow?.actionKey) return;
    setError(null);
    setUpdatingWorkflowRowId(rowId);
    const result = await transitionAdminStandardRow(dataSource, rowId, workflow.actionKey, statusKey, apiConfig);
    setUpdatingWorkflowRowId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.row) {
      setRowsOverride((current) => current?.map((row) => String(row.id) === String(result.row.id) ? result.row : row) || current);
      setSelectedRowOverride((current) => current && String(current.id) === String(result.row?.id) ? result.row : current);
    }
  }, [apiConfig, dataSource, entityConfig?.listPage?.workflow]);

  const deleteDetail = useCallback(async () => {
    const rowId = detailRow?.id;
    if (!dataSource?.key || rowId === undefined) return;

    setIsDeletingDetail(true);
    const result = await deleteAdminStandardRow(dataSource, rowId, apiConfig);
    setIsDeletingDetail(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    setRowsOverride((current) => current?.filter((row) => row.id !== rowId) || current);
    onBack?.();
  }, [apiConfig, dataSource, detailRow, onBack]);

  return useMemo(
    () => ({
      activeTab,
      beginDetailEdit,
      cancelDetailEdit,
      deleteDetail,
      detailViewModel: createAdminStandardDetailViewModel(
        entityConfig?.detailPage,
        entityConfig?.entityNameKey || entityConfig?.entityName || "",
        detailRow,
        activeTab,
        optionSources,
      ),
      error,
      formViewModel: createAdminStandardFormViewModel(formConfig, formValues, optionSources),
      formValues,
      hasEditableDetailFields: editableDetailFields.length > 0,
      isDetailInitialLoading: routeAction === "detail"
        && Boolean(dataSource?.key)
        && selectedRowId !== null
        && (enteredDetail || isDetailLoading || loadedDetailId !== selectedRowId),
      isFormInitialLoading: isOptionSourcesLoading,
      isEditingDetail,
      isDeletingDetail,
      isDetailLoading,
      isFallback,
      isInitialLoading: Boolean(dataSource?.key) && rowsForCurrentDataSource === null,
      isLoading,
      isOptionSourcesLoading,
      isSubmitting,
      updatingWorkflowRowId,
      enteredDetail,
      listViewModel: createAdminStandardListViewModel(
        entityConfig,
        search,
        filterValues,
        rowsForCurrentDataSource,
        currentPage,
        pageSize,
        sortCriterion,
        optionSources,
      ),
      onBack,
      optionSources,
      resetListFilters,
      routeAction,
      search,
      setActiveTab,
      setCurrentPage,
      setFilterValue,
      setFormValue,
      cycleListSortDirection,
      setSearch: setSearchValue,
      submitDetailEdit,
      submitForm,
      transitionWorkflowRow,
    }),
    [
      activeTab,
      beginDetailEdit,
      cancelDetailEdit,
      deleteDetail,
      currentPage,
      dataSource?.key,
      entityConfig,
      filterValues,
      formValues,
      detailRow,
      error,
      formConfig,
      isEditingDetail,
      isDeletingDetail,
      isDetailLoading,
      isFallback,
      isLoading,
      isOptionSourcesLoading,
      isSubmitting,
      updatingWorkflowRowId,
      enteredDetail,
      onBack,
      optionSources,
      pageSize,
      resetListFilters,
      routeAction,
      rowsOverride,
      rowsForCurrentDataSource,
      rowsCacheKey,
      search,
      selectedRowId,
      loadedDetailId,
      cycleListSortDirection,
      setFilterValue,
      setFormValue,
      setSearchValue,
      sortCriterion,
      submitDetailEdit,
      submitForm,
      transitionWorkflowRow,
    ],
  );
}
