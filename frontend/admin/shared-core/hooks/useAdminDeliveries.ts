import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  adminDeliveriesApi,
  type createAdminDeliveriesApi,
} from "../api/deliveries.api";
import type {
  AdminDeliveryConfigView,
  AdminDeliveryCreateInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import { createAdminDeliveriesViewModel } from "../view-models/deliveries.view-model";

type AdminDeliveriesApi = ReturnType<typeof createAdminDeliveriesApi>;

export interface UseAdminDeliveriesOptions {
  api?: AdminDeliveriesApi;
  initialConfig?: AdminDeliveryConfigView | null;
  initialDeliveries?: AdminDeliveryView[];
}

export function useAdminDeliveries(options: UseAdminDeliveriesOptions = {}) {
  const api = options.api || adminDeliveriesApi;
  const [config, setConfig] = useState<AdminDeliveryConfigView | null>(
    options.initialConfig || null,
  );
  const [deliveries, setDeliveries] = useState<AdminDeliveryView[]>(
    options.initialDeliveries || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextDeliveries] = await Promise.all([
        api.config(),
        api.list(),
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

  const create = useCallback(
    async (input: AdminDeliveryCreateInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const delivery = await api.create(input);
        setDeliveries((current) => [delivery, ...current]);
        return delivery;
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
      deliveries,
      viewModel: createAdminDeliveriesViewModel(deliveries, config),
      isLoading,
      error,
      load,
      create,
    }),
    [config, create, deliveries, error, isLoading, load],
  );
}
