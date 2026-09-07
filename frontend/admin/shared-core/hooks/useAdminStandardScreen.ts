import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { ApiClientConfig, ApiErrorEnvelope } from "../../../shared-core";
import {
  loadAdminStandardRows,
  type AdminStandardDataSourceConfig,
} from "../data-sources/standard.data-source";
import {
  createAdminStandardDetailViewModel,
  createAdminStandardFormViewModel,
  createAdminStandardInitialFilters,
  createAdminStandardListViewModel,
} from "../view-models/standard.view-model";

export interface UseAdminStandardScreenOptions {
  entityConfig: any;
  apiConfig?: ApiClientConfig;
  initialSelectedRow?: Record<string, any> | null;
  onBack?: () => void;
  onSubmit?: (values: Record<string, any>) => void;
}

export function useAdminStandardScreen({
  apiConfig,
  entityConfig,
  initialSelectedRow,
  onBack,
  onSubmit,
}: UseAdminStandardScreenOptions) {
  const config = entityConfig?.listPage || entityConfig || {};
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    createAdminStandardInitialFilters(config.filters || []),
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("summary");
  const [rowsOverride, setRowsOverride] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const dataSource = entityConfig?.dataSource as AdminStandardDataSourceConfig | undefined;

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
      setIsFallback(result.isFallback);
      setError(result.error);
      setIsLoading(false);
    }

    loadRows();

    return () => {
      isActive = false;
    };
  }, [apiConfig, dataSource]);

  const setFilterValue = useCallback((key: string, value: string) => {
    setFilterValues((current) => ({ ...current, [key]: value }));
  }, []);

  const setFormValue = useCallback((key: string, value: any) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  }, []);

  const submitForm = useCallback(
    (event?: FormEvent) => {
      event?.preventDefault();
      onSubmit?.(formValues);
    },
    [formValues, onSubmit],
  );

  return useMemo(
    () => ({
      activeTab,
      detailViewModel: createAdminStandardDetailViewModel(
        entityConfig?.entityNameKey || entityConfig?.entityName || "",
        initialSelectedRow || {},
        activeTab,
      ),
      error,
      formViewModel: createAdminStandardFormViewModel(entityConfig?.form, formValues),
      isFallback,
      isLoading,
      listViewModel: createAdminStandardListViewModel(
        entityConfig,
        search,
        filterValues,
        rowsOverride,
      ),
      onBack,
      search,
      setActiveTab,
      setFilterValue,
      setFormValue,
      setSearch,
      submitForm,
    }),
    [
      activeTab,
      entityConfig,
      filterValues,
      formValues,
      initialSelectedRow,
      error,
      isFallback,
      isLoading,
      onBack,
      rowsOverride,
      search,
      setFilterValue,
      setFormValue,
      submitForm,
    ],
  );
}
