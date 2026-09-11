import React, { useMemo } from "react";
import { createAdminDashboardApi } from "@/api/dashboard.api";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAdminI18n } from "@/locales/i18n";
import { adminRoutes } from "@/manifest/routes";
import type { DashboardConfig } from "../config/types";
import { DashboardPage } from "./DashboardPage";

export interface DashboardScreenProps {
  apiConfig?: Parameters<typeof createAdminDashboardApi>[0];
  config: DashboardConfig;
  onNavigate?: (routePath: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ apiConfig, config, onNavigate }) => {
  const api = useMemo(() => createAdminDashboardApi(apiConfig), [apiConfig]);
  const dashboard = useAdminDashboard({
    api,
    fallbackOnError: config.dataSource?.fallbackOnError ?? false,
    recentOrdersLimit: config.recentOrders.limit,
  });
  const { t } = useAdminI18n();

  return (
    <DashboardPage
      config={config}
      isLoading={dashboard.isLoading}
      onViewOrders={() => onNavigate?.(adminRoutes.pedidos)}
      t={t}
      viewModel={dashboard.viewModel}
    />
  );
};
