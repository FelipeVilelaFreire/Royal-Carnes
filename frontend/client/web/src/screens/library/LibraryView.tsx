"use client";

import React, { useMemo, useState } from "react";
import { Badge, Card } from "../../legacy/design-system";
import { PlanBenefitCard, ProductItemCard, planBenefitCardManifest, productItemCardManifest } from "../../product-components/ecommerce";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { clientPtBR } from "@/locales/pt-BR";
import { libraryCandidatesMock } from "@/mocks/library.mock";
import { catalogSubscriptionPlansMock, productCategoriesMock, productsMock } from "@/mocks/catalog";
import { paymentInstallmentsMock, paymentMethodsMock } from "@/mocks/payment.mock";

export interface LibraryViewProps {
  onNavigate?: (path: string) => void;
}

const statusLabelMap = {
  active: clientPtBR.library.labels.active,
  future: clientPtBR.library.labels.future,
  mapped: clientPtBR.library.labels.mapped,
  "needs-manifest": clientPtBR.library.labels.needsManifest,
  "needs-contract": clientPtBR.library.labels.needsContract
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

type ProductItemCardRuntimeConfig = {
  compositionId: string;
  productIndex: number;
  badgeMode: "none" | "component" | "category" | "offer" | "stock" | "custom";
  badgeTone: "offer" | "limited";
  metaMode: "category-detail" | "category-only" | "detail-only";
  priceMode: "unit" | "from" | "estimate" | "included" | "hidden";
  actionMode: "none" | "select" | "add" | "quantity" | "view-details" | "configure";
  favoriteMode: "none" | "toggle";
  quantityMode: "none" | "stepper" | "readonly";
  selectionMode: "none" | "single" | "multi";
  showImage: boolean;
  showName: boolean;
  showDescription: boolean;
  showMeta: boolean;
  showBadge: boolean;
  showFavorite: boolean;
  showOriginalPrice: boolean;
  favorite: boolean;
  quantity: number;
  selected: boolean;
  showPrice: boolean;
  showAction: boolean;
  originalPrice?: number;
};

type ProductPreviewState = Record<string, {
  quantity: number;
  favorite: boolean;
}>;

type PlanBenefitCardRuntimeConfig = {
  compositionId: string;
  showName: boolean;
  showDescription: boolean;
  showPrice: boolean;
  showBillingCycle: boolean;
  showBenefits: boolean;
  showSavings: boolean;
  showBadge: boolean;
  showAction: boolean;
  showSelectedState: boolean;
  showHighlight: boolean;
  priceMode: "monthly" | "annual" | "included" | "hidden";
  benefitsMode: "summary" | "list" | "count" | "hidden";
  promotionMode: "none" | "annual-savings" | "limited-offer" | "recommended";
  actionMode: "none" | "select" | "upgrade" | "manage" | "view-details";
  layoutMode: "compact" | "standard" | "comparison";
  selected: boolean;
  disabled: boolean;
};

type ManifestPanelOption = {
  key: string;
  control: string;
  values?: readonly string[];
  owner: string;
};

const productItemPanelGroupIds = new Set(["composition", "presentationModes", "interactionModes"]);
const planBenefitPanelGroupIds = new Set(["composition", "presentationModes", "interactionModes"]);

const productItemPanelOptionGroups = productItemCardManifest.optionGroups
  .filter((group) => productItemPanelGroupIds.has(group.id));
const planBenefitPanelOptionGroups = planBenefitCardManifest.optionGroups
  .filter((group) => planBenefitPanelGroupIds.has(group.id));

const productItemVisibleOptionKeys = productItemPanelOptionGroups
  .flatMap((group) => group.options.map((option) => String(option.key)));
const planBenefitVisibleOptionKeys = planBenefitPanelOptionGroups
  .flatMap((group) => group.options.map((option) => String(option.key)));

const createProductItemCardRuntimeConfig = (
  compositionId: keyof typeof productItemCardManifest.compositions
): ProductItemCardRuntimeConfig => ({
  compositionId,
  productIndex: 0,
  badgeMode: "none",
  badgeTone: "offer",
  metaMode: "category-detail",
  priceMode: "unit",
  actionMode: "add",
  favoriteMode: "toggle",
  quantityMode: "stepper",
  selectionMode: "multi",
  ...productItemCardManifest.compositions[compositionId],
  favorite: false,
  quantity: 0,
  selected: false,
  originalPrice: 129.9
});

const createPlanBenefitCardRuntimeConfig = (
  compositionId: keyof typeof planBenefitCardManifest.compositions
): PlanBenefitCardRuntimeConfig => ({
  compositionId,
  showName: true,
  showDescription: true,
  showPrice: true,
  showBillingCycle: true,
  showBenefits: true,
  showSavings: false,
  showBadge: true,
  showAction: true,
  showSelectedState: true,
  showHighlight: false,
  priceMode: "monthly",
  benefitsMode: "list",
  promotionMode: "none",
  actionMode: "select",
  layoutMode: "standard",
  selected: false,
  disabled: false,
  ...planBenefitCardManifest.compositions[compositionId]
});

export const LibraryView: React.FC<LibraryViewProps> = () => {
  const isDark = true;
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const strings = clientPtBR.library;
  const [selectedCandidateId, setSelectedCandidateId] = useState(libraryCandidatesMock[0]?.id);
  const [productCardConfig, setProductCardConfig] = useState<ProductItemCardRuntimeConfig>(() =>
    createProductItemCardRuntimeConfig("catalog")
  );
  const [planBenefitCardConfig, setPlanBenefitCardConfig] = useState<PlanBenefitCardRuntimeConfig>(() =>
    createPlanBenefitCardRuntimeConfig("monthlyPlan")
  );
  const [productPreviewState, setProductPreviewState] = useState<ProductPreviewState>({});

  const featuredProduct = useMemo(() => productsMock.find((product) => product.featured) || productsMock[0], []);
  const productPreviewItems = useMemo(() => {
    const preferredProductIds = [
      "product-picanha",
      "product-fraldinha",
      "product-baby-beef",
      "product-chorizo",
      "product-pao-de-alho",
      "product-combo-premium"
    ];
    const preferredProducts = preferredProductIds
      .map((productId) => productsMock.find((product) => product.id === productId))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

    return preferredProducts.length >= 5 ? preferredProducts : productsMock.slice(0, 6);
  }, []);
  const featuredCategory = productCategoriesMock.find((category) => category.id === featuredProduct.categoryId);
  const featuredPlan = catalogSubscriptionPlansMock.find((plan) => plan.key === "premium") || catalogSubscriptionPlansMock[0];
  const featuredPaymentMethod = paymentMethodsMock.find((method) => method.key === "creditCard") || paymentMethodsMock[0];
  const paymentStrings = clientPtBR.pedido.paymentStep;
  const summaryStrings = clientPtBR.pedido.summary;
  const selectedCandidate =
    libraryCandidatesMock.find((candidate) => candidate.id === selectedCandidateId) || libraryCandidatesMock[0];
  const selectedTypeLabel = strings.labels.productComponent;
  const selectedStatusLabel = statusLabelMap[selectedCandidate.status];
  const selectedManifest =
    selectedCandidate.id === productItemCardManifest.id
      ? {
          manifestPath: productItemCardManifest.manifestPath,
          composition: productItemCardManifest.composition,
          compositions: productItemCardManifest.compositions,
          optionKeys: productItemVisibleOptionKeys,
          designSystemBoundary: productItemCardManifest.designSystemBoundary
        }
      : selectedCandidate.id === planBenefitCardManifest.id
        ? {
            manifestPath: planBenefitCardManifest.manifestPath,
            composition: planBenefitCardManifest.composition,
            compositions: planBenefitCardManifest.compositions,
            optionKeys: planBenefitVisibleOptionKeys,
            designSystemBoundary: planBenefitCardManifest.designSystemBoundary
          }
        : null;
  const getProductOptionValue = (key: string) => {
    if (key === "badgeMode") return productCardConfig.badgeMode;
    if (key === "badgeTone") return productCardConfig.badgeTone;
    if (key === "metaMode") return productCardConfig.metaMode;
    if (key === "priceMode") return productCardConfig.priceMode;
    if (key === "actionMode") return productCardConfig.actionMode;
    if (key === "favoriteMode") return productCardConfig.favoriteMode;
    if (key === "quantityMode") return productCardConfig.quantityMode;
    if (key === "selectionMode") return productCardConfig.selectionMode;
    if (key === "showImage") return productCardConfig.showImage ? "on" : "off";
    if (key === "showName") return productCardConfig.showName ? "on" : "off";
    if (key === "showDescription") return productCardConfig.showDescription ? "on" : "off";
    if (key === "showMeta") return productCardConfig.showMeta ? "on" : "off";
    if (key === "showBadge") return productCardConfig.showBadge ? "on" : "off";
    if (key === "showFavorite") return productCardConfig.showFavorite ? "on" : "off";
    if (key === "showPrice") return productCardConfig.showPrice ? "on" : "off";
    if (key === "showOriginalPrice") return productCardConfig.showOriginalPrice ? "on" : "off";
    if (key === "showAction") return productCardConfig.showAction ? "on" : "off";
    if (key === "selected") return productCardConfig.selected ? "on" : "off";
    if (key === "quantity") return String(productCardConfig.quantity);
    if (key === "favorite") return productCardConfig.favorite ? "on" : "off";
    return "";
  };
  const updateProductOption = (option: { key: string; control: string; values?: readonly string[] }) => {
    const key = String(option.key);

    setProductCardConfig((current) => {
      if (option.control === "select" && option.values?.length) {
        const currentValue = String(current[key as keyof ProductItemCardRuntimeConfig] || option.values[0]);
        const currentIndex = option.values.indexOf(currentValue);
        const nextValue = option.values[(currentIndex + 1) % option.values.length];

        return { ...current, [key]: nextValue };
      }

      if (key === "showPrice") return { ...current, showPrice: !current.showPrice };
      if (key === "showImage") return { ...current, showImage: !current.showImage };
      if (key === "showName") return { ...current, showName: !current.showName };
      if (key === "showDescription") return { ...current, showDescription: !current.showDescription };
      if (key === "showMeta") return { ...current, showMeta: !current.showMeta };
      if (key === "showBadge") return { ...current, showBadge: !current.showBadge };
      if (key === "showFavorite") return { ...current, showFavorite: !current.showFavorite };
      if (key === "showOriginalPrice") return { ...current, showOriginalPrice: !current.showOriginalPrice, originalPrice: current.originalPrice ?? 129.9 };

      if (key === "showAction") return { ...current, showAction: !current.showAction };
      if (key === "favorite") return { ...current, favorite: !current.favorite };
      if (key === "quantity") {
        const nextQuantity = current.quantity + 1;
        return { ...current, quantity: nextQuantity, selected: nextQuantity > 0 };
      }

      if (key === "selected") {
        const nextSelected = !current.selected;
        return {
          ...current,
          selected: nextSelected,
          quantity: nextSelected ? Math.max(current.quantity, 1) : 0
        };
      }

      return current;
    });
  };
  const setProductSelectOption = (key: string, value: string) => {
    setProductCardConfig((current) => ({ ...current, [key]: value }));
  };
  const getPlanBenefitOptionValue = (key: string) => {
    if (key === "priceMode") return planBenefitCardConfig.priceMode;
    if (key === "benefitsMode") return planBenefitCardConfig.benefitsMode;
    if (key === "promotionMode") return planBenefitCardConfig.promotionMode;
    if (key === "actionMode") return planBenefitCardConfig.actionMode;
    if (key === "layoutMode") return planBenefitCardConfig.layoutMode;
    if (key === "showName") return planBenefitCardConfig.showName ? "on" : "off";
    if (key === "showDescription") return planBenefitCardConfig.showDescription ? "on" : "off";
    if (key === "showPrice") return planBenefitCardConfig.showPrice ? "on" : "off";
    if (key === "showBillingCycle") return planBenefitCardConfig.showBillingCycle ? "on" : "off";
    if (key === "showBenefits") return planBenefitCardConfig.showBenefits ? "on" : "off";
    if (key === "showSavings") return planBenefitCardConfig.showSavings ? "on" : "off";
    if (key === "showBadge") return planBenefitCardConfig.showBadge ? "on" : "off";
    if (key === "showAction") return planBenefitCardConfig.showAction ? "on" : "off";
    if (key === "showSelectedState") return planBenefitCardConfig.showSelectedState ? "on" : "off";
    if (key === "showHighlight") return planBenefitCardConfig.showHighlight ? "on" : "off";
    if (key === "selected") return planBenefitCardConfig.selected ? "on" : "off";
    if (key === "disabled") return planBenefitCardConfig.disabled ? "on" : "off";
    return "";
  };
  const updatePlanBenefitOption = (option: { key: string; control: string; values?: readonly string[] }) => {
    const key = String(option.key);

    setPlanBenefitCardConfig((current) => {
      if (option.control === "select" && option.values?.length) {
        const currentValue = String(current[key as keyof PlanBenefitCardRuntimeConfig] || option.values[0]);
        const currentIndex = option.values.indexOf(currentValue);
        const nextValue = option.values[(currentIndex + 1) % option.values.length];

        return { ...current, [key]: nextValue };
      }

      if (key === "showName") return { ...current, showName: !current.showName };
      if (key === "showDescription") return { ...current, showDescription: !current.showDescription };
      if (key === "showPrice") return { ...current, showPrice: !current.showPrice };
      if (key === "showBillingCycle") return { ...current, showBillingCycle: !current.showBillingCycle };
      if (key === "showBenefits") return { ...current, showBenefits: !current.showBenefits };
      if (key === "showSavings") return { ...current, showSavings: !current.showSavings };
      if (key === "showBadge") return { ...current, showBadge: !current.showBadge };
      if (key === "showAction") return { ...current, showAction: !current.showAction };
      if (key === "showSelectedState") return { ...current, showSelectedState: !current.showSelectedState };
      if (key === "showHighlight") return { ...current, showHighlight: !current.showHighlight };
      if (key === "selected") return { ...current, selected: !current.selected };
      if (key === "disabled") return { ...current, disabled: !current.disabled };

      return current;
    });
  };
  const setPlanBenefitSelectOption = (key: string, value: string) => {
    setPlanBenefitCardConfig((current) => ({ ...current, [key]: value }));
  };
  const renderManifestOption = (
    option: ManifestPanelOption,
    value: string,
    onToggle: (option: ManifestPanelOption) => void,
    onSelectValue: (key: string, value: string) => void
  ) => {
    const optionKey = String(option.key);
    const isBooleanValue = value === "on" || value === "off";
    const isOn = value === "on";

    if (option.control === "select" && option.values?.length) {
      return (
        <label
          key={option.key}
          title={`${option.control} | ${option.owner}`}
          style={{
            width: "100%",
            minHeight: "34px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(118px, 150px)",
            alignItems: "center",
            gap: "8px",
            border: `1px solid ${tokens.border}`,
            borderRadius: "6px",
            padding: "6px 8px",
            background: tokens.surfaceContainer,
            color: tokens.text,
            fontSize: "11px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {optionKey}
          </span>
          <select
            value={value}
            onChange={(event) => onSelectValue(optionKey, event.target.value)}
            style={{
              width: "100%",
              minWidth: 0,
              height: "26px",
              border: `1px solid ${tokens.border}`,
              borderRadius: "5px",
              background: tokens.background,
              color: tokens.copper,
              fontSize: "10px",
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {option.values.map((optionValue) => (
              <option key={optionValue} value={optionValue}>
                {optionValue}
              </option>
            ))}
          </select>
        </label>
      );
    }

    return (
      <button
        key={option.key}
        type="button"
        onClick={() => onToggle(option)}
        title={`${option.control} | ${option.owner}`}
        style={{
          width: "100%",
          minHeight: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          border: `1px solid ${tokens.border}`,
          borderRadius: "6px",
          padding: "6px 8px",
          background: tokens.surfaceContainer,
          color: tokens.text,
          cursor: "pointer",
          fontSize: "11px",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {optionKey}
        </span>
        {value ? (
          <code
            style={{
              minWidth: isBooleanValue ? "34px" : undefined,
              padding: "3px 7px",
              borderRadius: "999px",
              border: `1px solid ${isOn ? tokens.copper : tokens.border}`,
              background: isBooleanValue
                ? isOn
                  ? "rgba(184, 115, 51, 0.18)"
                  : "rgba(255, 255, 255, 0.04)"
                : "rgba(184, 115, 51, 0.1)",
              color: isOn || !isBooleanValue ? tokens.copper : tokens.textMuted,
              fontSize: "10px",
              fontWeight: 900,
              textAlign: "center",
              textTransform: isBooleanValue ? "uppercase" : undefined,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {value}
          </code>
        ) : null}
      </button>
    );
  };
  const handleProductAction = (productId: string) => {
    setProductPreviewState((current) => {
      const previous = current[productId] || { quantity: 0, favorite: false };

      return {
        ...current,
        [productId]: {
          ...previous,
          quantity: previous.quantity + 1
        }
      };
    });
  };
  const handleProductDecrease = (productId: string) => {
    setProductPreviewState((current) => {
      const previous = current[productId] || { quantity: 0, favorite: false };

      return {
        ...current,
        [productId]: {
          ...previous,
          quantity: Math.max(previous.quantity - 1, 0)
        }
      };
    });
  };
  const handleProductFavoriteToggle = (productId: string) => {
    setProductPreviewState((current) => {
      const previous = current[productId] || { quantity: 0, favorite: false };

      return {
        ...current,
        [productId]: {
          ...previous,
          favorite: !previous.favorite
        }
      };
    });
  };
  const renderSelectedPreview = () => {
    if (selectedCandidate.previewKind === "product-item") {
      const previewProducts = productPreviewItems.slice(0, 6);
      const productItemCompositionEntries = Object.entries(productItemCardManifest.compositions) as Array<
        [keyof typeof productItemCardManifest.compositions, (typeof productItemCardManifest.compositions)[keyof typeof productItemCardManifest.compositions]]
      >;

      return (
        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {productItemCompositionEntries.map(([compositionId]) => {
              const isActive = productCardConfig.compositionId === compositionId;

              return (
                <button
                  key={compositionId}
                  type="button"
                  onClick={() => setProductCardConfig(createProductItemCardRuntimeConfig(compositionId))}
                  style={{
                    minHeight: "34px",
                    padding: "7px 10px",
                    borderRadius: "999px",
                    border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                    background: isActive ? tokens.surfaceContainer : tokens.background,
                    color: isActive ? tokens.text : tokens.textMuted,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {compositionId}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 340px)",
              gap: "16px",
              alignItems: "stretch"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                justifyContent: "stretch",
                alignItems: "start",
                gap: "14px"
              }}
            >
              {previewProducts.map((product, index) => {
                const category = productCategoriesMock.find((item) => item.id === product.categoryId);
                const previewState = productPreviewState[product.id] || { quantity: 0, favorite: false };
                const isLargePreview = index === 0;
                const showBadge = productCardConfig.showBadge && productCardConfig.badgeMode !== "none";
                const badge =
                  productCardConfig.badgeMode === "component"
                    ? strings.labels.productComponent
                    : productCardConfig.badgeMode === "category"
                      ? category?.name
                      : productCardConfig.badgeMode === "offer" || productCardConfig.badgeMode === "stock" || productCardConfig.badgeMode === "custom"
                        ? strings.labels.mapped
                      : undefined;

                return (
                  <ProductItemCard
                    key={product.id}
                    style={{
                      width: "100%",
                      gridColumn: isLargePreview ? "span 2" : undefined,
                      minHeight: productCardConfig.showImage
                        ? isLargePreview ? "430px" : "360px"
                        : isLargePreview ? "330px" : "260px"
                    }}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                    categoryLabel={category?.name || strings.labels.category}
                    detailLabel={product.weightLabel}
                    price={product.price}
                    originalPrice={productCardConfig.originalPrice}
                    priceLabel={strings.labels.priceLabel}
                    badge={badge}
                    badgeTone={productCardConfig.badgeTone}
                    showImage={productCardConfig.showImage}
                    showName={productCardConfig.showName}
                    showDescription={productCardConfig.showDescription}
                    showMeta={productCardConfig.showMeta}
                    showBadge={showBadge}
                    showFavorite={productCardConfig.showFavorite}
                    showOriginalPrice={productCardConfig.showOriginalPrice}
                    metaMode={productCardConfig.metaMode}
                    priceMode={productCardConfig.priceMode}
                    actionMode={productCardConfig.actionMode}
                    favoriteMode={productCardConfig.favoriteMode}
                    quantityMode={productCardConfig.quantityMode}
                    selected={previewState.quantity > 0}
                    quantity={previewState.quantity}
                    quantitySuffix={clientPtBR.pedido.productCard.quantitySuffix}
                    favorite={previewState.favorite}
                    showPrice={productCardConfig.showPrice}
                    showAction={productCardConfig.showAction}
                    actionLabel={strings.labels.action}
                    selectedActionLabel={strings.labels.selectedAction}
                    onAction={productCardConfig.showAction && productCardConfig.actionMode !== "none" ? () => handleProductAction(product.id) : undefined}
                    onDecrease={() => handleProductDecrease(product.id)}
                    onFavoriteToggle={productCardConfig.favoriteMode === "toggle" ? () => handleProductFavoriteToggle(product.id) : undefined}
                    favoriteAriaLabel={clientPtBR.pedido.productCard.select}
                    removeFavoriteAriaLabel={clientPtBR.pedido.productCard.selected}
                    isDark={isDark}
                    tokens={{
                      background: tokens.background,
                      surfaceContainer: tokens.surfaceContainer,
                      border: tokens.border,
                      text: tokens.text,
                      textMuted: tokens.textMuted,
                      copper: tokens.copper
                    }}
                  />
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gap: "8px",
                padding: "12px",
                border: `1px solid ${tokens.border}`,
                borderRadius: "8px",
                background: tokens.background,
                alignSelf: "stretch",
                minHeight: "834px",
                boxSizing: "border-box",
                alignContent: "start"
              }}
            >
              <code style={{ color: tokens.copper, fontSize: "12px", fontWeight: 800 }}>composition</code>
              <div style={{ display: "grid", gap: "10px" }}>
                {productItemPanelOptionGroups.map((group) => (
                  <div key={group.id} style={{ display: "grid", gap: "6px" }}>
                    <code style={{ color: tokens.textMuted, fontSize: "10px", fontWeight: 800 }}>{group.id}</code>
                    {group.options.map((option) => {
                      const optionKey = String(option.key);
                      const value = getProductOptionValue(optionKey);

                      return renderManifestOption(option, value, updateProductOption, setProductSelectOption);
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedCandidate.previewKind === "plan-benefit") {
      const planBenefitCompositionEntries = Object.entries(planBenefitCardManifest.compositions) as Array<
        [keyof typeof planBenefitCardManifest.compositions, (typeof planBenefitCardManifest.compositions)[keyof typeof planBenefitCardManifest.compositions]]
      >;

      return (
        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {planBenefitCompositionEntries.map(([compositionId]) => {
              const isActive = planBenefitCardConfig.compositionId === compositionId;

              return (
                <button
                  key={compositionId}
                  type="button"
                  onClick={() => setPlanBenefitCardConfig(createPlanBenefitCardRuntimeConfig(compositionId))}
                  style={{
                    minHeight: "34px",
                    padding: "7px 10px",
                    borderRadius: "999px",
                    border: `1px solid ${isActive ? tokens.copper : tokens.border}`,
                    background: isActive ? tokens.surfaceContainer : tokens.background,
                    color: isActive ? tokens.text : tokens.textMuted,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {compositionId}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 340px)",
              gap: "16px",
              alignItems: "stretch"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                justifyContent: "stretch",
                alignItems: "start",
                gap: "14px"
              }}
            >
              {catalogSubscriptionPlansMock.map((plan) => (
                <PlanBenefitCard
                  key={plan.id}
                  style={{ width: "100%" }}
                  name={plan.name}
                  description={plan.subtitle}
                  monthlyPrice={plan.monthlyPrice}
                  annualMonthlyPrice={plan.annualMonthlyPrice}
                  billingCycleLabel={strings.labels.monthlyCycle}
                  annualBillingCycleLabel={strings.labels.annualMonthlyCycle}
                  savingsLabel={strings.labels.annualPromotion}
                  badge={strings.labels.productComponent}
                  benefits={plan.features}
                  benefitCountLabel={`${plan.features.length} ${strings.labels.benefitsSuffix}`}
                  highlightLabel={plan.key === "premium" ? strings.labels.mapped : undefined}
                  pricePrefixLabel={strings.labels.priceLabel}
                  selectedLabel={strings.labels.selectedAction}
                  showName={planBenefitCardConfig.showName}
                  showDescription={planBenefitCardConfig.showDescription}
                  showPrice={planBenefitCardConfig.showPrice}
                  showBillingCycle={planBenefitCardConfig.showBillingCycle}
                  showBenefits={planBenefitCardConfig.showBenefits}
                  showSavings={planBenefitCardConfig.showSavings}
                  showBadge={planBenefitCardConfig.showBadge}
                  showAction={planBenefitCardConfig.showAction}
                  showSelectedState={planBenefitCardConfig.showSelectedState}
                  showHighlight={planBenefitCardConfig.showHighlight}
                  priceMode={planBenefitCardConfig.priceMode}
                  benefitsMode={planBenefitCardConfig.benefitsMode}
                  promotionMode={planBenefitCardConfig.promotionMode}
                  actionMode={planBenefitCardConfig.actionMode}
                  layoutMode={planBenefitCardConfig.layoutMode}
                  selected={planBenefitCardConfig.selected ? plan.key === "premium" : false}
                  disabled={planBenefitCardConfig.disabled}
                  actionLabel={strings.labels.action}
                  selectedActionLabel={strings.labels.selectedAction}
                  disabledHint={strings.labels.needsContract}
                  onAction={() => setPlanBenefitCardConfig((current) => ({ ...current, selected: !current.selected }))}
                  isDark={isDark}
                  tokens={{
                    background: tokens.background,
                    surfaceContainer: tokens.surfaceContainer,
                    border: tokens.border,
                    text: tokens.text,
                    textMuted: tokens.textMuted,
                    copper: tokens.copper
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gap: "8px",
                padding: "12px",
                border: `1px solid ${tokens.border}`,
                borderRadius: "8px",
                background: tokens.background,
                alignSelf: "stretch",
                minHeight: "500px",
                boxSizing: "border-box",
                alignContent: "start"
              }}
            >
              <code style={{ color: tokens.copper, fontSize: "12px", fontWeight: 800 }}>composition</code>
              <div style={{ display: "grid", gap: "10px" }}>
                {planBenefitPanelOptionGroups.map((group) => (
                  <div key={group.id} style={{ display: "grid", gap: "6px" }}>
                    <code style={{ color: tokens.textMuted, fontSize: "10px", fontWeight: 800 }}>{group.id}</code>
                    {group.options.map((option) => {
                      const optionKey = String(option.key);
                      const value = getPlanBenefitOptionValue(optionKey);

                      return renderManifestOption(option, value, updatePlanBenefitOption, setPlanBenefitSelectOption);
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedCandidate.previewKind === "payment-method") {
      const label = paymentStrings.methods[featuredPaymentMethod.labelKey];
      const description = paymentStrings.methods[featuredPaymentMethod.descriptionKey];

      return (
        <div style={{ display: "grid", gap: "12px", padding: "18px", border: `1px solid ${tokens.border}`, borderRadius: "8px", background: tokens.background }}>
          <Badge variant="limited">{paymentStrings.methodsTitle}</Badge>
          <h3 style={{ margin: 0, fontSize: "22px" }}>{label}</h3>
          <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.45 }}>{description}</p>
          <code style={{ color: tokens.copper, fontSize: "12px" }}>
            {paymentStrings.installmentsTitle}: {paymentInstallmentsMock[0]}{paymentStrings.installmentsSuffix}
          </code>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: "12px", padding: "18px", border: `1px solid ${tokens.border}`, borderRadius: "8px", background: tokens.background }}>
        <Badge variant="copper">{summaryStrings.title}</Badge>
        <h3 style={{ margin: 0, fontSize: "22px" }}>{summaryStrings.selectedItems}</h3>
        <div style={{ display: "grid", gap: "8px", color: tokens.textMuted, fontSize: "13px" }}>
          <span>{featuredProduct.name}</span>
          <span>{featuredPlan.name}</span>
          <span>{paymentStrings.methods[featuredPaymentMethod.labelKey]}</span>
        </div>
        <strong style={{ color: tokens.copper, fontSize: "20px" }}>
          {moneyFormatter.format(featuredProduct.price + featuredPlan.monthlyPrice)}
        </strong>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tokens.background,
        color: tokens.text,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <main style={{ padding: "32px 24px 56px" }}>
        <section style={{ maxWidth: "1680px", margin: "0 auto", display: "grid", gap: "18px" }}>
          <div style={{ display: "grid", gap: "10px", maxWidth: "720px" }}>
            <h1
              style={{
                margin: 0,
                color: tokens.text,
                fontFamily: "'Playfair Display', serif",
                fontSize: "42px",
                lineHeight: 1,
                letterSpacing: 0
              }}
            >
              {strings.hero.title}
            </h1>
            <code style={{ color: tokens.copper, fontSize: "13px" }}>
              {strings.labels.route}: /library | {strings.labels.command}: npm run build
            </code>
          </div>

          <section style={{ display: "grid", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{strings.sections.candidates}</h2>
            <div
              role="tablist"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "8px"
              }}
            >
              {libraryCandidatesMock.map((candidate) => {
                const isSelected = candidate.id === selectedCandidate.id;

                return (
                  <button
                    key={candidate.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    style={{
                      minHeight: "64px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${isSelected ? tokens.copper : tokens.border}`,
                      background: isSelected ? tokens.surface : tokens.surfaceContainer,
                      color: tokens.text,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <span style={{ minWidth: 0, display: "grid", gap: "3px" }}>
                      <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "14px" }}>
                        {candidate.name}
                      </strong>
                      <code style={{ color: tokens.textMuted, fontSize: "11px" }}>
                        {strings.labels.level}: {candidate.maturityLevel}
                      </code>
                    </span>
                    <Badge variant={isSelected ? "copper" : "limited"}>
                      {statusLabelMap[candidate.status]}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </section>

          <Card isDark={isDark} hoverable={false} style={{ padding: "18px", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 800 }}>{selectedCandidate.name}</h2>
                <code style={{ color: tokens.textMuted, fontSize: "12px" }}>
                  {selectedTypeLabel} | {strings.labels.level}: {selectedCandidate.maturityLevel}
                </code>
              </div>
              <Badge variant="copper">{selectedStatusLabel}</Badge>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {renderSelectedPreview()}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                  gap: "8px",
                  color: tokens.textMuted,
                  fontSize: "12px",
                  lineHeight: 1.5,
                  paddingTop: "4px"
                }}
              >
                <code>{selectedCandidate.currentPath}</code>
                <code>
                  {strings.labels.manifest}: {selectedManifest ? selectedManifest.manifestPath : selectedCandidate.manifestKey}
                </code>
                {selectedManifest ? (
                  <>
                    <code>
                      composition: {Object.keys(selectedManifest.composition).join(", ")}
                    </code>
                    <code>
                      options: {selectedManifest.optionKeys.join(", ")}
                    </code>
                    <code>
                      compositions: {Object.keys(selectedManifest.compositions).join(", ")}
                    </code>
                    <code>
                      design-system: {selectedManifest.designSystemBoundary.futureOwner}
                    </code>
                  </>
                ) : null}
                <code>{strings.labels.command}: npm run build</code>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};
