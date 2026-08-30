import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { clientOrdersApi, type createClientOrdersApi } from "../api/orders.api";
import type {
  ClientOrderConfigView,
  ClientOrderView,
} from "../contracts/orders.contract";
import { createClientOrderRowViewModel } from "../view-models/orders.view-model";

type ClientOrdersApi = ReturnType<typeof createClientOrdersApi>;

export interface UseClientOrderDetailOptions {
  api?: ClientOrdersApi;
  initialConfig?: ClientOrderConfigView | null;
  initialOrder?: ClientOrderView | null;
}

export function useClientOrderDetail(
  orderId: string | number,
  options: UseClientOrderDetailOptions = {},
) {
  const api = options.api || clientOrdersApi;
  const [config, setConfig] = useState<ClientOrderConfigView | null>(
    options.initialConfig || null,
  );
  const [order, setOrder] = useState<ClientOrderView | null>(options.initialOrder || null);
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
      viewModel: order ? createClientOrderRowViewModel(order, config) : null,
      isLoading,
      error,
      load,
    }),
    [config, error, isLoading, load, order],
  );
}
