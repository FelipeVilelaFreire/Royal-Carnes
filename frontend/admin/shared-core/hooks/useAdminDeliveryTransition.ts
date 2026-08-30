import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  adminDeliveriesApi,
  type createAdminDeliveriesApi,
} from "../api/deliveries.api";
import type {
  AdminDeliveryConfigView,
  AdminDeliveryTransitionInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import { createAdminDeliveryTransitionViewModel } from "../view-models/deliveries.view-model";

type AdminDeliveriesApi = ReturnType<typeof createAdminDeliveriesApi>;

export interface UseAdminDeliveryTransitionOptions {
  api?: AdminDeliveriesApi;
  initialConfig?: AdminDeliveryConfigView | null;
  initialDelivery?: AdminDeliveryView | null;
}

export function useAdminDeliveryTransition(
  deliveryId: string | number,
  input: AdminDeliveryTransitionInput,
  options: UseAdminDeliveryTransitionOptions = {},
) {
  const api = options.api || adminDeliveriesApi;
  const [config, setConfig] = useState<AdminDeliveryConfigView | null>(
    options.initialConfig || null,
  );
  const [delivery, setDelivery] = useState<AdminDeliveryView | null>(
    options.initialDelivery || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const loadConfig = useCallback(async () => {
    const nextConfig = await api.config();
    setConfig(nextConfig);
    return nextConfig;
  }, [api]);

  const submit = useCallback(
    async (overrideInput?: AdminDeliveryTransitionInput) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const nextDelivery = await api.transition(deliveryId, overrideInput || input);
        setDelivery(nextDelivery);
        return nextDelivery;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, deliveryId, input],
  );

  return useMemo(
    () => ({
      config,
      delivery,
      viewModel: createAdminDeliveryTransitionViewModel(delivery, input, config),
      isSubmitting,
      error,
      loadConfig,
      submit,
    }),
    [config, delivery, error, input, isSubmitting, loadConfig, submit],
  );
}
