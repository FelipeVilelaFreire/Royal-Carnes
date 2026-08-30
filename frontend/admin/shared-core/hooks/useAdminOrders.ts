import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminOrdersApi, type createAdminOrdersApi } from "../api/orders.api";
import type {
  AdminOrderConfigView,
  AdminOrderCreateInput,
  AdminOrderView,
} from "../contracts/orders.contract";
import { createAdminOrdersViewModel } from "../view-models/orders.view-model";

type AdminOrdersApi = ReturnType<typeof createAdminOrdersApi>;

export interface UseAdminOrdersOptions {
  api?: AdminOrdersApi;
  initialConfig?: AdminOrderConfigView | null;
  initialOrders?: AdminOrderView[];
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
  const api = options.api || adminOrdersApi;
  const [config, setConfig] = useState<AdminOrderConfigView | null>(
    options.initialConfig || null,
  );
  const [orders, setOrders] = useState<AdminOrderView[]>(options.initialOrders || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextOrders] = await Promise.all([api.config(), api.list()]);
      setConfig(nextConfig);
      setOrders(nextOrders);
      return { config: nextConfig, orders: nextOrders };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const create = useCallback(
    async (input: AdminOrderCreateInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const order = await api.create(input);
        setOrders((current) => [order, ...current]);
        return order;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  return useMemo(
    () => ({
      config,
      orders,
      viewModel: createAdminOrdersViewModel(orders, config),
      isLoading,
      error,
      load,
      create,
    }),
    [config, create, error, isLoading, load, orders],
  );
}
