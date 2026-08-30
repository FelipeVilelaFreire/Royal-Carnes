import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminInventoryApi, type createAdminInventoryApi } from "../api/inventory.api";
import type {
  AdminInventoryAdjustmentInput,
  AdminInventoryItemView,
} from "../contracts/inventory.contract";
import { createAdminInventoryAdjustmentViewModel } from "../view-models/inventory.view-model";

type AdminInventoryApi = ReturnType<typeof createAdminInventoryApi>;

export interface UseAdminInventoryAdjustmentOptions {
  api?: AdminInventoryApi;
  initialItem?: AdminInventoryItemView | null;
}

export function useAdminInventoryAdjustment(
  itemId: string | number,
  input: AdminInventoryAdjustmentInput,
  options: UseAdminInventoryAdjustmentOptions = {},
) {
  const api = options.api || adminInventoryApi;
  const [item, setItem] = useState<AdminInventoryItemView | null>(
    options.initialItem ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const submit = useCallback(
    async (overrideInput?: AdminInventoryAdjustmentInput) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const adjustedItem = await api.adjust(itemId, overrideInput || input);
        setItem(adjustedItem);
        return adjustedItem;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, input, itemId],
  );

  return useMemo(
    () => ({
      item,
      viewModel: createAdminInventoryAdjustmentViewModel(input),
      isSubmitting,
      error,
      submit,
    }),
    [error, input, isSubmitting, item, submit],
  );
}
