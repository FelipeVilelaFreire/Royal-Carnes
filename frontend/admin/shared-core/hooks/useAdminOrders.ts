import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminOrders } from "../api/adminOrders.api";
import type { AdminOrder } from "../contracts/admin-order.contract";
import { mockAdminOrders } from "../mocks/orders.mock";
import { prepareAdminOrderViewModel, type PreparedAdminOrderViewModel } from "../view-models/adminOrders.view-model";

interface UseAdminOrdersOptions {
  accessToken?: string;
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrders(options);
      setOrders(data);
      setSource("api");
    } catch (err) {
      setError(err instanceof Error ? err.message : "admin_orders_error");
      setOrders(mockAdminOrders as AdminOrder[]);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [options.accessToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const viewModels: PreparedAdminOrderViewModel[] = useMemo(
    () => orders.map((order) => prepareAdminOrderViewModel(order)),
    [orders]
  );

  return { orders, viewModels, loading, error, source, refresh };
}
