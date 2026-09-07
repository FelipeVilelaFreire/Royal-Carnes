import type { AdminDashboardSummaryDto, AdminDashboardSummaryView } from "../contracts/dashboard.contract";
import { mapAdminDeliveryConfigDto, mapAdminDeliveryDto } from "./deliveries.mapper";
import { mapAdminOrderConfigDto, mapAdminOrderDto } from "./orders.mapper";
import { mapAdminSubscriptionDto } from "./subscriptions.mapper";

export function mapAdminDashboardSummaryDto(
  dto: AdminDashboardSummaryDto,
): AdminDashboardSummaryView {
  return {
    deliveryConfig: dto.delivery_config ? mapAdminDeliveryConfigDto(dto.delivery_config) : null,
    deliveries: (dto.deliveries || []).map(mapAdminDeliveryDto),
    orderConfig: dto.order_config ? mapAdminOrderConfigDto(dto.order_config) : null,
    orders: (dto.orders || []).map(mapAdminOrderDto),
    subscriptions: (dto.subscriptions || []).map(mapAdminSubscriptionDto),
  };
}

