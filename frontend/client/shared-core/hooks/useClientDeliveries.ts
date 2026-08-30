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
import { createClientDeliveriesViewModel } from "../view-models/deliveries.view-model";

type ClientDeliveriesApi = ReturnType<typeof createClientDeliveriesApi>;

export interface UseClientDeliveriesOptions {
  api?: ClientDeliveriesApi;
  initialConfig?: ClientDeliveryConfigView | null;
  initialDeliveries?: ClientDeliveryView[];
}

export function useClientDeliveries(options: UseClientDeliveriesOptions = {}) {
  const api = options.api || clientDeliveriesApi;
  const [config, setConfig] = useState<ClientDeliveryConfigView | null>(
    options.initialConfig || null,
  );
  const [deliveries, setDeliveries] = useState<ClientDeliveryView[]>(
    options.initialDeliveries || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const loadConfig = useCallback(async () => {
    const nextConfig = await api.config();
    setConfig(nextConfig);
    return nextConfig;
  }, [api]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextDeliveries] = await Promise.all([
        api.config(),
        api.listMine(),
      ]);
      setConfig(nextConfig);
      setDeliveries(nextDeliveries);
      return { config: nextConfig, deliveries: nextDeliveries };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return useMemo(
    () => ({
      config,
      deliveries,
      viewModel: createClientDeliveriesViewModel(deliveries, config),
      isLoading,
      error,
      loadConfig,
      load,
    }),
    [config, deliveries, error, isLoading, load, loadConfig],
  );
}
