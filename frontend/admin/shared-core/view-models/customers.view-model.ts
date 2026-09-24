import type { AdminCustomerView } from "../contracts/customers.contract";
import type { AdminOrderConfigView, AdminOrderView } from "../contracts/orders.contract";
import type { AdminPaymentView } from "../contracts/payments.contract";
import type { AdminSubscriptionView } from "../contracts/subscriptions.contract";
import { formatAdminDate } from "../formatters/date-time.formatter";
import { createAdminOrdersViewModel } from "./orders.view-model";
import { createAdminPaymentRowViewModel } from "./payments.view-model";
import { createAdminSubscriptionRowViewModel } from "./subscriptions.view-model";

const customerStatusLabelKeys: Record<AdminCustomerView["status"], string> = {
  active: "common.statusActive",
  archived: "common.statusArchived",
  blocked: "common.statusBlocked",
  paused: "common.statusPaused",
};

const customerStatusTones: Record<AdminCustomerView["status"], "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  paused: "warning",
  blocked: "danger",
  archived: "neutral",
};

function resolveDefaultAddressLabel(customer: AdminCustomerView): string {
  const address = customer.addresses.find((item) => item.isDefault) || customer.addresses[0];
  if (!address) return "";
  return [address.street, address.number, address.city, address.state].filter(Boolean).join(", ");
}

export function createAdminCustomerRowViewModel(customer: AdminCustomerView) {
  return {
    ...customer,
    memberSince: formatAdminDate(customer.memberSince),
    addressCount: customer.addresses.length,
    defaultAddress: resolveDefaultAddressLabel(customer),
    statusLabelKey: customerStatusLabelKeys[customer.status],
    statusTone: customerStatusTones[customer.status],
  };
}

export function createAdminCustomerDetailRowViewModel(input: {
  customer: AdminCustomerView;
  subscriptions: AdminSubscriptionView[];
  orders: AdminOrderView[];
  payments: AdminPaymentView[];
  orderConfig: AdminOrderConfigView | null;
}) {
  const { customer, subscriptions, orders, payments, orderConfig } = input;
  const customerSubscriptions = subscriptions.filter(
    (subscription) => String(subscription.customerId) === String(customer.id),
  );
  const customerOrders = orders.filter((order) => String(order.customerId) === String(customer.id));
  const customerPayments = payments.filter((payment) => String(payment.customerId) === String(customer.id));
  const subscriptionRows = customerSubscriptions.map((subscription) =>
    createAdminSubscriptionRowViewModel(subscription, orders, orderConfig, payments),
  );
  const activeSubscription = subscriptionRows.find((subscription) => subscription.status === "active") || null;

  return {
    ...createAdminCustomerRowViewModel(customer),
    activePlanName: activeSubscription?.planName || "",
    subscriptionStatusLabelKey: activeSubscription?.statusLabelKey || "",
    subscriptionStatusTone: activeSubscription?.statusTone || "neutral",
    currentCycleWindow: activeSubscription?.currentCycleWindow || "",
    deliveryWindowLabelKey: activeSubscription?.deliveryWindow
      ? `assinaturas.deliveryWindows.${activeSubscription.deliveryWindow}`
      : "",
    subscriptions: subscriptionRows,
    orders: createAdminOrdersViewModel(customerOrders, orderConfig, [], null, payments).orders,
    payments: customerPayments.map((payment) =>
      createAdminPaymentRowViewModel(payment, orders, orderConfig, subscriptions),
    ),
  };
}
