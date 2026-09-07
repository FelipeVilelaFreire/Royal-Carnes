import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminDashboardApi, type createAdminDashboardApi } from "../api/dashboard.api";
import type { AdminDashboardSummaryView } from "../contracts/dashboard.contract";
import { createAdminDashboardViewModel } from "../view-models/dashboard.view-model";

type AdminDashboardApi = ReturnType<typeof createAdminDashboardApi>;

const emptyDashboardSummary: AdminDashboardSummaryView = {
  deliveryConfig: null,
  deliveries: [],
  orderConfig: null,
  orders: [],
  subscriptions: [],
};

export interface UseAdminDashboardOptions {
  api?: AdminDashboardApi;
  fallbackOnError?: boolean;
  initialSummary?: AdminDashboardSummaryView | null;
}

export function useAdminDashboard(options: UseAdminDashboardOptions = {}) {
  const api = options.api || adminDashboardApi;
  const fallbackOnError = options.fallbackOnError ?? false;
  const [summary, setSummary] = useState<AdminDashboardSummaryView | null>(
    options.initialSummary || null,
  );
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSummary = await api.summary();
      setSummary(nextSummary);
      setIsFallback(false);
      return nextSummary;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      if (fallbackOnError) {
        setSummary(emptyDashboardSummary);
        setIsFallback(true);
        return emptyDashboardSummary;
      }
      setSummary(emptyDashboardSummary);
      setIsFallback(false);
      return emptyDashboardSummary;
    } finally {
      setIsLoading(false);
    }
  }, [api, fallbackOnError]);

  useEffect(() => {
    void load();
  }, [load]);

  return useMemo(
    () => ({
      error,
      isFallback,
      isLoading,
      load,
      summary,
      viewModel: createAdminDashboardViewModel(summary || emptyDashboardSummary),
    }),
    [error, isFallback, isLoading, load, summary],
  );
}
