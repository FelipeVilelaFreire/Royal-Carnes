import { useCallback, useEffect, useMemo, useState } from "react";
import { buildApiHeaders, normalizeApiError, throwIfApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { createClientCustomerApi } from "../api/customer.api";
import { lookupBrazilianPostalCode } from "../api/brazilian-postal-code.api";
import { createClientOrdersApi } from "../api/orders.api";
import { createClientSubscriptionsApi } from "../api/subscriptions.api";
import type { ClientCustomerAddressCreateInput, ClientCustomerNotificationPreferences } from "../contracts/customer.contract";
import { useClientApiConfig } from "../runtime/ClientApiProvider";
import type { ClientCustomerProfileDraft, ClientCustomerTabKey } from "../types/customer.types";
import {
  createClientCustomerAccountViewModel,
  createClientCustomerCycleUsage,
  createClientCustomerPlans,
  createClientCustomerRecentOrders,
} from "../view-models/customer.view-model";
import { createClientOrdersViewModel } from "../view-models/orders.view-model";

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
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const paymentResponse = await (apiConfig.fetcher || fetch)(`${apiConfig.baseUrl || ""}/api/v1/payments/me/`, { headers: buildApiHeaders({ token: apiConfig.getAccessToken?.(), organizationSlug: apiConfig.organizationSlug }) });
      await throwIfApiError(paymentResponse);
      const [customer, plans, subscription, cycle, orders, payments, ordersConfig] = await Promise.all([
        customerApi.me(),
        subscriptionsApi.listPlans(),
        subscriptionsApi.me(),
        subscriptionsApi.currentCycle(),
        ordersApi.listMine(),
        paymentResponse.json(),
        ordersApi.config().catch(() => null),
      ]);
      const savedNotifications = { ...notificationsDefault, ...(customer.notification_settings || {}) };
      const planSource = subscription && !plans.some((plan) => plan.key === subscription.plan.key)
        ? [...plans, subscription.plan]
        : plans;
      const mappedPlans = createClientCustomerPlans(planSource);
      const activePlanKey = subscription?.plan.key || "";
      const source: any = { customer: { id: String(customer.id), name: customer.name, email: customer.email || "", phone: customer.phone || "", cpf: customer.document || "", birthdate: customer.birth_date || "", preferredDoneness: String(customer.preferences?.preferred_doneness || ""), memberSince: dateLabel(customer.member_since || customer.created_at), activeSubscription: subscription ? { id: String(subscription.id), planKey: activePlanKey, billingLabel: "", nextBillingLabel: dateLabel(subscription.currentCycleEndsAt), nextDeliveryLabel: dateLabel(subscription.currentCycleEndsAt) } : undefined, addresses: (customer.addresses || []).map((address) => ({ id: String(address.id), label: address.label || "", recipientName: address.recipient_name || customer.name, street: address.street || "", number: address.number || "", complement: address.complement || "", district: address.district || "", city: address.city || "", state: address.state || "", streetLine: [address.street, address.number, address.complement].filter(Boolean).join(", "), neighborhoodLine: [address.district, address.city, address.state].filter(Boolean).join(" - "), zipCode: address.postal_code || "", isPrimary: Boolean(address.is_default) })), paymentMethods: (customer.payment_methods || []).map((method) => ({ id: String(method.id), brand: method.label || method.provider || method.method_type, last4: String(method.metadata?.last4 || ""), holderName: String(method.metadata?.holder_name || ""), expiresAt: String(method.metadata?.expires_at || ""), isDefault: Boolean(method.is_default) })), notifications: savedNotifications }, plans: mappedPlans, invoices: payments.map((payment: any) => ({ id: String(payment.id), date: dateLabel(payment.paid_at || payment.due_at || payment.created_at), description: payment.reference, amountLabel: money(payment.amount_cents), paymentMethodLabel: payment.metadata?.method_label || "", status: payment.status === "paid" ? "PAGO" : "PENDENTE" })), recentOrders: createClientCustomerRecentOrders(createClientOrdersViewModel(orders, ordersConfig)), cycleUsage: createClientCustomerCycleUsage(subscription, cycle) };
      setDataSource(source); setProfileDraft({ name: source.customer.name, email: source.customer.email, phone: source.customer.phone, cpf: source.customer.cpf, birthdate: source.customer.birthdate, preferredDoneness: source.customer.preferredDoneness }); setNotifications(savedNotifications); setSelectedPlanKey(activePlanKey);
    } catch (cause) { setError(normalizeApiError(cause)); } finally { setIsLoading(false); }
  }, [apiConfig, customerApi, ordersApi, subscriptionsApi]);
  useEffect(() => { void load(); }, [load]);
  const updateProfileDraft = useCallback((field: keyof ClientCustomerProfileDraft, value: string) => { setProfileDraft((current) => ({ ...current, [field]: value })); setSaveState("idle"); }, []);
  const saveProfileDraft = useCallback(async () => { await customerApi.update({ name: profileDraft.name, email: profileDraft.email, phone: profileDraft.phone, document: profileDraft.cpf, birth_date: profileDraft.birthdate || null, preferences: { preferred_doneness: profileDraft.preferredDoneness } }); setSaveState("saved"); await load(); }, [customerApi, load, profileDraft]);
  const updateNotification = useCallback(async (key: keyof ClientCustomerNotificationPreferences, value: boolean) => { const next = { ...notifications, [key]: value }; setNotifications(next); await customerApi.update({ notification_settings: next }); }, [customerApi, notifications]);
  const createAddress = useCallback(async (input: ClientCustomerAddressCreateInput) => {
    await customerApi.createAddress({
      label: input.label,
      recipient_name: input.recipientName,
      street: input.street,
      number: input.number,
      complement: input.complement,
      district: input.district,
      city: input.city,
      state: input.state,
      postal_code: input.zipCode,
      is_default: input.isPrimary,
    });
    await load();
  }, [customerApi, load]);
  const lookupAddressByPostalCode = useCallback(
    (postalCode: string) => lookupBrazilianPostalCode(postalCode),
    [],
  );
  const viewModel = useMemo(() => createClientCustomerAccountViewModel({ dataSource, selectedPlanKey }), [dataSource, selectedPlanKey]);
  return { activeTab, dataSource, notifications, profileDraft, saveState, selectedPlanKey, source: "api" as const, viewModel, isLoading, error, actions: { createAddress, lookupAddressByPostalCode, saveProfileDraft, setActiveTab, updateNotification, updateProfileDraft, reload: load } };
}
