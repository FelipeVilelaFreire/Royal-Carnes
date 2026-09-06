import { catalogSubscriptionPlansMock } from "../mocks/catalog";
import {
  royalCustomerMock,
  royalCustomerPaymentHistoryMock,
} from "../mocks/customer.mock";
import {
  getRoyalOrderStatusTone,
  royalCustomerOrdersMock,
  royalOrderKindLabels,
  royalOrderStatusLabels,
} from "../mocks/orders";
import type {
  ClientCustomerAccount,
  ClientCustomerCycleUsage,
  ClientCustomerDataSource,
  ClientCustomerPlan,
  ClientCustomerRecentOrder,
} from "../contracts/customer.contract";

const customer = royalCustomerMock as ClientCustomerAccount;

const recentOrders: ClientCustomerRecentOrder[] = royalCustomerOrdersMock
  .filter((order) => order.customerId === customer.id)
  .slice(0, 4)
  .map((order) => ({
    id: order.id,
    code: order.code,
    kindLabel: royalOrderKindLabels[order.kind],
    title: order.title,
    summary: order.summary,
    statusLabel: royalOrderStatusLabels[order.status],
    statusTone: getRoyalOrderStatusTone(order.status),
    createdAtLabel: order.createdAtLabel,
    estimateLabel: order.delivery.estimateLabel,
    totalLabel: order.payment.totalLabel,
    imageUrl: order.imageUrl,
  }));

const activeCycleUsage: ClientCustomerCycleUsage | null =
  royalCustomerOrdersMock.find((order) =>
    order.customerId === customer.id &&
    order.subscriptionId === customer.activeSubscription?.id &&
    order.kind === "subscriptionCycle" &&
    order.status !== "delivered" &&
    order.status !== "cancelled"
  )?.cycleUsage || null;

export const customerFallbackDataSource: ClientCustomerDataSource = {
  customer,
  invoices: royalCustomerPaymentHistoryMock,
  plans: catalogSubscriptionPlansMock as ClientCustomerPlan[],
  recentOrders,
  cycleUsage: activeCycleUsage,
};
