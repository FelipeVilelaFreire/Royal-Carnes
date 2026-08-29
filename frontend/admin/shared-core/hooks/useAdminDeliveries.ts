import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminDeliveries } from "../api/adminDeliveries.api";
import type { AdminDelivery } from "../contracts/admin-delivery.contract";
import { mockAdminDeliveries } from "../mocks/deliveries.mock";
import { prepareAdminDeliveryViewModel, type PreparedAdminDeliveryViewModel } from "../view-models/adminDeliveries.view-model";

interface UseAdminDeliveriesOptions {
  accessToken?: string;
}

export function useAdminDeliveries(options: UseAdminDeliveriesOptions = {}) {
  const [deliveries, setDeliveries] = useState<AdminDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDeliveries(options);
      setDeliveries(data);
      setSource("api");
    } catch (err) {
      setError(err instanceof Error ? err.message : "admin_deliveries_error");
      setDeliveries(mockAdminDeliveries as AdminDelivery[]);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [options.accessToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const viewModels: PreparedAdminDeliveryViewModel[] = useMemo(
    () => deliveries.map((d) => prepareAdminDeliveryViewModel(d)),
    [deliveries]
  );

  return { deliveries, viewModels, loading, error, source, refresh };
}
