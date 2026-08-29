"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrderConfig } from "../api/orders.api";
import type { OrderConfigResponse } from "../contracts/order.contract";

export function useOrderConfig() {
  const [config, setConfig] = useState<OrderConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "order_config_error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refresh: fetchConfig };
}
