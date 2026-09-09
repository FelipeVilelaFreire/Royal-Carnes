import type { AdminPaymentView } from "../contracts/payments.contract";

export interface AdminPaymentRowViewModel {
  id: string | number;
  reference: string;
  customerId: string | number;
  customerName: string;
  subscriptionId: string | number | null;
  subscriptionPlanName: string | null;
  orderCode: string | null;
  status: string;
  statusLabelKey: string;
  amountCents: number;
  amountLabel: string;
  currency: string;
  dueAt: string | null;
  dueAtInput: string;
  paidAt: string | null;
  paidAtInput: string;
  notes: string;
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, "0");
  const datePart = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-");
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}

function statusLabelKey(status: string): string {
  return `common.status${status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
}

export function createAdminPaymentRowViewModel(payment: AdminPaymentView): AdminPaymentRowViewModel {
  return {
    id: payment.id,
    reference: payment.reference,
    customerId: payment.customerId,
    customerName: payment.customerName,
    subscriptionId: payment.subscriptionId,
    subscriptionPlanName: payment.subscriptionPlanName,
    orderCode: payment.orderCode,
    status: payment.status,
    statusLabelKey: statusLabelKey(payment.status),
    amountCents: payment.amountCents,
    amountLabel: formatMoney(payment.amountCents, payment.currency),
    currency: payment.currency,
    dueAt: formatDate(payment.dueAt),
    dueAtInput: formatDateTimeInput(payment.dueAt),
    paidAt: formatDate(payment.paidAt),
    paidAtInput: formatDateTimeInput(payment.paidAt),
    notes: payment.notes,
  };
}

