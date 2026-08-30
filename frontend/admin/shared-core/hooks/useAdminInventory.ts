import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { adminInventoryApi, type createAdminInventoryApi } from "../api/inventory.api";
import type {
  AdminInventoryItemFormInput,
  AdminInventorySnapshot,
} from "../contracts/inventory.contract";
import { createAdminInventoryViewModel } from "../view-models/inventory.view-model";

type AdminInventoryApi = ReturnType<typeof createAdminInventoryApi>;

export interface UseAdminInventoryOptions {
  api?: AdminInventoryApi;
  initialSnapshot?: AdminInventorySnapshot;
}

const emptySnapshot: AdminInventorySnapshot = {
  items: [],
};

export function useAdminInventory(options: UseAdminInventoryOptions = {}) {
  const api = options.api || adminInventoryApi;
  const [snapshot, setSnapshot] = useState<AdminInventorySnapshot>(
    options.initialSnapshot || emptySnapshot,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await api.listItems();
      const nextSnapshot = { items };
      setSnapshot(nextSnapshot);
      return nextSnapshot;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const create = useCallback(
    async (input: AdminInventoryItemFormInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const item = await api.create(input);
        setSnapshot((current) => ({
          ...current,
          items: [item, ...current.items.filter((existing) => existing.id !== item.id)],
        }));
        return item;
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
      snapshot,
      viewModel: createAdminInventoryViewModel(snapshot.items),
      isLoading,
      error,
      load,
      create,
    }),
    [create, error, isLoading, load, snapshot],
  );
}
