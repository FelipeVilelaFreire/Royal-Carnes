import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminInventoryApi, type createAdminInventoryApi } from "../api/inventory.api";
import type {
  AdminInventoryItemView,
  AdminInventoryMovementView,
} from "../contracts/inventory.contract";
import {
  createAdminInventoryItemRowViewModel,
  createAdminInventoryMovementRowViewModel,
} from "../view-models/inventory.view-model";

type AdminInventoryApi = ReturnType<typeof createAdminInventoryApi>;

export interface UseAdminInventoryItemDetailOptions {
  api?: AdminInventoryApi;
  initialItem?: AdminInventoryItemView | null;
  initialMovements?: AdminInventoryMovementView[];
}

export function useAdminInventoryItemDetail(
  itemId: string | number,
  options: UseAdminInventoryItemDetailOptions = {},
) {
  const api = options.api || adminInventoryApi;
  const [item, setItem] = useState<AdminInventoryItemView | null>(
    options.initialItem ?? null,
  );
  const [movements, setMovements] = useState<AdminInventoryMovementView[]>(
    options.initialMovements || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextItem, nextMovements] = await Promise.all([
        api.detail(itemId),
        api.listMovements(itemId),
      ]);
      setItem(nextItem);
      setMovements(nextMovements);
      return { item: nextItem, movements: nextMovements };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, itemId]);

  return useMemo(
    () => ({
      item,
      movements,
      itemViewModel: item ? createAdminInventoryItemRowViewModel(item) : null,
      movementRows: movements.map(createAdminInventoryMovementRowViewModel),
      isLoading,
      error,
      load,
    }),
    [error, isLoading, item, load, movements],
  );
}
