import { useCallback, useMemo, useState } from "react";
import type { ClientOrderCreateInput } from "../contracts/orders.contract";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProduct,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionTier,
} from "../contracts/checkout.contract";
import { clientCheckoutConfig, type ClientCheckoutStepKey } from "../manifest/checkout.config";
import { checkoutFallbackDataSource } from "../data-sources/checkout.fallback";
import { createClientCheckoutViewModel } from "../view-models/checkout.view-model";
import { useClientOrders } from "./useClientOrders";

export interface UseClientCheckoutOptions {
  isAuthenticated?: boolean;
}

type NewAddressDraft = {
  city: string;
  complement: string;
  neighborhood: string;
  number: string;
  street: string;
  zipCode: string;
};

const createEmptyAddressDraft = (): NewAddressDraft => ({
  city: "",
  complement: "",
  neighborhood: "",
  number: "",
  street: "",
  zipCode: "",
});

export function useClientCheckout({ isAuthenticated = false }: UseClientCheckoutOptions = {}) {
  const orders = useClientOrders();
  const dataSource = checkoutFallbackDataSource;
  const [addresses, setAddresses] = useState<ClientCheckoutAddress[]>(dataSource.customer.addresses);
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
    clientCheckoutConfig.defaultPaymentMethod as ClientCheckoutPaymentMethodKey,
  );
  const [selectedInstallments, setSelectedInstallments] = useState(clientCheckoutConfig.defaultInstallments);
  const [pendingStepAfterAuth, setPendingStepAfterAuth] = useState<ClientCheckoutStepKey | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((address) => address.isPrimary)?.id || addresses[0]?.id || "",
  );
  const [newAddressDraft, setNewAddressDraft] = useState(createEmptyAddressDraft);

  const activeSubscription = isAuthenticated ? dataSource.customer.activeSubscription : undefined;
  const activeSubscriptionOrder = activeSubscription
    ? dataSource.customerOrders.find((order) =>
        order.customerId === dataSource.customer.id &&
        order.subscriptionId === activeSubscription.id &&
        order.kind === "subscriptionCycle" &&
        order.status !== "delivered" &&
        order.status !== "cancelled"
      )
    : undefined;
  const activeCycleUsage = activeSubscriptionOrder?.cycleUsage || null;

  const labeledFreightOptions = useMemo(
    () => dataSource.freightOptions.map((option) => ({ ...option })),
    [],
  );
  const viewModel = useMemo(
    () => createClientCheckoutViewModel({
      activeCycleUsage,
      activeSubscription,
      addresses,
      categories: dataSource.productCategories,
      config: clientCheckoutConfig,
      freightOptions: labeledFreightOptions,
      freightPolicies: dataSource.freightPolicies,
      paymentMethods: dataSource.paymentMethods,
      plans: dataSource.subscriptionPlans,
      products: dataSource.products,
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
      activeSubscription,
      addresses,
      labeledFreightOptions,
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
    setSelectedPaymentMethod(clientCheckoutConfig.defaultPaymentMethod as ClientCheckoutPaymentMethodKey);
    setSelectedInstallments(clientCheckoutConfig.defaultInstallments);
  }, []);

  const selectPlan = useCallback((planKey: ClientCheckoutSubscriptionTier) => {
    setSelectedPlanKey(planKey);
    setSelectedProductQuantities({});
  }, []);

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
  }, []);

  const submitNewAddress = useCallback((labelPrefix: string) => {
    const nextIndex = addresses.length + 1;
    const streetParts = [newAddressDraft.street, newAddressDraft.number, newAddressDraft.complement]
      .map((part) => part.trim())
      .filter(Boolean);
    const neighborhoodParts = [newAddressDraft.neighborhood, newAddressDraft.city]
      .map((part) => part.trim())
      .filter(Boolean);
    const nextAddress: ClientCheckoutAddress = {
      id: `address-draft-${Date.now()}`,
      label: `${labelPrefix} ${nextIndex}`,
      recipientName: dataSource.customer.name,
      streetLine: streetParts.join(", ") || newAddressDraft.street.trim() || dataSource.customer.addresses[0]?.streetLine || "",
      neighborhoodLine: neighborhoodParts.join(" - ") || dataSource.customer.addresses[0]?.neighborhoodLine || "",
      zipCode: newAddressDraft.zipCode.trim() || dataSource.customer.addresses[0]?.zipCode || "",
      phone: dataSource.customer.phone,
    };
    setAddresses((current) => [...current, nextAddress]);
    setSelectedAddressId(nextAddress.id);
    setNewAddressDraft(createEmptyAddressDraft());
    setIsAddingAddress(false);
    return nextAddress;
  }, [addresses.length, newAddressDraft]);

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
      subscriptionId: activeSubscription?.id || null,
      subscriptionCycleId: activeSubscriptionOrder?.id || null,
      notes: "",
      items: viewModel.selectedProductEntries.map(({ product, quantity }) => ({
        productKey: product.sku || product.id,
        quantity: String(quantity),
        sourceType: selectedMode,
        sourceKey: product.id,
      })),
    };
  }, [activeSubscription, activeSubscriptionOrder, selectedMode, viewModel]);

  const submitOrder = useCallback(async () => {
    const input = buildOrderInput();
    if (!input) {
      return null;
    }
    return orders.create(input);
  }, [buildOrderInput, orders]);

  return {
    activeCycleUsage,
    activeSubscription,
    activeSubscriptionOrder,
    addresses,
    catalogSubscriptionPlans: dataSource.subscriptionPlans,
    config: clientCheckoutConfig,
    currentStep,
    filterModalOpen,
    freightOptions: labeledFreightOptions,
    freightPolicies: dataSource.freightPolicies,
    isAddingAddress,
    orderCreateState: {
      error: orders.error,
      isLoading: orders.isLoading,
    },
    paymentInstallments: dataSource.paymentInstallments,
    paymentMethods: dataSource.paymentMethods,
    productCategories: dataSource.productCategories,
    products: dataSource.products,
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
    source: "fallback" as const,
    viewModel,
    actions: {
      addProduct,
      buildOrderInput,
      removeProduct,
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
