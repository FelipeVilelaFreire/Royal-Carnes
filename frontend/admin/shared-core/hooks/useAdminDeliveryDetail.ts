import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  adminDeliveriesApi,
  type createAdminDeliveriesApi,
} from "../api/deliveries.api";
import type {
  AdminDeliveryConfigView,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import { createAdminDeliveryRowViewModel } from "../view-models/deliveries.view-model";

type AdminDeliveriesApi = ReturnType<typeof createAdminDeliveriesApi>;

export interface UseAdminDeliveryDetailOptions {
  api?: AdminDeliveriesApi;
  initialConfig?: AdminDeliveryConfigView | null;
  initialDelivery?: AdminDeliveryView | null;
}

export function useAdminDeliveryDetail(
  deliveryId: string | number,
  options: UseAdminDeliveryDetailOptions = {},
) {
  const api = options.api || adminDeliveriesApi;
  const [config, setConfig] = useState<AdminDeliveryConfigView | null>(
    options.initialConfig || null,
  );
  const [delivery, setDelivery] = useState<AdminDeliveryView | null>(
    options.initialDelivery || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextDelivery] = await Promise.all([
        api.config(),
        api.detail(deliveryId),
      ]);
      setConfig(nextConfig);
      setDelivery(nextDelivery);
      return { config: nextConfig, delivery: nextDelivery };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, deliveryId]);

  return useMemo(
    () => ({
      config,
      delivery,
      viewModel: delivery ? createAdminDeliveryRowViewModel(delivery, config) : null,
      isLoading,
      error,
      load,
    }),
    [config, delivery, error, isLoading, load],
  );
}
