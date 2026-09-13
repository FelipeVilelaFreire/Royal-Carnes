import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { ApiClientConfig, ApiErrorEnvelope } from "../../../shared-core";
import {
  createAdminStandardRow,
  deleteAdminStandardRow,
  loadAdminStandardOptionSources,
  loadAdminStandardRow,
  loadAdminStandardRows,
  updateAdminStandardRow,
  type AdminStandardDataSourceConfig,
} from "../data-sources/standard.data-source";
import {
  createAdminStandardDetailViewModel,
  createAdminStandardFormViewModel,
  createAdminStandardInitialFilters,
  createAdminStandardListViewModel,
  type AdminStandardOptionSources,
} from "../view-models/standard.view-model";
import { readAdminSessionCache, writeAdminSessionCache } from "../state/adminSessionCache";

export interface UseAdminStandardScreenOptions {
  entityConfig: any;
  apiConfig?: ApiClientConfig;
  initialSelectedRow?: Record<string, any> | null;
  onBack?: () => void;
  onSubmit?: (values: Record<string, any>) => void;
}

function collectFormFields(formConfig: any): any[] {
  const sections = formConfig?.sections || [];
  return sections.length
    ? sections.flatMap((section: any) => section.fields || [])
    : formConfig?.fields || [];
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
}: UseAdminStandardScreenOptions) {
  const config = entityConfig?.listPage || entityConfig || {};
  const dataSource = entityConfig?.dataSource as AdminStandardDataSourceConfig | undefined;
  const rowsCacheKey = dataSource?.key ? `standard-rows:${dataSource.key}` : null;
  const cachedRows = rowsCacheKey ? readAdminSessionCache<any[]>(rowsCacheKey) : null;
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    createAdminStandardInitialFilters(config.filters || []),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(config.pagination?.pageSize || 10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("summary");
  const [rowsOverride, setRowsOverride] = useState<any[] | null>(cachedRows);
  const [optionSources, setOptionSources] = useState<AdminStandardOptionSources>({});
  const [isLoading, setIsLoading] = useState(!cachedRows && Boolean(dataSource?.key));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingDetail, setIsDeletingDetail] = useState(false);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [selectedRowOverride, setSelectedRowOverride] = useState<Record<string, any> | null>(null);
  const detailRow = selectedRowOverride || initialSelectedRow || {};
  const detailConfig = entityConfig?.detailPage;
  const formConfig = entityConfig?.addPage || entityConfig?.form;

  useEffect(() => {
    let isActive = true;

    async function loadSources() {
      const result = await loadAdminStandardOptionSources(entityConfig, apiConfig);
      if (!isActive) return;
      setOptionSources(result.optionSources);
      if (result.error) setError(result.error);
    }

    loadSources();

    return () => {
      isActive = false;
    };
  }, [apiConfig, entityConfig]);

  useEffect(() => {
    let isActive = true;

    async function loadRows() {
      if (!dataSource?.key) {
        setRowsOverride(null);
        setIsFallback(false);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await loadAdminStandardRows(dataSource, apiConfig);
      if (!isActive) return;

      setRowsOverride(result.rows);
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
  }, [apiConfig, dataSource]);

  useEffect(() => {
    let isActive = true;
    const rowId = initialSelectedRow?.id;

    async function loadDetail() {
      setSelectedRowOverride(null);
      if (!dataSource?.key || rowId === undefined) return;

      const result = await loadAdminStandardRow(dataSource, rowId, apiConfig);
      if (!isActive) return;
      if (result.error) {
        setError(result.error);
        return;
      }
      setSelectedRowOverride(result.row);
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [apiConfig, dataSource, initialSelectedRow?.id]);

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

  const setListSort = useCallback((key: string) => {
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
        return currentKey;
      }
      setSortDirection("asc");
      return key;
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
    const editableFields = (detailConfig?.tabs || [])
      .flatMap((tab: any) => [
        ...(tab.fields || []),
        ...(tab.sections || []).flatMap((section: any) => section.fields || []),
      ])
      .filter((field: any) => field.editable);
    setFormValues(
      Object.fromEntries(editableFields.map((field: any) => [field.key, detailRow[field.key] ?? ""])),
    );
    setIsEditingDetail(true);
  }, [detailConfig, detailRow]);

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
      isEditingDetail,
      isDeletingDetail,
      isFallback,
      isInitialLoading: isLoading && rowsOverride === null,
      isLoading,
      isSubmitting,
      listViewModel: createAdminStandardListViewModel(
        entityConfig,
        search,
        filterValues,
        rowsOverride,
        currentPage,
        pageSize,
        sortKey,
        sortDirection,
      ),
      onBack,
      optionSources,
      resetListFilters,
      search,
      setActiveTab,
      setCurrentPage,
      setFilterValue,
      setFormValue,
      setListSort,
      setSearch: setSearchValue,
      submitDetailEdit,
      submitForm,
    }),
    [
      activeTab,
      beginDetailEdit,
      cancelDetailEdit,
      deleteDetail,
      currentPage,
      entityConfig,
      filterValues,
      formValues,
      detailRow,
      error,
      formConfig,
      isEditingDetail,
      isDeletingDetail,
      isFallback,
      isLoading,
      isSubmitting,
      onBack,
      optionSources,
      pageSize,
      resetListFilters,
      rowsOverride,
      rowsCacheKey,
      search,
      setListSort,
      setFilterValue,
      setFormValue,
      setSearchValue,
      sortDirection,
      sortKey,
      submitDetailEdit,
      submitForm,
    ],
  );
}
