import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  adminDeliveriesApi,
  type createAdminDeliveriesApi,
} from "../api/deliveries.api";
import type {
  AdminDeliveryConfirmInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import { createAdminDeliveryConfirmViewModel } from "../view-models/deliveries.view-model";

type AdminDeliveriesApi = ReturnType<typeof createAdminDeliveriesApi>;

export interface UseAdminDeliveryConfirmOptions {
  api?: AdminDeliveriesApi;
  initialDelivery?: AdminDeliveryView | null;
}

export function useAdminDeliveryConfirm(
  deliveryId: string | number,
  input: AdminDeliveryConfirmInput,
  options: UseAdminDeliveryConfirmOptions = {},
) {
  const api = options.api || adminDeliveriesApi;
  const [delivery, setDelivery] = useState<AdminDeliveryView | null>(
    options.initialDelivery || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const submit = useCallback(
    async (overrideInput?: AdminDeliveryConfirmInput) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const nextDelivery = await api.confirm(deliveryId, overrideInput || input);
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
      delivery,
      viewModel: createAdminDeliveryConfirmViewModel(input),
      isSubmitting,
      error,
      submit,
    }),
    [delivery, error, input, isSubmitting, submit],
  );
}
