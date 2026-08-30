import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  clientDeliveriesApi,
  type createClientDeliveriesApi,
} from "../api/deliveries.api";
import type {
  ClientDeliveryConfigView,
  ClientDeliveryView,
} from "../contracts/deliveries.contract";
import { createClientDeliveryRowViewModel } from "../view-models/deliveries.view-model";

type ClientDeliveriesApi = ReturnType<typeof createClientDeliveriesApi>;

export interface UseClientDeliveryDetailOptions {
  api?: ClientDeliveriesApi;
  initialConfig?: ClientDeliveryConfigView | null;
  initialDelivery?: ClientDeliveryView | null;
}

export function useClientDeliveryDetail(
  deliveryId: string | number,
  options: UseClientDeliveryDetailOptions = {},
) {
  const api = options.api || clientDeliveriesApi;
  const [config, setConfig] = useState<ClientDeliveryConfigView | null>(
    options.initialConfig || null,
  );
  const [delivery, setDelivery] = useState<ClientDeliveryView | null>(
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
      viewModel: delivery ? createClientDeliveryRowViewModel(delivery, config) : null,
      isLoading,
      error,
      load,
    }),
    [config, delivery, error, isLoading, load],
  );
}
