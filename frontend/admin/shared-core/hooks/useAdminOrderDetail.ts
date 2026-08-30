import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminOrdersApi, type createAdminOrdersApi } from "../api/orders.api";
import type {
  AdminOrderConfigView,
  AdminOrderView,
} from "../contracts/orders.contract";
import { createAdminOrderRowViewModel } from "../view-models/orders.view-model";

type AdminOrdersApi = ReturnType<typeof createAdminOrdersApi>;

export interface UseAdminOrderDetailOptions {
  api?: AdminOrdersApi;
  initialConfig?: AdminOrderConfigView | null;
  initialOrder?: AdminOrderView | null;
}

export function useAdminOrderDetail(
  orderId: string | number,
  options: UseAdminOrderDetailOptions = {},
) {
  const api = options.api || adminOrdersApi;
  const [config, setConfig] = useState<AdminOrderConfigView | null>(
    options.initialConfig || null,
  );
  const [order, setOrder] = useState<AdminOrderView | null>(options.initialOrder || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextOrder] = await Promise.all([
        api.config(),
        api.detail(orderId),
      ]);
      setConfig(nextConfig);
      setOrder(nextOrder);
      return { config: nextConfig, order: nextOrder };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, orderId]);

  return useMemo(
    () => ({
      config,
      order,
      viewModel: order ? createAdminOrderRowViewModel(order, config) : null,
      isLoading,
      error,
      load,
    }),
    [config, error, isLoading, load, order],
  );
}
