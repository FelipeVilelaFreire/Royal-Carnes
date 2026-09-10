import { useCallback, useEffect, useMemo, useState } from "react";
import { buildApiHeaders, normalizeApiError, throwIfApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { createClientCustomerApi } from "../api/customer.api";
import { createClientOrdersApi } from "../api/orders.api";
import { createClientSubscriptionsApi } from "../api/subscriptions.api";
import type { ClientCustomerNotificationPreferences } from "../contracts/customer.contract";
import { useClientApiConfig } from "../runtime/ClientApiProvider";
import type { ClientCustomerProfileDraft, ClientCustomerTabKey } from "../types/customer.types";
import { createClientCustomerAccountViewModel } from "../view-models/customer.view-model";

export type { ClientCustomerProfileDraft, ClientCustomerTabKey } from "../types/customer.types";

const notificationsDefault: ClientCustomerNotificationPreferences = { whatsapp: false, email: false, sms: false, offers: false };
const emptyDataSource: any = { customer: { id: "", name: "", email: "", phone: "", cpf: "", birthdate: "", preferredDoneness: "", memberSince: "", addresses: [], paymentMethods: [], notifications: notificationsDefault }, invoices: [], plans: [], recentOrders: [], cycleUsage: null };
const dateLabel = (value?: string | null) => value ? value.slice(0, 10) : "";
const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function useClientCustomer() {
  const apiConfig = useClientApiConfig();
  const customerApi = useMemo(() => createClientCustomerApi(apiConfig), [apiConfig]);
  const ordersApi = useMemo(() => createClientOrdersApi(apiConfig), [apiConfig]);
  const subscriptionsApi = useMemo(() => createClientSubscriptionsApi(apiConfig), [apiConfig]);
  const [activeTab, setActiveTab] = useState<ClientCustomerTabKey>("overview");
  const [dataSource, setDataSource] = useState(emptyDataSource);
  const [profileDraft, setProfileDraft] = useState<ClientCustomerProfileDraft>({ name: "", email: "", phone: "", cpf: "", birthdate: "", preferredDoneness: "" });
  const [notifications, setNotifications] = useState(notificationsDefault);
  const [selectedPlanKey, setSelectedPlanKey] = useState("");
  const [pendingPlanKey, setPendingPlanKey] = useState("");
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const paymentResponse = await (apiConfig.fetcher || fetch)(`${apiConfig.baseUrl || ""}/api/v1/payments/me/`, { headers: buildApiHeaders({ token: apiConfig.getAccessToken?.(), organizationSlug: apiConfig.organizationSlug }) });
      await throwIfApiError(paymentResponse);
      const [customer, plans, subscription, cycle, orders, payments] = await Promise.all([customerApi.me(), subscriptionsApi.listPlans(), subscriptionsApi.me(), subscriptionsApi.currentCycle(), ordersApi.listMine(), paymentResponse.json()]);
      const savedNotifications = { ...notificationsDefault, ...(customer.notification_settings || {}) };
      const mappedPlans = plans.map((plan) => ({ key: plan.key, name: plan.name, monthlyPrice: ((plan.prices || []).find((price) => price.billingInterval === "month") || plan.prices?.[0])?.amountCents || 0, productSelectionLimit: (plan.entitlements || []).length, proteinKgLimit: 0, charcoalKgLimit: 0, seasoningSelectionLimit: 0, sideSelectionLimit: 0, utensilSelectionLimit: 0, features: (plan.entitlements || []).map((item) => item.targetName || item.targetKey || item.key) }));
      const activePlanKey = subscription?.plan.key || "";
      const source: any = { customer: { id: String(customer.id), name: customer.name, email: customer.email || "", phone: customer.phone || "", cpf: customer.document || "", birthdate: customer.birth_date || "", preferredDoneness: String(customer.preferences?.preferred_doneness || ""), memberSince: dateLabel(customer.member_since), activeSubscription: subscription ? { id: String(subscription.id), planKey: activePlanKey, billingLabel: "", nextBillingLabel: dateLabel(subscription.currentCycleEndsAt), nextDeliveryLabel: dateLabel(subscription.currentCycleEndsAt) } : undefined, addresses: (customer.addresses || []).map((address) => ({ id: String(address.id), label: address.label || "", recipientName: address.recipient_name || customer.name, streetLine: [address.street, address.number, address.complement].filter(Boolean).join(", "), neighborhoodLine: [address.district, address.city, address.state].filter(Boolean).join(" - "), zipCode: address.postal_code || "", isPrimary: Boolean(address.is_default) })), paymentMethods: (customer.payment_methods || []).map((method) => ({ id: String(method.id), brand: method.label || method.provider || method.method_type, last4: String(method.metadata?.last4 || ""), holderName: String(method.metadata?.holder_name || ""), expiresAt: String(method.metadata?.expires_at || ""), isDefault: Boolean(method.is_default) })), notifications: savedNotifications }, plans: mappedPlans, invoices: payments.map((payment: any) => ({ id: String(payment.id), date: dateLabel(payment.paid_at || payment.due_at || payment.created_at), description: payment.reference, amountLabel: money(payment.amount_cents), paymentMethodLabel: payment.metadata?.method_label || "", status: payment.status === "paid" ? "PAGO" : "PENDENTE" })), recentOrders: orders.map((order) => ({ id: String(order.id), code: order.code, kindLabel: order.kindKey, title: order.items.map((item) => item.nameSnapshot).join(", ") || order.code, summary: order.notes || "", statusLabel: order.statusKey, statusTone: order.statusKey === "cancelled" ? "danger" : "active", createdAtLabel: dateLabel(order.createdAt), estimateLabel: "", totalLabel: money(order.totalCents), imageUrl: "" })), cycleUsage: cycle ? { cycleLabel: String(cycle.cycleNumber), cutsUsed: cycle.items.length, cutsLimit: cycle.items.length, weightKgUsed: 0, weightKgLimit: 0, charcoalKgUsed: 0, charcoalKgLimit: 0, complementsUsed: 0, complementsLimit: 0, seasoningsUsed: 0, seasoningsLimit: 0, sidesUsed: 0, sidesLimit: 0, utensilsUsed: 0, utensilsLimit: 0 } : null };
      setDataSource(source); setProfileDraft({ name: source.customer.name, email: source.customer.email, phone: source.customer.phone, cpf: source.customer.cpf, birthdate: source.customer.birthdate, preferredDoneness: source.customer.preferredDoneness }); setNotifications(savedNotifications); setSelectedPlanKey(activePlanKey); setPendingPlanKey(activePlanKey);
    } catch (cause) { setError(normalizeApiError(cause)); } finally { setIsLoading(false); }
  }, [apiConfig, customerApi, ordersApi, subscriptionsApi]);
  useEffect(() => { void load(); }, [load]);
  const updateProfileDraft = useCallback((field: keyof ClientCustomerProfileDraft, value: string) => { setProfileDraft((current) => ({ ...current, [field]: value })); setSaveState("idle"); }, []);
  const saveProfileDraft = useCallback(async () => { await customerApi.update({ name: profileDraft.name, email: profileDraft.email, phone: profileDraft.phone, document: profileDraft.cpf, birth_date: profileDraft.birthdate || null, preferences: { preferred_doneness: profileDraft.preferredDoneness } }); setSaveState("saved"); await load(); }, [customerApi, load, profileDraft]);
  const updateNotification = useCallback(async (key: keyof ClientCustomerNotificationPreferences, value: boolean) => { const next = { ...notifications, [key]: value }; setNotifications(next); await customerApi.update({ notification_settings: next }); }, [customerApi, notifications]);
  const viewModel = useMemo(() => createClientCustomerAccountViewModel({ dataSource, selectedPlanKey }), [dataSource, selectedPlanKey]);
  return { activeTab, dataSource, isPlansModalOpen, notifications, pendingPlanKey, profileDraft, saveState, selectedPlanKey, source: "api" as const, viewModel, isLoading, error, actions: { openPlansModal: () => setIsPlansModalOpen(true), confirmPlanChange: () => setIsPlansModalOpen(false), saveProfileDraft, setActiveTab, setIsPlansModalOpen, setPendingPlanKey, updateNotification, updateProfileDraft, reload: load } };
}
