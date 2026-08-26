"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "../../../legacy/design-system";
import { AuthModal, BottomTabBar, PortalHeader } from "../../../legacy/app-shell";
import {
  BoxIcon,
  CartIcon,
  CheckIcon,
  CreditCardIcon,
  CutMeatIcon,
  OfferTagIcon,
  SettingsIcon,
  TruckIcon
} from "../../../legacy/design-system/Icons";
import { StoreIcon, TrashIcon } from "@foundation/ui/Icon/AppIcons";
import { ProductItemCard } from "../../../product-components/ecommerce";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { clientPtBR } from "@/locales/pt-BR";
import {
  catalogSubscriptionPlansMock,
  productCategoriesMock,
  productsMock
} from "@/mocks/catalog";
import { royalCustomerMock } from "@/mocks/customer.mock";
import { royalCustomerOrdersMock } from "@/mocks/orders";
import { freightOptionsMock, freightPoliciesMock, type FreightOptionKey } from "@/mocks/freight.mock";
import { paymentInstallmentsMock, paymentMethodsMock, type PaymentMethodKey } from "@/mocks/payment.mock";
import type { Product, ProductExperience, SubscriptionTier } from "@/mocks/catalog";

export interface PedidoViewProps {
  onNavigate?: (path: string) => void;
  showHeader?: boolean;
}

type PedidoMode = ProductExperience;
type PedidoStep = "montagem" | "entrega" | "pagamento" | "resumo";

const modeIcons = {
  subscription: OfferTagIcon,
  royalBox: BoxIcon,
  royalDelivery: TruckIcon
};

const modeOrder: PedidoMode[] = ["subscription", "royalBox", "royalDelivery"];
const stepOrder: PedidoStep[] = ["montagem", "entrega", "pagamento", "resumo"];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);

const formatMeasure = (value: number, unit: string) => `${Number(value.toFixed(1))}${unit}`;

const getProductMeasure = (product: Product) => {
  if (product.kind === "charcoal") {
    const kgMatch = product.weightLabel?.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    return kgMatch ? Number(kgMatch[1].replace(",", ".")) : 1;
  }
  return 1;
};

export const PedidoView: React.FC<PedidoViewProps> = ({ onNavigate, showHeader = true }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [selectedMode, setSelectedMode] = useState<PedidoMode | null>(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState<SubscriptionTier>("pro");
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<PedidoStep>("montagem");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedFreight, setSelectedFreight] = useState<FreightOptionKey | null>(null);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState(10);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodKey>("creditCard");
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMockAuthenticated, setIsMockAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("royal_prime_mock_authenticated") === "true";
    }
    return false;
  });
  const [pendingStepAfterAuth, setPendingStepAfterAuth] = useState<PedidoStep | null>(null);

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    const handleAuthChange = () => {
      setIsMockAuthenticated(localStorage.getItem("royal_prime_mock_authenticated") === "true");
    };
    window.addEventListener("royal_theme_changed", handleThemeChange);
    window.addEventListener("royal_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("royal_theme_changed", handleThemeChange);
      window.removeEventListener("royal_auth_changed", handleAuthChange);
    };
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const strings = clientPtBR.pedido;
  const selectedPlan = catalogSubscriptionPlansMock.find((plan) => plan.key === selectedPlanKey) || catalogSubscriptionPlansMock[0];
  const hasMode = Boolean(selectedMode);
  const activeSubscription = isMockAuthenticated ? royalCustomerMock.activeSubscription : undefined;
  const activeSubscriptionPlan = activeSubscription
    ? catalogSubscriptionPlansMock.find((plan) => plan.key === activeSubscription.planKey)
    : undefined;
  const activeSubscriptionOrder = activeSubscription
    ? royalCustomerOrdersMock.find((order) =>
        order.customerId === royalCustomerMock.id &&
        order.subscriptionId === activeSubscription.id &&
        order.kind === "subscriptionCycle" &&
        order.status !== "delivered" &&
        order.status !== "cancelled"
      )
    : undefined;
  const activeCycleUsage = activeSubscriptionOrder?.cycleUsage;
  const activeSubscriptionLabel = activeSubscriptionPlan ? `Royal ${activeSubscriptionPlan.name}` : "";
  const subscriptionSummaryUsage = selectedMode === "subscription" && activeCycleUsage ? activeCycleUsage : null;
  const deliveryCopy = selectedMode ? strings.deliveryStep[selectedMode] : null;
  const paymentCopy = strings.paymentStep;
  const reviewCopy = strings.reviewStep;
  const freightOptions = freightOptionsMock.map((option) => ({
    ...option,
    label: strings.deliveryStep.royalDelivery[option.labelKey]
  }));
  const paymentMethods = paymentMethodsMock
    .filter((method) => (selectedMode ? method.availableFor.includes(selectedMode) : true))
    .map((method) => ({
      ...method,
      label: paymentCopy.methods[method.labelKey],
      description: paymentCopy.methods[method.descriptionKey]
    }));
  const currentFreightPrice =
    selectedMode === "royalDelivery" && selectedFreight
      ? freightOptions.find((option) => option.key === selectedFreight)?.price || 0
      : selectedMode
        ? freightPoliciesMock[selectedMode].price
        : 0;
  const currentFreightOption = selectedFreight ? freightOptions.find((option) => option.key === selectedFreight) : undefined;
  const newAddressFields = [
    { label: strings.deliveryStep.common.zipCode, placeholder: "00000-000", gridColumn: "span 3" },
    { label: strings.deliveryStep.common.street, placeholder: "Rua das Palmeiras", gridColumn: "span 6" },
    { label: strings.deliveryStep.common.number, placeholder: "120", gridColumn: "span 3" },
    { label: strings.deliveryStep.common.neighborhood, placeholder: "Centro", gridColumn: "span 4" },
    { label: strings.deliveryStep.common.city, placeholder: "Sao Paulo", gridColumn: "span 4" },
    { label: strings.deliveryStep.common.complement, placeholder: "Apto, bloco ou referencia", gridColumn: "span 4" }
  ];

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    localStorage.setItem("royal_prime_theme", next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const requestProtectedStep = (step: PedidoStep) => {
    if (isMockAuthenticated) {
      setCurrentStep(step);
      return;
    }
    setPendingStepAfterAuth(step);
    setIsAuthModalOpen(true);
  };

  const handleAuthenticatedCheckout = () => {
    setIsMockAuthenticated(true);
    if (pendingStepAfterAuth) {
      setCurrentStep(pendingStepAfterAuth);
      setPendingStepAfterAuth(null);
    }
  };

  const categoryById = useMemo(
    () => new Map(productCategoriesMock.map((category) => [category.id, category])),
    []
  );

  const availableProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return productsMock.filter((product) => {
      const isIncludedInSelectedPlan =
        selectedMode === "subscription" && product.includedInPlans?.includes(selectedPlan.key);
      const matchesMode = selectedMode
        ? product.availableFor.includes(selectedMode) || Boolean(isIncludedInSelectedPlan)
        : true;
      const matchesPlan =
        selectedMode === "subscription"
          ? product.planTiers.some((tier) => selectedPlan.allowedPlanTiers.includes(tier)) ||
            Boolean(isIncludedInSelectedPlan)
          : true;
      const matchesCategory = selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesMode && matchesPlan && matchesCategory && matchesQuery;
    });
  }, [query, selectedCategoryId, selectedMode, selectedPlan.allowedPlanTiers]);

  const selectedProductEntries = productsMock
    .map((product) => ({
      product,
      quantity: selectedProductQuantities[product.id] || 0
    }))
    .filter((entry) => entry.quantity > 0);
  const selectedUnitsCount = selectedProductEntries.reduce((total, entry) => total + entry.quantity, 0);
  const selectedProteinKg = selectedProductEntries
    .filter((entry) => entry.product.kind === "meat")
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedCharcoalKg = selectedProductEntries
    .filter((entry) => entry.product.kind === "charcoal")
    .reduce((total, entry) => total + getProductMeasure(entry.product) * entry.quantity, 0);
  const selectedSeasoningCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "seasoning")
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedSideCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "kit" && entry.product.tags.includes("acompanhamento"))
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedUtensilCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "utensil")
    .reduce((total, entry) => total + entry.quantity, 0);
  const estimatedTotal = selectedProductEntries.reduce((total, entry) => {
    const { product, quantity } = entry;
    return total + product.price * quantity;
  }, 0);
  const orderEstimateTotal =
    selectedMode === "royalDelivery" && selectedFreight
      ? estimatedTotal + currentFreightPrice
      : estimatedTotal;
  const finalTotal = selectedMode === "subscription" ? selectedPlan.monthlyPrice : orderEstimateTotal;
  const selectedPayment = paymentMethods.find((method) => method.key === selectedPaymentMethod) || paymentMethods[0];
  const getSubscriptionKindLimit = (product: Product) => {
    if (product.kind === "meat") return selectedPlan.proteinKgLimit;
    if (product.kind === "charcoal") return selectedPlan.charcoalKgLimit;
    if (product.kind === "seasoning") return selectedPlan.seasoningSelectionLimit;
    if (product.kind === "kit" && product.tags.includes("acompanhamento")) return selectedPlan.sideSelectionLimit;
    if (product.kind === "utensil") return selectedPlan.utensilSelectionLimit;
    return selectedPlan.productSelectionLimit;
  };

  const getSelectedKindCount = (product: Product) => {
    if (product.kind === "meat") return selectedProteinKg;
    if (product.kind === "charcoal") return selectedCharcoalKg;
    if (product.kind === "seasoning") return selectedSeasoningCount;
    if (product.kind === "kit" && product.tags.includes("acompanhamento")) return selectedSideCount;
    if (product.kind === "utensil") return selectedUtensilCount;
    return selectedUnitsCount;
  };

  const handleModeSelect = (mode: PedidoMode) => {
    setSelectedMode(mode);
    if (mode === "subscription") {
      setSelectedPlanKey("pro");
    }
    setSelectedProductQuantities({});
    setSelectedCategoryId("all");
    setQuery("");
    setCurrentStep("montagem");
    setSelectedFreight(null);
    setSelectedDeliveryDay(10);
    setSelectedPaymentMethod("creditCard");
    setSelectedInstallments(1);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProductQuantities((current) => {
      if (
        selectedMode === "subscription" &&
        getSelectedKindCount(product) + getProductMeasure(product) > getSubscriptionKindLimit(product)
      ) {
        return current;
      }
      return {
        ...current,
        [product.id]: (current[product.id] || 0) + 1
      };
    });
  };

  const handleProductRemove = (productId: string) => {
    setSelectedProductQuantities((current) => {
      const quantity = current[productId] || 0;
      if (quantity <= 1) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity - 1 };
    });
  };

  const cardSurface: React.CSSProperties = {
    background: tokens.surfaceContainer,
    border: `1px solid ${tokens.border}`,
    borderRadius: "18px",
    boxShadow: isDark ? "0 18px 46px rgba(0, 0, 0, 0.24)" : "0 18px 46px rgba(47, 31, 18, 0.08)"
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: showHeader ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        background: tokens.background,
        color: tokens.text,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {showHeader ? (
        <PortalHeader
          activeTab="produtos"
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onNavigate={onNavigate}
        />
      ) : null}

      <style>{`
        @keyframes pedidoAppear {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pedido-mode-card:hover,
        .pedido-plan-card:hover,
        .royal-product-card:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 1100px) {
          .pedido-shell {
            grid-template-columns: 1fr !important;
          }

          .pedido-summary {
            position: static !important;
          }
        }

        @media (max-width: 760px) {
          .portal-header {
            display: none !important;
          }

          .pedido-main {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 96px !important;
          }

          .pedido-product-grid {
            grid-template-columns: 1fr !important;
          }

          .pedido-toolbar {
            grid-template-columns: 1fr !important;
          }

          .pedido-payment-grid {
            grid-template-columns: 1fr !important;
          }

          .pedido-review-total-grid {
            grid-template-columns: 1fr !important;
          }

          .pedido-address-form {
            grid-template-columns: 1fr !important;
          }

          .pedido-address-field {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>

      <main
        className="pedido-main appear-on-scroll"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1560px",
          margin: "0 auto",
          padding: showHeader ? "42px 28px 80px" : "28px 28px 80px",
          boxSizing: "border-box"
        }}
      >
        <section style={{ marginBottom: hasMode ? "26px" : "36px" }}>
          <div
            style={{
              ...cardSurface,
              padding: hasMode ? "22px 24px" : "30px",
              background: isDark
                ? "linear-gradient(135deg, rgba(34, 31, 30, 0.94), rgba(11, 9, 8, 0.98))"
                : "linear-gradient(135deg, rgba(255, 249, 239, 0.96), rgba(252, 251, 247, 0.98))",
              borderRadius: "22px"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: tokens.copper,
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}
            >
              {strings.hero.badge}
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontSize: hasMode ? "42px" : "clamp(42px, 6vw, 64px)",
                lineHeight: 1.02,
                color: tokens.text,
                transition: "font-size 0.28s ease"
              }}
            >
              {strings.hero.title}
            </h1>
            <p
              style={{
                maxWidth: "760px",
                margin: "14px 0 0",
                color: tokens.textMuted,
                fontSize: hasMode ? "15px" : "18px",
                lineHeight: 1.55,
                transition: "font-size 0.28s ease"
              }}
            >
              {strings.hero.description}
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: hasMode ? "repeat(3, minmax(0, 1fr))" : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: hasMode ? "12px" : "18px",
            marginBottom: hasMode ? "24px" : "0",
            transition: "all 0.28s ease"
          }}
        >
          {modeOrder.map((mode) => {
            const modeCopy = strings.modes[mode];
            const Icon = modeIcons[mode];
            const isActive = selectedMode === mode;
            const isActiveSubscriptionMode = mode === "subscription" && Boolean(activeSubscription && activeSubscriptionPlan);
            const modeEyebrow = isActiveSubscriptionMode ? activeSubscriptionLabel : modeCopy.eyebrow;
            const modeTitle = isActiveSubscriptionMode ? strings.summary.activeSubscriptionMode : modeCopy.title;
            const modeDescription = isActiveSubscriptionMode
              ? `${strings.summary.activeCycleDescriptionPrefix} ${activeSubscriptionLabel}.`
              : modeCopy.description;
            const modeDetails = isActiveSubscriptionMode
              ? [
                  `${strings.summary.subscriptionRenewPrefix} ${activeSubscription?.nextBillingLabel}`,
                  activeSubscription?.nextDeliveryLabel ? `${strings.summary.nextDeliveryPrefix} ${activeSubscription.nextDeliveryLabel}` : strings.summary.currentCycleFallback,
                  activeCycleUsage
                    ? `${formatMeasure(activeCycleUsage.weightKgUsed, "kg")}/${formatMeasure(activeCycleUsage.weightKgLimit, "kg")} ${strings.summary.cycleUsedSuffix}`
                    : strings.summary.currentCycleFallback
                ]
              : modeCopy.details;
            return (
              <button
                className="pedido-mode-card"
                key={mode}
                type="button"
                onClick={() => handleModeSelect(mode)}
                style={{
                  ...cardSurface,
                  minHeight: hasMode ? "156px" : "276px",
                  padding: hasMode ? "18px" : "28px",
                  textAlign: "left",
                  cursor: "pointer",
                  border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                  background: isActive
                    ? isDark
                      ? "linear-gradient(135deg, rgba(184, 115, 51, 0.18), rgba(34, 31, 30, 0.92))"
                      : "linear-gradient(135deg, rgba(184, 115, 51, 0.12), rgba(252, 251, 247, 0.96))"
                    : tokens.surfaceContainer,
                  boxShadow: isActive
                    ? isDark
                      ? "0 20px 52px rgba(0, 0, 0, 0.28)"
                      : "0 20px 52px rgba(184, 115, 51, 0.12)"
                    : cardSurface.boxShadow,
                  transition: "all 0.28s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: hasMode ? "14px" : "20px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                    <span
                      style={{
                        width: hasMode ? "48px" : "62px",
                        height: hasMode ? "48px" : "62px",
                        borderRadius: hasMode ? "16px" : "20px",
                        display: "grid",
                        placeItems: "center",
                        color: isActive ? "#FCFBF7" : tokens.copper,
                        background: isActive ? tokens.copper : isDark ? "rgba(184, 115, 51, 0.12)" : "rgba(184, 115, 51, 0.1)",
                        flexShrink: 0,
                        transition: "all 0.28s ease"
                      }}
                    >
                      <Icon size={hasMode ? 22 : 30} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          color: tokens.copper,
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "7px"
                        }}
                      >
                        {modeEyebrow}
                      </span>
                      <span
                        style={{
                          display: "block",
                          color: tokens.text,
                          fontFamily: "'Playfair Display', serif",
                          fontSize: hasMode ? "24px" : "31px",
                          fontWeight: 700,
                          lineHeight: 1.08
                        }}
                      >
                        {modeTitle}
                      </span>
                      {isActiveSubscriptionMode ? (
                        <span style={{ display: "inline-flex", width: "fit-content", marginTop: "8px", border: `1px solid ${tokens.copper}`, borderRadius: "999px", color: tokens.copper, padding: "5px 9px", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {strings.summary.activeSubscriptionBadge}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  {isActive ? (
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "999px",
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${tokens.copper}`,
                        color: tokens.copper,
                        flexShrink: 0
                      }}
                    >
                      <CheckIcon size={17} />
                    </span>
                  ) : null}
                </div>

                {!hasMode ? (
                  <p style={{ margin: 0, color: tokens.textMuted, fontSize: "15px", lineHeight: 1.6 }}>
                    {modeDescription}
                  </p>
                ) : null}

                <div style={{ display: hasMode ? "none" : "grid", gap: "10px" }}>
                  {modeDetails.map((detail) => (
                    <span key={detail} style={{ display: "flex", alignItems: "center", gap: "9px", color: tokens.textMuted, fontSize: "13px" }}>
                      <CheckIcon size={14} color={tokens.copper} />
                      {detail}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </section>

        {hasMode ? (
          <section
            className="pedido-shell"
            style={{
              display: "grid",
              gridTemplateColumns: currentStep === "resumo" ? "1fr" : "minmax(0, 7fr) minmax(320px, 3fr)",
              gap: "24px",
              alignItems: "flex-start",
              animation: "pedidoAppear 0.32s ease both"
            }}
          >
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "22px" }}>
              {currentStep === "montagem" ? (
                <>
              {selectedMode === "subscription" ? (
                <div style={{ ...cardSurface, padding: "22px", borderRadius: "20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <h2 style={{ margin: "0 0 6px", fontSize: "24px", color: tokens.text }}>{strings.plans.title}</h2>
                    <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.5 }}>{strings.plans.subtitle}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" }}>
                    {catalogSubscriptionPlansMock.map((plan) => {
                      const isPlanActive = selectedPlanKey === plan.key;
                      return (
                        <button
                          className="pedido-plan-card"
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlanKey(plan.key);
                            setSelectedProductQuantities({});
                          }}
                          style={{
                            border: `1px solid ${isPlanActive ? tokens.copper : tokens.border}`,
                            borderRadius: "16px",
                            background: isPlanActive ? (isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.1)") : "transparent",
                            color: tokens.text,
                            padding: "18px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <strong style={{ display: "block", fontSize: "20px" }}>{plan.name}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div style={{ ...cardSurface, padding: "24px", borderRadius: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "18px" }}>
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: "26px", color: tokens.text }}>{strings.catalog.title}</h2>
                    <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.5 }}>{strings.catalog.subtitle}</p>
                  </div>
                  <div
                    className="pedido-toolbar"
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 152px",
                      gap: "12px",
                      alignItems: "center"
                    }}
                  >
                    <Input
                      icon="search"
                      isDark={isDark}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={strings.hero.searchPlaceholder}
                      style={{ height: "48px", borderRadius: "14px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setFilterModalOpen(true)}
                      aria-label={strings.hero.filterLabel}
                      style={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "14px",
                        border: `1px solid ${selectedCategoryId !== "all" ? tokens.copper : tokens.border}`,
                        background: selectedCategoryId !== "all" ? (isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)") : tokens.background,
                        color: selectedCategoryId !== "all" ? tokens.copper : tokens.text,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: "13px"
                      }}
                    >
                      <SettingsIcon size={19} />
                      {strings.hero.filterLabel}
                    </button>
                  </div>
                </div>

                {selectedCategoryId !== "all" || query ? (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                    <span style={{ color: tokens.textMuted, fontSize: "13px" }}>
                      {availableProducts.length} {strings.catalog.foundLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId("all");
                        setQuery("");
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: tokens.copper,
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                    >
                      {strings.hero.clearFilters}
                    </button>
                  </div>
                ) : null}

                {availableProducts.length ? (
                  <div className="pedido-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                    {availableProducts.map((product) => {
                      const category = categoryById.get(product.categoryId);
                      const selectedQuantity = selectedProductQuantities[product.id] || 0;
                      const isSelected = selectedQuantity > 0;
                      const price = product.price;
                      return (
                        <ProductItemCard
                          key={product.id}
                          name={product.name}
                          description={product.description}
                          image={product.image}
                          categoryLabel={category?.name || strings.productCard.categoryLabel}
                          detailLabel={product.weightLabel || product.unit}
                          price={price}
                          priceLabel={strings.productCard.fromLabel}
                          selected={isSelected}
                          quantity={selectedQuantity}
                          quantitySuffix={strings.productCard.quantitySuffix}
                          showPrice={selectedMode !== "subscription"}
                          showAction={true}
                          actionLabel={strings.productCard.add}
                          selectedActionLabel={strings.productCard.add}
                          onAction={() => handleProductSelect(product)}
                          onDecrease={() => handleProductRemove(product.id)}
                          isDark={isDark}
                          tokens={tokens}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ border: `1px dashed ${tokens.border}`, borderRadius: "16px", padding: "32px", textAlign: "center" }}>
                    <CutMeatIcon size={28} color={tokens.copper} />
                    <h3 style={{ margin: "12px 0 6px", color: tokens.text }}>{strings.catalog.emptyTitle}</h3>
                    <p style={{ margin: 0, color: tokens.textMuted }}>{strings.catalog.emptyDescription}</p>
                  </div>
                )}
              </div>
                </>
              ) : currentStep === "entrega" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "pedidoAppear 0.32s ease both" }}>
                  <div style={{ ...cardSurface, padding: "18px", borderRadius: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
                      {[
                        { key: "montagem" as const, label: strings.steps.montagem },
                        { key: "entrega" as const, label: strings.steps.entrega },
                        { key: "pagamento" as const, label: strings.steps.pagamento },
                        { key: "resumo" as const, label: strings.steps.resumo }
                      ].map((step, index) => {
                        const currentIndex = stepOrder.indexOf(currentStep);
                        const isDone = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        return (
                          <div
                            key={step.label}
                            style={{
                              border: `1px solid ${isCurrent ? tokens.copper : tokens.border}`,
                              borderRadius: "14px",
                              padding: "12px",
                              background: isDone
                                ? isDark ? "rgba(184, 115, 51, 0.13)" : "rgba(184, 115, 51, 0.09)"
                                : isCurrent
                                  ? isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.65)"
                                  : "transparent",
                              color: isCurrent ? tokens.text : tokens.textMuted
                            }}
                          >
                            <span style={{ display: "block", color: isDone || isCurrent ? tokens.copper : tokens.textMuted, fontSize: "11px", fontWeight: 900, marginBottom: "5px" }}>
                              {isDone ? "OK" : `0${index + 1}`}
                            </span>
                            <strong style={{ fontSize: "13px" }}>{step.label}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ ...cardSurface, padding: "26px", borderRadius: "20px" }}>
                    <p style={{ margin: "0 0 8px", color: tokens.copper, fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {strings.deliveryStep.badge}
                    </p>
                    <h2 style={{ margin: "0 0 10px", color: tokens.text, fontSize: "30px", fontFamily: "'Playfair Display', serif" }}>
                      {strings.deliveryStep.title}
                    </h2>
                    <p style={{ margin: "0 0 22px", color: tokens.textMuted, lineHeight: 1.55, maxWidth: "720px" }}>
                      {deliveryCopy?.description || strings.deliveryStep.description}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
                      {(deliveryCopy?.fields || []).map((field) => (
                        <div
                          key={field}
                          style={{
                            border: `1px solid ${tokens.border}`,
                            borderRadius: "14px",
                            padding: "14px",
                            color: tokens.text,
                            background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)"
                          }}
                        >
                          <CheckIcon size={16} color={tokens.copper} />
                          <span style={{ display: "block", marginTop: "9px", fontWeight: 800 }}>{field}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                          {strings.deliveryStep.common.addressTitle}
                        </label>
                        <div
                          style={{
                            border: `1px solid ${tokens.copper}`,
                            borderRadius: "16px",
                            padding: "16px",
                            color: tokens.text,
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            gap: "14px",
                            alignItems: "center",
                            background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.07)",
                            boxShadow: isDark ? "0 14px 32px rgba(0, 0, 0, 0.18)" : "0 14px 32px rgba(184, 115, 51, 0.08)"
                          }}
                        >
                          <span
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "14px",
                              display: "grid",
                              placeItems: "center",
                              background: isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.1)",
                              color: tokens.copper
                            }}
                          >
                            <StoreIcon size={22} />
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <strong>{strings.deliveryStep.common.addressLabel}</strong>
                            <p style={{ margin: "6px 0 0", color: tokens.textMuted }}>{strings.deliveryStep.common.addressValue}</p>
                            <p style={{ margin: "6px 0 0", color: tokens.textMuted, fontSize: "13px", lineHeight: 1.4 }}>
                              {strings.deliveryStep.common.addressHint}
                            </p>
                          </div>
                          <button
                            type="button"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              border: `1px solid ${tokens.border}`,
                              background: "transparent",
                              color: tokens.textMuted,
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer"
                            }}
                            aria-label={strings.deliveryStep.common.removeAddress}
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(true)}
                          style={{
                            marginTop: "10px",
                            minHeight: "34px",
                            borderRadius: "999px",
                            border: "none",
                            background: "transparent",
                            color: tokens.copper,
                            fontWeight: 900,
                            cursor: "pointer",
                            padding: "0",
                            fontSize: "13px"
                          }}
                        >
                          {strings.deliveryStep.common.addAddress}
                        </button>
                        {isAddingAddress ? (
                          <div
                            style={{
                              marginTop: "12px",
                              border: `1px solid ${tokens.border}`,
                              borderRadius: "16px",
                              padding: "16px",
                              background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.64)"
                            }}
                          >
                            <h3 style={{ margin: "0 0 14px", color: tokens.text, fontSize: "18px" }}>
                              {strings.deliveryStep.common.newAddressTitle}
                            </h3>
                            <div
                              className="pedido-address-form"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                                gap: "12px"
                              }}
                            >
                              {newAddressFields.map((field) => (
                                <label
                                  className="pedido-address-field"
                                  key={field.label}
                                  style={{
                                    display: "grid",
                                    gridColumn: field.gridColumn,
                                    gap: "7px",
                                    minWidth: 0,
                                    color: tokens.textMuted,
                                    fontSize: "12px",
                                    fontWeight: 900,
                                    textTransform: "uppercase"
                                  }}
                                >
                                  {field.label}
                                  <input
                                    placeholder={field.placeholder}
                                    style={{
                                      width: "100%",
                                      minHeight: "46px",
                                      border: `1px solid ${tokens.border}`,
                                      borderRadius: "12px",
                                      background: isDark ? "rgba(0, 0, 0, 0.24)" : tokens.background,
                                      color: tokens.text,
                                      padding: "0 12px",
                                      fontFamily: "'Inter', sans-serif",
                                      outline: "none",
                                      boxSizing: "border-box",
                                      minWidth: 0
                                    }}
                                  />
                                </label>
                              ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                              <Button variant="outline" isDark={isDark} onClick={() => setIsAddingAddress(false)}>
                                {strings.deliveryStep.common.cancelAddress}
                              </Button>
                              <Button variant="primary" isDark={isDark} onClick={() => setIsAddingAddress(false)}>
                                {strings.deliveryStep.common.saveAddress}
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {selectedMode === "royalBox" ? (
                        <div>
                          <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                            {strings.deliveryStep.royalBox.deliveryDayLabel}
                          </label>
                          <p style={{ margin: "0 0 10px", color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                            {strings.deliveryStep.royalBox.deliveryDayHint}
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))", gap: "10px" }}>
                            {[5, 10, 15, 20, 25].map((day) => (
                              (() => {
                                const isActive = selectedDeliveryDay === day;
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => setSelectedDeliveryDay(day)}
                                    style={{
                                      minHeight: "72px",
                                      border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                                      borderRadius: "14px",
                                      background: isActive
                                        ? isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)"
                                        : isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)",
                                      color: isActive ? tokens.copper : tokens.text,
                                      fontWeight: 900,
                                      cursor: "pointer",
                                      display: "grid",
                                      gap: "4px",
                                      alignContent: "center",
                                      textAlign: "left",
                                      padding: "12px 14px"
                                    }}
                                  >
                                    <span style={{ color: isActive ? tokens.copper : tokens.textMuted, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                      {strings.deliveryStep.royalBox.deliveryDayPrefix}
                                    </span>
                                    <span style={{ fontSize: "22px", lineHeight: 1 }}>{day}</span>
                                  </button>
                                );
                              })()
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div>
                        <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                          {strings.deliveryStep.royalDelivery.freightLabel}
                        </label>
                        {selectedMode === "royalDelivery" ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "10px" }}>
                            {freightOptions.map((freight) => {
                              const isActive = selectedFreight === freight.key;
                              return (
                              <button
                                key={freight.key}
                                type="button"
                                onClick={() => setSelectedFreight(freight.key)}
                                style={{
                                  border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                                  borderRadius: "14px",
                                  padding: "13px",
                                  background: isActive ? isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)" : "transparent",
                                  color: isActive ? tokens.copper : tokens.text,
                                  fontWeight: 900,
                                  cursor: "pointer",
                                  display: "grid",
                                  gap: "5px",
                                  textAlign: "left"
                                }}
                              >
                                <span>{freight.label}</span>
                                <span style={{ color: isActive ? tokens.copper : tokens.textMuted, fontSize: "12px" }}>
                                  {formatMoney(freight.price)}
                                </span>
                                <span style={{ color: tokens.textMuted, fontSize: "11px", fontWeight: 700 }}>
                                  {freight.etaLabel}
                                </span>
                              </button>
                            );
                            })}
                          </div>
                        ) : null}
                        <div
                          style={{
                            border: `1px solid ${tokens.border}`,
                            borderRadius: "14px",
                            padding: "14px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            alignItems: "center",
                            background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)"
                          }}
                        >
                          <strong style={{ color: tokens.text }}>
                            {selectedMode === "royalDelivery" && !selectedFreight
                              ? strings.deliveryStep.royalDelivery.pendingFreight
                              : selectedMode === "royalDelivery"
                                ? strings.deliveryStep.royalDelivery.calculatedFreight
                                : strings.deliveryStep.royalDelivery.includedFreight}
                          </strong>
                          <span style={{ color: tokens.copper, fontWeight: 900 }}>
                            {selectedMode === "royalDelivery" && !selectedFreight
                              ? strings.summary.freightNotSelected
                              : formatMoney(currentFreightPrice)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                          {strings.deliveryStep.common.notesTitle}
                        </label>
                        <textarea
                          placeholder={strings.deliveryStep.common.notesPlaceholder}
                          rows={4}
                          style={{
                            width: "100%",
                            resize: "vertical",
                            border: `1px solid ${tokens.border}`,
                            borderRadius: "14px",
                            background: tokens.background,
                            color: tokens.text,
                            padding: "14px",
                            fontFamily: "'Inter', sans-serif",
                            boxSizing: "border-box",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
                      <Button variant="outline" isDark={isDark} onClick={() => setCurrentStep("montagem")}>
                        {strings.deliveryStep.back}
                      </Button>
                      <Button variant="primary" isDark={isDark} onClick={() => requestProtectedStep("pagamento")}>
                        {strings.deliveryStep.next}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : currentStep === "pagamento" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "pedidoAppear 0.32s ease both" }}>
                  <div style={{ ...cardSurface, padding: "18px", borderRadius: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
                      {[
                        { key: "montagem" as const, label: strings.steps.montagem },
                        { key: "entrega" as const, label: strings.steps.entrega },
                        { key: "pagamento" as const, label: strings.steps.pagamento },
                        { key: "resumo" as const, label: strings.steps.resumo }
                      ].map((step, index) => {
                        const currentIndex = stepOrder.indexOf(currentStep);
                        const isDone = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        return (
                          <div
                            key={step.label}
                            style={{
                              border: `1px solid ${isCurrent ? tokens.copper : tokens.border}`,
                              borderRadius: "14px",
                              padding: "12px",
                              background: isDone
                                ? isDark ? "rgba(184, 115, 51, 0.13)" : "rgba(184, 115, 51, 0.09)"
                                : isCurrent
                                  ? isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.65)"
                                  : "transparent",
                              color: isCurrent ? tokens.text : tokens.textMuted
                            }}
                          >
                            <span style={{ display: "block", color: isDone || isCurrent ? tokens.copper : tokens.textMuted, fontSize: "11px", fontWeight: 900, marginBottom: "5px" }}>
                              {isDone ? "OK" : `0${index + 1}`}
                            </span>
                            <strong style={{ fontSize: "13px" }}>{step.label}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ ...cardSurface, padding: "26px", borderRadius: "20px" }}>
                    <p style={{ margin: "0 0 8px", color: tokens.copper, fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {paymentCopy.badge}
                    </p>
                    <h2 style={{ margin: "0 0 10px", color: tokens.text, fontSize: "30px", fontFamily: "'Playfair Display', serif" }}>
                      {paymentCopy.title}
                    </h2>
                    <p style={{ margin: "0 0 22px", color: tokens.textMuted, lineHeight: 1.55, maxWidth: "720px" }}>
                      {paymentCopy.description}
                    </p>

                    <div className="pedido-payment-grid" style={{ display: "grid", gap: "18px", alignItems: "flex-start" }}>
                      <div style={{ display: "grid", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                            {paymentCopy.methodsTitle}
                          </label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" }}>
                            {paymentMethods.map((method) => {
                              const isActive = selectedPaymentMethod === method.key;
                              return (
                                <button
                                  key={method.key}
                                  type="button"
                                  onClick={() => setSelectedPaymentMethod(method.key)}
                                  style={{
                                    border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                                    borderRadius: "18px",
                                    minHeight: "188px",
                                    padding: "20px",
                                    background: isActive
                                      ? isDark
                                        ? "linear-gradient(145deg, rgba(184, 115, 51, 0.2), rgba(255, 255, 255, 0.035))"
                                        : "linear-gradient(145deg, rgba(184, 115, 51, 0.13), rgba(255, 255, 255, 0.84))"
                                      : isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)",
                                    color: tokens.text,
                                    cursor: "pointer",
                                    display: "grid",
                                    justifyItems: "center",
                                    alignContent: "center",
                                    gap: "12px",
                                    textAlign: "center",
                                    boxShadow: isActive
                                      ? isDark ? "0 18px 38px rgba(0, 0, 0, 0.22)" : "0 18px 38px rgba(184, 115, 51, 0.12)"
                                      : "none",
                                    transition: "all 0.22s ease"
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "54px",
                                      height: "54px",
                                      borderRadius: "18px",
                                      display: "grid",
                                      placeItems: "center",
                                      color: isActive ? "#FCFBF7" : tokens.copper,
                                      background: isActive ? tokens.copper : isDark ? "rgba(184, 115, 51, 0.12)" : "rgba(184, 115, 51, 0.1)",
                                      marginBottom: "2px"
                                    }}
                                  >
                                    <CreditCardIcon size={24} />
                                  </span>
                                  <span style={{ minWidth: 0, display: "grid", gap: "7px" }}>
                                    <strong style={{ display: "block", color: isActive ? tokens.copper : tokens.text, fontSize: "17px", lineHeight: 1.15 }}>
                                      {method.label}
                                    </strong>
                                    <span style={{ display: "block", color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                                      {method.description}
                                    </span>
                                  </span>
                                  {isActive ? (
                                    <span
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "999px",
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#FCFBF7",
                                        background: tokens.copper
                                      }}
                                    >
                                      <CheckIcon size={15} />
                                    </span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {selectedPaymentMethod === "creditCard" ? (
                          <div>
                            <label style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                              {paymentCopy.installmentsTitle}
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                              {paymentInstallmentsMock.map((installment) => {
                                const isActive = selectedInstallments === installment;
                                return (
                                  <button
                                    key={installment}
                                    type="button"
                                    onClick={() => setSelectedInstallments(installment)}
                                    style={{
                                      minHeight: "58px",
                                      border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                                      borderRadius: "14px",
                                      background: isActive ? isDark ? "rgba(184, 115, 51, 0.16)" : "rgba(184, 115, 51, 0.1)" : "transparent",
                                      color: isActive ? tokens.copper : tokens.text,
                                      fontWeight: 900,
                                      cursor: "pointer"
                                    }}
                                  >
                                    <span style={{ display: "block", fontSize: "15px" }}>
                                      {installment}{paymentCopy.installmentsSuffix}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        {selectedMode === "subscription" || selectedMode === "royalBox" ? (
                          <div
                            style={{
                              border: `1px solid ${tokens.border}`,
                              borderRadius: "16px",
                              padding: "15px",
                              background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)"
                            }}
                          >
                            <strong style={{ display: "block", color: tokens.text, marginBottom: "6px" }}>
                              {paymentCopy.recurrenceTitle}
                            </strong>
                            <p style={{ margin: 0, color: tokens.textMuted, fontSize: "13px", lineHeight: 1.5 }}>
                              {paymentCopy.recurrenceDescription}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
                      <Button variant="outline" isDark={isDark} onClick={() => setCurrentStep("entrega")}>
                        {paymentCopy.back}
                      </Button>
                      <Button variant="primary" isDark={isDark} onClick={() => requestProtectedStep("resumo")}>
                        {paymentCopy.next}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "pedidoAppear 0.32s ease both" }}>
                  <div style={{ ...cardSurface, padding: "18px", borderRadius: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
                      {[
                        { key: "montagem" as const, label: strings.steps.montagem },
                        { key: "entrega" as const, label: strings.steps.entrega },
                        { key: "pagamento" as const, label: strings.steps.pagamento },
                        { key: "resumo" as const, label: strings.steps.resumo }
                      ].map((step, index) => {
                        const currentIndex = stepOrder.indexOf(currentStep);
                        const isDone = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        return (
                          <div
                            key={step.label}
                            style={{
                              border: `1px solid ${isCurrent ? tokens.copper : tokens.border}`,
                              borderRadius: "14px",
                              padding: "12px",
                              background: isDone
                                ? isDark ? "rgba(184, 115, 51, 0.13)" : "rgba(184, 115, 51, 0.09)"
                                : isCurrent
                                  ? isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.65)"
                                  : "transparent",
                              color: isCurrent ? tokens.text : tokens.textMuted
                            }}
                          >
                            <span style={{ display: "block", color: isDone || isCurrent ? tokens.copper : tokens.textMuted, fontSize: "11px", fontWeight: 900, marginBottom: "5px" }}>
                              {isDone ? "OK" : `0${index + 1}`}
                            </span>
                            <strong style={{ fontSize: "13px" }}>{step.label}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ ...cardSurface, padding: "28px", borderRadius: "22px" }}>
                    <p style={{ margin: "0 0 8px", color: tokens.copper, fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {reviewCopy.badge}
                    </p>
                    <h2 style={{ margin: "0 0 10px", color: tokens.text, fontSize: "34px", fontFamily: "'Playfair Display', serif" }}>
                      {reviewCopy.title}
                    </h2>
                    <p style={{ margin: "0 0 24px", color: tokens.textMuted, lineHeight: 1.55, maxWidth: "760px" }}>
                      {reviewCopy.description}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "18px" }}>
                      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "18px", padding: "18px", background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)", display: "grid", gap: "12px" }}>
                        <h3 style={{ margin: 0, color: tokens.text, fontSize: "18px" }}>{reviewCopy.orderTitle}</h3>
                        <SummaryRow label={strings.summary.selectedMode} value={strings.modes[selectedMode].title} muted={tokens.textMuted} text={tokens.text} />
                        {selectedMode === "subscription" ? (
                          <SummaryRow label={strings.summary.selectedPlan} value={selectedPlan.name} muted={tokens.textMuted} text={tokens.text} />
                        ) : null}
                        <SummaryRow
                          label={selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
                          value={String(selectedUnitsCount)}
                          muted={tokens.textMuted}
                          text={tokens.text}
                        />
                      </div>

                      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "18px", padding: "18px", background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)", display: "grid", gap: "12px" }}>
                        <h3 style={{ margin: 0, color: tokens.text, fontSize: "18px" }}>{reviewCopy.deliveryTitle}</h3>
                        <SummaryRow label={strings.summary.deliveryAddress} value={strings.deliveryStep.common.addressValue} muted={tokens.textMuted} text={tokens.text} />
                        {selectedMode === "royalBox" ? (
                          <SummaryRow
                            label={strings.summary.recurrenceDay}
                            value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
                            muted={tokens.textMuted}
                            text={tokens.text}
                          />
                        ) : null}
                        <SummaryRow
                          label={strings.summary.selectedFreight}
                        value={
                          selectedMode === "royalDelivery" && currentFreightOption
                            ? `${currentFreightOption.label} - ${formatMoney(currentFreightPrice)}`
                            : selectedMode === "royalDelivery"
                              ? strings.summary.freightNotSelected
                              : strings.deliveryStep.royalDelivery.includedFreight
                        }
                          muted={tokens.textMuted}
                          text={tokens.text}
                        />
                      </div>

                      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "18px", padding: "18px", background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)", display: "grid", gap: "12px" }}>
                        <h3 style={{ margin: 0, color: tokens.text, fontSize: "18px" }}>{reviewCopy.paymentTitle}</h3>
                        <SummaryRow label={strings.summary.selectedPayment} value={selectedPayment?.label || paymentCopy.methods.creditCard} muted={tokens.textMuted} text={tokens.text} />
                        {selectedPaymentMethod === "creditCard" ? (
                          <SummaryRow
                            label={paymentCopy.installmentsTitle}
                            value={`${selectedInstallments}${paymentCopy.installmentsSuffix}`}
                            muted={tokens.textMuted}
                            text={tokens.text}
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="pedido-review-total-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.6fr)", gap: "16px", alignItems: "stretch" }}>
                      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "18px", padding: "18px", background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.62)" }}>
                        <h3 style={{ margin: "0 0 14px", color: tokens.text, fontSize: "18px" }}>{reviewCopy.itemsTitle}</h3>
                        {selectedProductEntries.length ? (
                          <div style={{ display: "grid", gap: "10px" }}>
                            {selectedProductEntries.map(({ product, quantity }) => (
                              <div key={product.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center", color: tokens.textMuted, fontSize: "14px" }}>
                                <span>{quantity}x {product.name}</span>
                                {selectedMode === "subscription" ? (
                                  <span>{categoryById.get(product.categoryId)?.name || strings.productCard.categoryLabel}</span>
                                ) : (
                                  <span>{formatMoney(product.price * quantity)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.5 }}>{reviewCopy.emptyItems}</p>
                        )}
                      </div>

                      <div style={{ border: `1px solid ${tokens.copper}`, borderRadius: "18px", padding: "18px", background: isDark ? "rgba(184, 115, 51, 0.12)" : "rgba(184, 115, 51, 0.08)", display: "grid", gap: "14px" }}>
                        <span style={{ color: tokens.textMuted, fontSize: "12px", fontWeight: 900, textTransform: "uppercase" }}>
                          {reviewCopy.totalTitle}
                        </span>
                        <strong style={{ color: tokens.text, fontSize: "34px" }}>{formatMoney(finalTotal)}</strong>
                        <p style={{ margin: 0, color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                          {selectedMode === "subscription" ? reviewCopy.fixedPlanHint : reviewCopy.variableOrderHint}
                        </p>
                        {selectedMode === "subscription" ? (
                          <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "12px", display: "grid", gap: "10px" }}>
                            <h3 style={{ margin: 0, color: tokens.text, fontSize: "15px" }}>{reviewCopy.limitsTitle}</h3>
                            <SummaryRow label={strings.summary.meatUsage} value={`${formatMeasure(selectedProteinKg, "kg")}/${formatMeasure(selectedPlan.proteinKgLimit, "kg")}`} muted={tokens.textMuted} text={tokens.text} />
                            <SummaryRow label={strings.summary.charcoalUsage} value={`${formatMeasure(selectedCharcoalKg, "kg")}/${formatMeasure(selectedPlan.charcoalKgLimit, "kg")}`} muted={tokens.textMuted} text={tokens.text} />
                            <SummaryRow label={strings.summary.seasoningUsage} value={`${selectedSeasoningCount}/${selectedPlan.seasoningSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
                            <SummaryRow label={strings.summary.sideUsage} value={`${selectedSideCount}/${selectedPlan.sideSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
                            <SummaryRow label={strings.summary.utensilUsage} value={`${selectedUtensilCount}/${selectedPlan.utensilSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
                      <Button variant="outline" isDark={isDark} onClick={() => setCurrentStep("pagamento")}>
                        {reviewCopy.back}
                      </Button>
                      <Button variant="primary" isDark={isDark}>
                        {reviewCopy.finish}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentStep !== "resumo" ? (
            <aside
              className="pedido-summary"
              style={{
                ...cardSurface,
                position: "sticky",
                top: "104px",
                alignSelf: "flex-start",
                height: "fit-content",
                maxHeight: "calc(100vh - 128px)",
                overflowY: "auto",
                padding: "22px",
                minWidth: 0
              }}
            >
              <h2 style={{ margin: "0 0 16px", color: tokens.text, fontSize: "24px" }}>{strings.summary.title}</h2>
              {selectedMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <SummaryRow
                    label={strings.summary.selectedMode}
                    value={selectedMode === "subscription" && activeSubscription ? strings.summary.activeSubscriptionMode : strings.modes[selectedMode].title}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                  {selectedMode === "subscription" ? (
                    <SummaryRow
                      label={activeSubscription ? strings.summary.linkedPlan : strings.summary.selectedPlan}
                      value={activeSubscriptionLabel || selectedPlan.name}
                      muted={tokens.textMuted}
                      text={tokens.text}
                    />
                  ) : null}
                  <SummaryRow
                    label={subscriptionSummaryUsage ? strings.summary.cycleCuts : selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
                    value={subscriptionSummaryUsage ? `${subscriptionSummaryUsage.cutsUsed} / ${subscriptionSummaryUsage.cutsLimit}` : String(selectedUnitsCount)}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />

                  {currentStep !== "montagem" ? (
                    <div
                      style={{
                        border: `1px solid ${tokens.border}`,
                        borderRadius: "14px",
                        padding: "14px",
                        display: "grid",
                        gap: "10px",
                        background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.58)"
                      }}
                    >
                      <SummaryRow
                        label={strings.summary.deliveryAddress}
                        value={strings.deliveryStep.common.addressValue}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      {selectedMode === "royalBox" ? (
                        <SummaryRow
                          label={strings.summary.recurrenceDay}
                          value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
                          muted={tokens.textMuted}
                          text={tokens.text}
                        />
                      ) : null}
                      <SummaryRow
                        label={strings.summary.selectedFreight}
                        value={
                          selectedMode === "royalDelivery" && currentFreightOption
                            ? `${currentFreightOption.label} - ${formatMoney(currentFreightPrice)}`
                            : selectedMode === "royalDelivery"
                              ? strings.summary.freightNotSelected
                              : strings.deliveryStep.royalDelivery.includedFreight
                        }
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      {currentStep === "pagamento" ? (
                        <SummaryRow
                          label={strings.summary.selectedPayment}
                          value={selectedPayment?.label || paymentCopy.methods.creditCard}
                          muted={tokens.textMuted}
                          text={tokens.text}
                        />
                      ) : null}
                    </div>
                  ) : null}

                  {selectedMode === "subscription" ? (
                    <div
                      style={{
                        border: `1px solid ${tokens.border}`,
                        borderRadius: "14px",
                        padding: "14px",
                        display: "grid",
                        gap: "10px"
                      }}
                    >
                      <SummaryRow
                        label={strings.summary.meatUsage}
                        value={subscriptionSummaryUsage
                          ? `${formatMeasure(subscriptionSummaryUsage.weightKgUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.weightKgLimit, "kg")}`
                          : `${formatMeasure(selectedProteinKg, "kg")}/${formatMeasure(selectedPlan.proteinKgLimit, "kg")}`}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      <SummaryRow
                        label={strings.summary.charcoalUsage}
                        value={subscriptionSummaryUsage
                          ? `${formatMeasure(subscriptionSummaryUsage.charcoalKgUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.charcoalKgLimit, "kg")}`
                          : `${formatMeasure(selectedCharcoalKg, "kg")}/${formatMeasure(selectedPlan.charcoalKgLimit, "kg")}`}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      <SummaryRow
                        label={strings.summary.seasoningUsage}
                        value={subscriptionSummaryUsage
                          ? `${subscriptionSummaryUsage.seasoningsUsed}/${subscriptionSummaryUsage.seasoningsLimit}`
                          : `${selectedSeasoningCount}/${selectedPlan.seasoningSelectionLimit}`}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      <SummaryRow
                        label={strings.summary.sideUsage}
                        value={subscriptionSummaryUsage
                          ? `${subscriptionSummaryUsage.sidesUsed}/${subscriptionSummaryUsage.sidesLimit}`
                          : `${selectedSideCount}/${selectedPlan.sideSelectionLimit}`}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                      <SummaryRow
                        label={strings.summary.utensilUsage}
                        value={subscriptionSummaryUsage
                          ? `${subscriptionSummaryUsage.utensilsUsed}/${subscriptionSummaryUsage.utensilsLimit}`
                          : `${selectedUtensilCount}/${selectedPlan.utensilSelectionLimit}`}
                        muted={tokens.textMuted}
                        text={tokens.text}
                      />
                    </div>
                  ) : null}

                  {selectedProductEntries.length ? (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {selectedProductEntries.slice(0, 5).map(({ product, quantity }) => (
                        <div key={product.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", color: tokens.textMuted, fontSize: "13px", alignItems: "center" }}>
                          <span>{quantity}x {product.name}</span>
                          {selectedMode === "subscription" ? (
                            <button
                              type="button"
                              onClick={() => handleProductRemove(product.id)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: tokens.copper,
                                fontWeight: 800,
                                cursor: "pointer"
                              }}
                            >
                              {strings.summary.remove}
                            </button>
                          ) : (
                            <span>{formatMoney(product.price * quantity)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.5 }}>{strings.summary.placeholder}</p>
                  )}

                  {selectedMode === "subscription" ? (
                    <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "16px" }}>
                      <span style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "5px" }}>
                        {activeSubscription ? strings.summary.activeSubscriptionLabel : strings.summary.fixedPlanPrice}
                      </span>
                      <strong style={{ color: tokens.text, fontSize: "28px" }}>
                        {activeSubscriptionLabel || formatMoney(selectedPlan.monthlyPrice)}
                      </strong>
                      <p style={{ margin: "8px 0 0", color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                        {activeSubscription
                          ? `${strings.summary.subscriptionRenewPrefix} ${activeSubscription.nextBillingLabel}. ${strings.summary.activeSubscriptionHintSuffix}`
                          : strings.summary.noVariableEstimate}
                      </p>
                    </div>
                  ) : (
                    <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "16px" }}>
                      <span style={{ display: "block", color: tokens.textMuted, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", marginBottom: "5px" }}>
                        {strings.summary.variableEstimate}
                      </span>
                      <strong style={{ color: tokens.text, fontSize: "28px" }}>{formatMoney(orderEstimateTotal)}</strong>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    isDark={isDark}
                    fullWidth
                    onClick={() => {
                      if (currentStep === "montagem") {
                        requestProtectedStep("entrega");
                        return;
                      }
                      if (currentStep === "entrega") {
                        requestProtectedStep("pagamento");
                        return;
                      }
                      if (currentStep === "pagamento") {
                        requestProtectedStep("resumo");
                      }
                    }}
                  >
                    {currentStep === "montagem"
                      ? strings.summary.nextStep
                      : currentStep === "entrega"
                        ? strings.summary.paymentNextStep
                        : strings.summary.finishStep}
                  </Button>
                </div>
              ) : (
                <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.55 }}>{strings.summary.empty}</p>
              )}
            </aside>
            ) : null}
          </section>
        ) : null}
      </main>

      <BottomTabBar activeTab="produtos" onNavigate={onNavigate} isDark={isDark} />
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingStepAfterAuth(null);
        }}
        onAuthenticated={handleAuthenticatedCheckout}
        isDark={isDark}
        context="portal"
      />

      {filterModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: isDark ? "rgba(0, 0, 0, 0.62)" : "rgba(26, 26, 26, 0.28)",
            display: "grid",
            placeItems: "center",
            padding: "20px"
          }}
          onClick={() => setFilterModalOpen(false)}
        >
          <div
            style={{ ...cardSurface, width: "min(520px, 100%)", padding: "24px" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 18px", color: tokens.text, fontSize: "24px" }}>{strings.filters.modalTitle}</h2>
            <p style={{ margin: "0 0 12px", color: tokens.textMuted, fontWeight: 800 }}>{strings.filters.categoryTitle}</p>
            <div style={{ display: "grid", gap: "8px", maxHeight: "360px", overflow: "auto", paddingRight: "4px" }}>
              {[{ id: "all", name: strings.filters.allCategories }, ...productCategoriesMock].map((category) => {
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    style={{
                      border: `1px solid ${active ? tokens.copper : tokens.border}`,
                      borderRadius: "12px",
                      background: active ? (isDark ? "rgba(184, 115, 51, 0.15)" : "rgba(184, 115, 51, 0.1)") : "transparent",
                      color: active ? tokens.text : tokens.textMuted,
                      padding: "12px 14px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: active ? 800 : 600
                    }}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <Button variant="outline" isDark={isDark} onClick={() => setFilterModalOpen(false)}>
                {strings.filters.close}
              </Button>
              <Button variant="primary" isDark={isDark} onClick={() => setFilterModalOpen(false)}>
                {strings.filters.apply}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; muted: string; text: string }> = ({
  label,
  value,
  muted,
  text
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
    <span style={{ color: muted, fontSize: "13px" }}>{label}</span>
    <strong style={{ color: text, textAlign: "right" }}>{value}</strong>
  </div>
);
