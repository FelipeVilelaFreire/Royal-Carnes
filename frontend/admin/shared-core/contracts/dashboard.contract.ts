import type { AdminDeliveryConfigView, AdminDeliveryView } from "./deliveries.contract";
import type { AdminDeliveryConfigDto, AdminDeliveryDto } from "./deliveries.contract";
import type { AdminOrderConfigView, AdminOrderView } from "./orders.contract";
import type { AdminOrderConfigDto, AdminOrderDto } from "./orders.contract";
import type { AdminSubscriptionDto } from "./subscriptions.contract";
import type { AdminSubscriptionView } from "./subscriptions.contract";

export interface AdminDashboardSummaryDto {
  delivery_config?: AdminDeliveryConfigDto | null;
  deliveries: AdminDeliveryDto[];
  order_config?: AdminOrderConfigDto | null;
  orders: AdminOrderDto[];
  subscriptions: AdminSubscriptionDto[];
}

export interface AdminDashboardSummaryView {
  deliveryConfig: AdminDeliveryConfigView | null;
  deliveries: AdminDeliveryView[];
  orderConfig: AdminOrderConfigView | null;
  orders: AdminOrderView[];
  subscriptions: AdminSubscriptionView[];
}
