import type { ApiClientConfig } from "../../../shared-core";
import { buildApiHeaders, throwIfApiError } from "../../../shared-core";
import type { AdminDashboardSummaryDto, AdminDashboardSummaryView } from "../contracts/dashboard.contract";
import { mapAdminDashboardSummaryDto } from "../mappers/dashboard.mapper";
import { createAdminDeliveriesApi } from "./deliveries.api";
import { createAdminOrdersApi } from "./orders.api";
import { createAdminSubscriptionsApi } from "./subscriptions.api";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminDashboardApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;
  const deliveriesApi = createAdminDeliveriesApi(config);
  const ordersApi = createAdminOrdersApi(config);
  const subscriptionsApi = createAdminSubscriptionsApi(config);

  return {
    async summary(): Promise<AdminDashboardSummaryView> {
      try {
        const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/admin/dashboard/summary/"), {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        });

        await throwIfApiError(response);
        return mapAdminDashboardSummaryDto((await response.json()) as AdminDashboardSummaryDto);
      } catch (err: any) {
        const status = err?.envelope?.status;
        if (status && status !== 404) {
          throw err;
        }
      }

      const [orderConfig, orders, deliveryConfig, deliveries, subscriptions] = await Promise.all([
        ordersApi.config(),
        ordersApi.list(),
        deliveriesApi.config(),
        deliveriesApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);

      return {
        deliveryConfig,
        deliveries,
        orderConfig,
        orders,
        subscriptions,
      };
    },
  };
}

export const adminDashboardApi = createAdminDashboardApi();
