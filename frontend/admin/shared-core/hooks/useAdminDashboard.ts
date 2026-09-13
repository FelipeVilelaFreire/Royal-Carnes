import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminDashboardApi, type createAdminDashboardApi } from "../api/dashboard.api";
import type { AdminDashboardSummaryView } from "../contracts/dashboard.contract";
import { createAdminDashboardViewModel } from "../view-models/dashboard.view-model";
import { readAdminSessionCache, writeAdminSessionCache } from "../state/adminSessionCache";

type AdminDashboardApi = ReturnType<typeof createAdminDashboardApi>;

const emptyDashboardSummary: AdminDashboardSummaryView = {
  deliveryConfig: null,
  deliveries: [],
  orderConfig: null,
  orders: [],
  subscriptions: [],
};
const dashboardCacheKey = "dashboard-summary";

export interface UseAdminDashboardOptions {
  api?: AdminDashboardApi;
  fallbackOnError?: boolean;
  initialSummary?: AdminDashboardSummaryView | null;
  recentOrdersLimit?: number;
}

export function useAdminDashboard(options: UseAdminDashboardOptions = {}) {
  const api = options.api || adminDashboardApi;
  const fallbackOnError = options.fallbackOnError ?? false;
  const cachedSummary = options.initialSummary || readAdminSessionCache<AdminDashboardSummaryView>(dashboardCacheKey);
  const [summary, setSummary] = useState<AdminDashboardSummaryView | null>(
    cachedSummary,
  );
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(!cachedSummary);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSummary = await api.summary();
      setSummary(nextSummary);
      writeAdminSessionCache(dashboardCacheKey, nextSummary);
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
      viewModel: createAdminDashboardViewModel(summary || emptyDashboardSummary, {
        recentOrdersLimit: options.recentOrdersLimit,
      }),
      isInitialLoading: isLoading && !summary,
    }),
    [error, isFallback, isLoading, load, options.recentOrdersLimit, summary],
  );
}
