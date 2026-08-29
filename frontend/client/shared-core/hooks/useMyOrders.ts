"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createOrder, getMyOrders } from "../api/orders.api";
import type { CreateOrderInput, CreateOrderPayload } from "../contracts/order.contract";
import { royalCustomerOrdersMock } from "../mocks/orders";
import { prepareOrderViewModel, type PreparedOrderViewModel } from "../view-models/orders.view-model";

interface UseMyOrdersOptions {
  accessToken?: string | null;
  customerId?: string;
}

const activeStatuses = new Set([
  "received",
  "approved",
  "separating",
  "ready",
  "sentToStore",
  "preparing",
  "outForDelivery"
]);

export function useMyOrders(options: UseMyOrdersOptions = {}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const accessToken = useMemo(() => {
    if (options.accessToken !== undefined) return options.accessToken || "";
    if (typeof window === "undefined") return "";
    return localStorage.getItem("royal_prime_access_token") || "";
  }, [options.accessToken]);

  const requestOptions = useMemo(
    () => ({ accessToken, organizationSlug: "royalprime" }),
    [accessToken]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders(requestOptions);
      setOrders(data);
      setSource("api");
    } catch (err) {
      setError(err instanceof Error ? err.message : "my_orders_error");
      setOrders(royalCustomerOrdersMock);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [requestOptions]);

  const handleCreateOrder = useCallback(
    async (input: CreateOrderInput | CreateOrderPayload): Promise<any> => {
      try {
        const newOrder = await createOrder(input, requestOptions);
        await refresh();
        return newOrder;
      } catch (err) {
        // Fallback for offline dev mode
        const newOrder = {
          id: `order-rd-${Date.now()}`,
          code: `#RD-${Math.floor(1000 + Math.random() * 9000)}`,
          kind: "kind_key" in input ? input.kind_key : input.kind,
          status: "received",
          createdAtLabel: "Hoje",
          payment: { methodLabel: "PIX", status: "pending", totalLabel: "0,00" },
          items: [],
          timeline: []
        };
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      }
    },
    [refresh, requestOptions]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const viewModels: PreparedOrderViewModel[] = useMemo(
    () => orders.map((order) => prepareOrderViewModel(order)),
    [orders]
  );

  const currentOrderVM = useMemo(() => {
    const active = viewModels.find((vm) => {
      const status = vm.rawOrder.status_key || vm.rawOrder.status;
      return activeStatuses.has(status);
    });
    return active || viewModels[0] || null;
  }, [viewModels]);

  const currentSubscriptionOrderVM = useMemo(() => {
    return viewModels.find((vm) => {
      const kind = vm.rawOrder.kind_key || vm.rawOrder.kind;
      const status = vm.rawOrder.status_key || vm.rawOrder.status;
      return (kind === "subscription-cycle" || kind === "subscriptionCycle") && activeStatuses.has(status);
    }) || null;
  }, [viewModels]);

  return {
    orders,
    viewModels,
    currentOrderVM,
    currentSubscriptionOrderVM,
    loading,
    error,
    source,
    refresh,
    createOrder: handleCreateOrder
  };
}
