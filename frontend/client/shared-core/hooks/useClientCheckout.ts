import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientOrderCreateInput, ClientOrderView } from "../contracts/orders.contract";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProduct,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
  ClientCheckoutSubscriptionTier,
} from "../contracts/checkout.contract";
import { clientCheckoutConfig, type ClientCheckoutStepKey } from "../manifest/checkout.config";
import { createClientCheckoutViewModel } from "../view-models/checkout.view-model";
import { mapCheckoutCatalog } from "../mappers/checkout-catalog.mapper";
import { useClientOrders } from "./useClientOrders";
import { createClientOrdersApi } from "../api/orders.api";
import { createClientCustomerApi } from "../api/customer.api";
import { useClientCatalog } from "./useClientCatalog";
import { useClientApiConfig } from "../runtime/ClientApiProvider";
import { createClientSubscriptionsApi } from "../api/subscriptions.api";

export interface UseClientCheckoutOptions {
  isAuthenticated?: boolean;
}

type NewAddressDraft = {
  city: string;
  complement: string;
  label: string;
  neighborhood: string;
  number: string;
  state: string;
  street: string;
  zipCode: string;
};

const createEmptyAddressDraft = (): NewAddressDraft => ({
  city: "",
  complement: "",
  label: "",
  neighborhood: "",
  number: "",
  state: "",
  street: "",
  zipCode: "",
});

const asNumber = (value: string | number | undefined) => Number(value || 0);
const constraintNumber = (constraints: Record<string, unknown>, key: string) =>
  typeof constraints[key] === "number" ? constraints[key] as number : 0;
const constraintText = (constraints: Record<string, unknown>, key: string) =>
  typeof constraints[key] === "string" ? constraints[key] as string : "";

const mapPlan = (plan: Awaited<ReturnType<ReturnType<typeof createClientSubscriptionsApi>["listPlans"]>>[number]): ClientCheckoutSubscriptionPlan => {
  const monthly = plan.prices.find((price) => price.billingInterval === "month") || plan.prices[0];
  const entitlements = plan.entitlements || [];
  const cuts = entitlements.filter((item) => item.measurementUnitKey === "kg");
  const charcoal = entitlements.filter((item) => (item.targetKey || "").toLowerCase().includes("carvao"));
  const capacity = Array.from(entitlements.reduce((groups, item) => {
    const constraints = item.constraints || {};
    const key = constraintText(constraints, "capacityKey") || item.key;
    const current = groups.get(key);
    groups.set(key, {
      key,
      label: constraintText(constraints, "capacityLabel") || item.targetName || item.targetKey || item.key,
      limitQuantity: (current?.limitQuantity || 0) + asNumber(item.quantity),
      measurementUnitSymbol: item.measurementUnitSymbol || current?.measurementUnitSymbol || null,
    });
    return groups;
  }, new Map<string, { key: string; label: string; limitQuantity: number; measurementUnitSymbol: string | null }>()).values());
  return {
    id: String(plan.id), key: plan.key, name: plan.name, accentColor: plan.accentColor, subtitle: plan.description || "",
    monthlyPrice: (monthly?.amountCents || 0) / 100, annualMonthlyPrice: (monthly?.amountCents || 0) / 100,
    billingModes: ["monthly"],
    productSelectionLimit: cuts.reduce((total, item) => total + constraintNumber(item.constraints || {}, "maxSelections"), 0),
    proteinKgLimit: cuts.reduce((total, item) => total + asNumber(item.quantity), 0),
    allowedPlanTiers: [plan.key], includedCharcoalPackages: charcoal.reduce((total, item) => total + asNumber(item.quantity), 0),
    charcoalKgLimit: 0, seasoningSelectionLimit: 0, sideSelectionLimit: 0, utensilSelectionLimit: 0,
    includesUtensilProductIds: [], shipping: "calculated", description: plan.description || "",
    features: entitlements.map((item) => item.targetName || item.targetKey || item.key),
    capacity,
  };
};

const mapCheckoutAddress = (address: {
  id: string;
  label?: string | null;
  recipient_name?: string | null;
  postal_code?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  is_default?: boolean | null;
}): ClientCheckoutAddress => ({
  id: String(address.id),
  label: address.label || "",
  recipientName: address.recipient_name || "",
  streetLine: [address.street, address.number, address.complement].filter(Boolean).join(", "),
  neighborhoodLine: [address.district, address.city, address.state].filter(Boolean).join(" - "),
  zipCode: address.postal_code || "",
  isPrimary: Boolean(address.is_default),
});

export function useClientCheckout({ isAuthenticated = false }: UseClientCheckoutOptions = {}) {
  const apiConfig = useClientApiConfig();
  const catalog = useClientCatalog({ apiConfig });
  const customerApi = useMemo(() => createClientCustomerApi(apiConfig), [apiConfig]);
  const subscriptionsApi = useMemo(() => createClientSubscriptionsApi(apiConfig), [apiConfig]);
  const orders = useClientOrders({ api: useMemo(() => createClientOrdersApi(apiConfig), [apiConfig]) });
  const checkoutCatalog = useMemo(
    () => mapCheckoutCatalog(catalog.snapshot.products, catalog.snapshot.categories),
    [catalog.snapshot.categories, catalog.snapshot.products],
  );
  const [plans, setPlans] = useState<ClientCheckoutSubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<{ id: string; planKey: ClientCheckoutSubscriptionTier; nextBillingLabel: string; nextDeliveryLabel: string }>();
  const [activeCycle, setActiveCycle] = useState<any>(null);

  useEffect(() => {
    void catalog.load().catch(() => undefined);
    void orders.loadConfig().catch(() => undefined);
    void Promise.all([
      subscriptionsApi.listPlans(),
      isAuthenticated ? subscriptionsApi.me() : Promise.resolve(null),
      isAuthenticated ? subscriptionsApi.currentCycle() : Promise.resolve(null),
    ]).then(([nextPlans, subscription, cycle]) => {
      setPlans(nextPlans.map(mapPlan));
      setActiveSubscription(subscription ? {
        id: String(subscription.id), planKey: subscription.plan.key,
        nextBillingLabel: subscription.currentCycleEndsAt?.slice(0, 10) || "", nextDeliveryLabel: subscription.currentCycleEndsAt?.slice(0, 10) || "",
      } : undefined);
      const selectedPlan = subscription ? nextPlans.find((plan) => plan.key === subscription.plan.key) : undefined;
      const selectedPlanLimits = selectedPlan ? mapPlan(selectedPlan) : null;
      setActiveCycle(cycle ? {
        capacity: cycle.capacity.map((capacity) => ({
          key: capacity.key,
          label: capacity.label,
          limitQuantity: asNumber(capacity.limitQuantity),
          measurementUnitSymbol: capacity.measurementUnitSymbol,
          usedQuantity: asNumber(capacity.usedQuantity),
        })),
        id: String(cycle.id), cutsUsed: cycle.items.length, cutsLimit: selectedPlanLimits?.productSelectionLimit || 0,
        weightKgUsed: cycle.items.reduce((total, item) => total + asNumber(item.quantity), 0), weightKgLimit: selectedPlanLimits?.proteinKgLimit || 0,
        charcoalKgUsed: 0, charcoalKgLimit: selectedPlanLimits?.charcoalKgLimit || 0,
        seasoningsUsed: 0, seasoningsLimit: 0, sidesUsed: 0, sidesLimit: 0, utensilsUsed: 0, utensilsLimit: 0,
      } : null);
    }).catch(() => undefined);
  }, [catalog.load, isAuthenticated, orders.loadConfig, subscriptionsApi]);
  const serverCheckout = orders.config?.checkout;
  const freightOptions = useMemo(
    () => (serverCheckout?.freightOptions || []).map(({ priceCents, ...option }) => ({ ...option, price: priceCents / 100 })),
    [serverCheckout?.freightOptions],
  );
  const freightPolicies = useMemo(
    () => ({ subscription: { price: 0 }, royalBox: { price: 0 }, royalDelivery: { price: 0 }, ...Object.fromEntries(Object.entries(serverCheckout?.freightPolicies || {}).map(([mode, policy]) => [mode, { ...policy, price: policy.priceCents / 100 }])) }) as Record<ClientCheckoutProductExperience, { price: number; defaultOptionKey?: ClientCheckoutFreightOptionKey }>,
    [serverCheckout?.freightPolicies],
  );
  const [addresses, setAddresses] = useState<ClientCheckoutAddress[]>([]);
  const [selectedMode, setSelectedMode] = useState<ClientCheckoutProductExperience | null>(clientCheckoutConfig.defaultMode);
  const [selectedPlanKey, setSelectedPlanKey] = useState<ClientCheckoutSubscriptionTier>(
    clientCheckoutConfig.defaultPlanKey as ClientCheckoutSubscriptionTier,
  );
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<ClientCheckoutStepKey>(clientCheckoutConfig.defaultStep);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<ClientCheckoutFreightOptionKey | null>(null);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState(clientCheckoutConfig.defaultDeliveryDay);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<ClientCheckoutPaymentMethodKey>(
    "pix",
  );
  const [selectedInstallments, setSelectedInstallments] = useState(clientCheckoutConfig.defaultInstallments);
  const [pendingStepAfterAuth, setPendingStepAfterAuth] = useState<ClientCheckoutStepKey | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((address) => address.isPrimary)?.id || addresses[0]?.id || "",
  );
  const [newAddressDraft, setNewAddressDraft] = useState(createEmptyAddressDraft);
  const [addressSaveState, setAddressSaveState] = useState<"idle" | "saving" | "error">("idle");
  const [submittedOrder, setSubmittedOrder] = useState<ClientOrderView | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setAddresses([]);
      return;
    }
    void customerApi.me().then((customer) => {
      const nextAddresses = (customer.addresses || []).map(mapCheckoutAddress);
      setAddresses(nextAddresses);
      setSelectedAddressId(nextAddresses.find((address) => address.isPrimary)?.id || nextAddresses[0]?.id || "");
    }).catch(() => undefined);
  }, [customerApi, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !pendingStepAfterAuth) return;

    setCurrentStep(pendingStepAfterAuth);
    setPendingStepAfterAuth(null);
  }, [isAuthenticated, pendingStepAfterAuth]);

  const activeCycleUsage = activeCycle;

  const viewModel = useMemo(
    () => createClientCheckoutViewModel({
      activeCycleUsage,
      activeSubscription,
      addresses,
      categories: checkoutCatalog.categories,
      config: clientCheckoutConfig,
      freightOptions,
      freightPolicies,
      paymentMethods: serverCheckout?.paymentMethods || [],
      plans,
      products: checkoutCatalog.products,
      query,
      selectedAddressId,
      selectedCategoryId,
      selectedDeliveryDay,
      selectedFreight,
      selectedInstallments,
      selectedMode,
      selectedPaymentMethod,
      selectedPlanKey,
      selectedProductQuantities,
    }),
    [
      activeCycleUsage,
      activeCycle,
      activeSubscription,
      addresses,
      checkoutCatalog,
      freightOptions,
      freightPolicies,
      query,
      selectedAddressId,
      selectedCategoryId,
      selectedDeliveryDay,
      selectedFreight,
      selectedInstallments,
      selectedMode,
      selectedPaymentMethod,
      selectedPlanKey,
      selectedProductQuantities,
    ],
  );

  const selectMode = useCallback((mode: ClientCheckoutProductExperience) => {
    setSelectedMode(mode);
    if (mode === "subscription") {
      setSelectedPlanKey(clientCheckoutConfig.defaultPlanKey as ClientCheckoutSubscriptionTier);
    }
    setSelectedProductQuantities({});
    setSelectedCategoryId("all");
    setQuery("");
    setCurrentStep(clientCheckoutConfig.defaultStep);
    setSelectedFreight(null);
    setSelectedDeliveryDay(clientCheckoutConfig.defaultDeliveryDay);
    setSelectedPaymentMethod("pix");
    setSelectedInstallments(clientCheckoutConfig.defaultInstallments);
  }, []);

  const selectPlan = useCallback((planKey: ClientCheckoutSubscriptionTier) => {
    setSelectedPlanKey(planKey);
    setSelectedProductQuantities({});
  }, []);

  const requestProtectedStep = useCallback((step: ClientCheckoutStepKey) => {
    if (!isAuthenticated) {
      setPendingStepAfterAuth(step);
      return false;
    }

    setCurrentStep(step);
    return true;
  }, [isAuthenticated]);

  const addProduct = useCallback(
    (product: ClientCheckoutProduct) => {
      setSelectedProductQuantities((current) => {
        if (!viewModel.canAddProduct(product)) {
          return current;
        }
        return {
          ...current,
          [product.id]: (current[product.id] || 0) + 1,
        };
      });
    },
    [viewModel],
  );

  const removeProduct = useCallback((productId: string) => {
    setSelectedProductQuantities((current) => {
      const quantity = current[productId] || 0;
      if (quantity <= 1) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity - 1 };
    });
  }, []);

  const updateNewAddressDraft = useCallback((field: keyof NewAddressDraft, value: string) => {
    setNewAddressDraft((current) => ({ ...current, [field]: value }));
    setAddressSaveState("idle");
  }, []);

  const canSaveNewAddress = Boolean(
    newAddressDraft.label.trim()
    && newAddressDraft.zipCode.replace(/\D/g, "").length === 8
    && newAddressDraft.street.trim()
    && newAddressDraft.city.trim()
    && newAddressDraft.state.trim(),
  );

  const submitNewAddress = useCallback(async () => {
    if (!canSaveNewAddress) {
      setAddressSaveState("error");
      return null;
    }
    setAddressSaveState("saving");
    try {
      const createdAddress = await customerApi.createAddress({
        label: newAddressDraft.label.trim(),
        postal_code: newAddressDraft.zipCode.trim(),
        street: newAddressDraft.street.trim(),
        number: newAddressDraft.number.trim(),
        complement: newAddressDraft.complement.trim(),
        district: newAddressDraft.neighborhood.trim(),
        city: newAddressDraft.city.trim(),
        state: newAddressDraft.state.trim().toUpperCase(),
        is_default: addresses.length === 0,
      });
      const nextAddress = mapCheckoutAddress(createdAddress);
      setAddresses((current) => [...current, nextAddress]);
      setSelectedAddressId(nextAddress.id);
      setNewAddressDraft(createEmptyAddressDraft());
      setIsAddingAddress(false);
      setAddressSaveState("idle");
      return nextAddress;
    } catch {
      setAddressSaveState("error");
      return null;
    }
  }, [addresses.length, canSaveNewAddress, customerApi, newAddressDraft]);

  const buildOrderInput = useCallback((): ClientOrderCreateInput | null => {
    if (!selectedMode || viewModel.selectedProductEntries.length === 0) {
      return null;
    }
    const kindKey = clientCheckoutConfig.orderKindByMode[selectedMode];
    if (!kindKey) {
      return null;
    }
    return {
      kindKey,
      addressId: viewModel.selectedAddress?.id || null,
      subscriptionId: selectedMode === "subscription" ? activeSubscription?.id || null : null,
      subscriptionCycleId: selectedMode === "subscription" ? activeCycle?.id || null : null,
      notes: "",
      items: viewModel.selectedProductEntries.map(({ product, quantity }) => ({
        productKey: product.productKey,
        variantSku: product.variantSku,
        quantity: String(quantity),
        sourceType: selectedMode,
        sourceKey: product.id,
      })),
    };
  }, [activeCycle, activeSubscription, selectedMode, viewModel]);

  const submitOrder = useCallback(async () => {
    const input = buildOrderInput();
    if (!input) {
      return null;
    }
    setSubmittedOrder(null);
    const order = selectedMode === "royalBox"
      ? await orders.createRoyalBox(input, selectedDeliveryDay)
      : await orders.create(input);
    setSubmittedOrder(order);
    return order;
  }, [buildOrderInput, orders, selectedDeliveryDay, selectedMode]);

  return {
    activeCycleUsage,
    activeSubscription,
    addressSaveState,
    canSaveNewAddress,
    addresses,
    catalogSubscriptionPlans: plans,
    config: clientCheckoutConfig,
    currentStep,
    filterModalOpen,
    freightOptions,
    freightPolicies,
    isAddingAddress,
    isAcquisitionLoading: catalog.isLoading,
    hasCatalogError: Boolean(catalog.error),
    orderCreateState: {
      createdOrderCode: submittedOrder?.code || "",
      error: orders.error,
      isLoading: orders.isLoading,
    },
    paymentInstallments: serverCheckout?.paymentInstallments || [],
    paymentMethods: serverCheckout?.paymentMethods || [],
    productCategories: checkoutCatalog.categories,
    products: checkoutCatalog.products,
    query,
    selectedAddressId,
    newAddressDraft,
    selectedCategoryId,
    selectedDeliveryDay,
    selectedFreight,
    selectedInstallments,
    selectedMode,
    selectedPaymentMethod,
    selectedPlanKey,
    selectedProductQuantities,
    source: "api" as const,
    viewModel,
    whatsappUrl: serverCheckout?.whatsappUrl || "",
    actions: {
      addProduct,
      buildOrderInput,
      reloadCatalog: catalog.load,
      removeProduct,
      requestProtectedStep,
      selectMode,
      selectPlan,
      setCurrentStep,
      setFilterModalOpen,
      setIsAddingAddress,
      setPendingStepAfterAuth,
      setQuery,
      setSelectedAddressId,
      setSelectedCategoryId,
      setSelectedDeliveryDay,
      setSelectedFreight,
      setSelectedInstallments,
      setSelectedPaymentMethod,
      submitNewAddress,
      submitOrder,
      updateNewAddressDraft,
    },
    pendingStepAfterAuth,
  };
}
