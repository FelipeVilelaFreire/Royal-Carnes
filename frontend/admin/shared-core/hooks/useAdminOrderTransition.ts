import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminOrdersApi, type createAdminOrdersApi } from "../api/orders.api";
import type {
  AdminOrderConfigView,
  AdminOrderTransitionInput,
  AdminOrderView,
} from "../contracts/orders.contract";
import { createAdminOrderTransitionViewModel } from "../view-models/orders.view-model";

type AdminOrdersApi = ReturnType<typeof createAdminOrdersApi>;

export interface UseAdminOrderTransitionOptions {
  api?: AdminOrdersApi;
  initialConfig?: AdminOrderConfigView | null;
  initialOrder?: AdminOrderView | null;
}

export function useAdminOrderTransition(
  orderId: string | number,
  input: AdminOrderTransitionInput,
  options: UseAdminOrderTransitionOptions = {},
) {
  const api = options.api || adminOrdersApi;
  const [config, setConfig] = useState<AdminOrderConfigView | null>(
    options.initialConfig || null,
  );
  const [order, setOrder] = useState<AdminOrderView | null>(options.initialOrder || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const loadConfig = useCallback(async () => {
    const nextConfig = await api.config();
    setConfig(nextConfig);
    return nextConfig;
  }, [api]);

  const submit = useCallback(
    async (overrideInput?: AdminOrderTransitionInput) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const nextOrder = await api.transition(orderId, overrideInput || input);
        setOrder(nextOrder);
        return nextOrder;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, input, orderId],
  );

  return useMemo(
    () => ({
      config,
      order,
      viewModel: createAdminOrderTransitionViewModel(order, input, config),
      isSubmitting,
      error,
      loadConfig,
      submit,
    }),
    [config, error, input, isSubmitting, loadConfig, order, submit],
  );
}
