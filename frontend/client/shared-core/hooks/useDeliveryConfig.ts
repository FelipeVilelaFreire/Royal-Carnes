"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeliveryConfig } from "../api/deliveries.api";
import type { DeliveryConfigResponse } from "../contracts/delivery.contract";

export function useDeliveryConfig() {
  const [config, setConfig] = useState<DeliveryConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDeliveryConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "delivery_config_error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refresh: fetchConfig };
}
