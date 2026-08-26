"use client";

import React, { useMemo, useState } from "react";
import { Badge, Card } from "../../legacy/design-system";
import { ProductItemCard, productItemCardManifest } from "../../product-components/ecommerce";
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

type ProductExampleRuntimeState = Record<string, {
  exampleId: string;
  productIndex: number;
  badge: "component" | "category" | "none";
  badgeTone: "offer" | "limited";
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
}>;

type ProductItemCardRuntimeConfig = ProductExampleRuntimeState[string];
type ProductPreviewState = Record<string, {
  quantity: number;
  favorite: boolean;
}>;

const productItemInteractiveOptionKeys = new Set([
  "showImage",
  "showName",
  "showDescription",
  "showMeta",
  "showFavorite",
  "showPrice",
  "showAction",
  "showOriginalPrice"
]);

const productItemVisibleCompositionOptionKeys = productItemCardManifest.optionGroups
  .find((group) => group.id === "composition")
  ?.options
  .filter((option) => option.control === "boolean" && String(option.key).startsWith("show"))
  .map((option) => String(option.key)) || [];

const createProductItemCardRuntimeConfig = (
  example: (typeof productItemCardManifest.examples)[number]
): ProductItemCardRuntimeConfig => ({
  exampleId: example.id,
  productIndex: example.productIndex,
  badge: "none",
  badgeTone: example.options.badgeTone,
  showImage: example.options.showImage,
  showName: example.options.showName,
  showDescription: example.options.showDescription,
  showMeta: example.options.showMeta,
  showBadge: false,
  showFavorite: example.options.showFavorite,
  showOriginalPrice: example.options.showOriginalPrice,
  favorite: example.options.favorite,
  quantity: example.options.quantity,
  selected: example.options.selected,
  showPrice: example.options.showPrice,
  showAction: example.options.showAction,
  originalPrice: "originalPrice" in example.options ? example.options.originalPrice : undefined
});

export const LibraryView: React.FC<LibraryViewProps> = () => {
  const isDark = true;
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const strings = clientPtBR.library;
  const [selectedCandidateId, setSelectedCandidateId] = useState(libraryCandidatesMock[0]?.id);
  const [productCardConfig, setProductCardConfig] = useState<ProductItemCardRuntimeConfig>(() =>
    createProductItemCardRuntimeConfig(productItemCardManifest.examples[0])
  );
  const [productPreviewState, setProductPreviewState] = useState<ProductPreviewState>({});

  const featuredProduct = useMemo(() => productsMock.find((product) => product.featured) || productsMock[0], []);
  const productPreviewItems = useMemo(() => {
    const preferredProductIds = ["product-picanha", "product-fraldinha", "product-baby-beef"];
    const preferredProducts = preferredProductIds
      .map((productId) => productsMock.find((product) => product.id === productId))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

    return preferredProducts.length === preferredProductIds.length ? preferredProducts : productsMock.slice(0, 3);
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
  const getProductOptionValue = (key: string) => {
    if (key === "badge") return productCardConfig.badge;
    if (key === "badgeTone") return productCardConfig.badgeTone;
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
  const toggleProductOption = (key: string) => {
    setProductCardConfig((current) => {
      if (key === "badge") {
        const nextBadge = current.badge === "component" ? "category" : current.badge === "category" ? "none" : "component";
        return { ...current, badge: nextBadge };
      }

      if (key === "badgeTone") {
        return { ...current, badgeTone: current.badgeTone === "offer" ? "limited" : "offer" };
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
      const previewProducts = productPreviewItems.slice(0, 3);
      const compositionOptions = productItemCardManifest.optionGroups
        .find((group) => group.id === "composition")
        ?.options.filter((option) => productItemVisibleCompositionOptionKeys.includes(String(option.key)));

      return (
        <div style={{ display: "grid", gap: "14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 340px)",
              gap: "16px",
              alignItems: "stretch"
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              {previewProducts.map((product, index) => {
                const category = productCategoriesMock.find((item) => item.id === product.categoryId);
                const previewState = productPreviewState[product.id] || { quantity: 0, favorite: false };
                const isFeaturedPreview = index === 0;
                const badge =
                  productCardConfig.badge === "component"
                    ? strings.labels.productComponent
                    : productCardConfig.badge === "category"
                      ? category?.name
                      : undefined;

                return (
                  <ProductItemCard
                    key={product.id}
                    style={{
                      gridColumn: isFeaturedPreview ? "1 / -1" : undefined,
                      minHeight: isFeaturedPreview ? "430px" : "390px"
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
                    showBadge={productCardConfig.showBadge}
                    showFavorite={productCardConfig.showFavorite}
                    showOriginalPrice={productCardConfig.showOriginalPrice}
                    selected={previewState.quantity > 0}
                    quantity={previewState.quantity}
                    quantitySuffix={clientPtBR.pedido.productCard.quantitySuffix}
                    favorite={previewState.favorite}
                    showPrice={productCardConfig.showPrice}
                    showAction={productCardConfig.showAction}
                    actionLabel={strings.labels.action}
                    selectedActionLabel={strings.labels.selectedAction}
                    onAction={productCardConfig.showAction ? () => handleProductAction(product.id) : undefined}
                    onDecrease={() => handleProductDecrease(product.id)}
                    onFavoriteToggle={() => handleProductFavoriteToggle(product.id)}
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
              <div style={{ display: "grid", gap: "6px" }}>
                {compositionOptions?.map((option) => {
                  const optionKey = String(option.key);
                  const isInteractive = productItemInteractiveOptionKeys.has(optionKey);
                  const value = getProductOptionValue(optionKey);
                  const isBooleanValue = value === "on" || value === "off";
                  const isOn = value === "on";

                  return (
                    <button
                      key={option.key}
                      type="button"
                      disabled={!isInteractive}
                      onClick={() => toggleProductOption(optionKey)}
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
                        background: isInteractive ? tokens.surfaceContainer : "transparent",
                        color: isInteractive ? tokens.text : tokens.textMuted,
                        cursor: isInteractive ? "pointer" : "default",
                        fontSize: "11px",
                        fontFamily: "'Inter', sans-serif",
                        opacity: isInteractive ? 1 : 0.64
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {optionKey}
                      </span>
                      {value ? (
                        <code
                          style={{
                            minWidth: isBooleanValue ? "34px" : undefined,
                            padding: isBooleanValue ? "3px 7px" : 0,
                            borderRadius: isBooleanValue ? "999px" : 0,
                            border: isBooleanValue ? `1px solid ${isOn ? tokens.copper : tokens.border}` : "none",
                            background: isBooleanValue
                              ? isOn
                                ? "rgba(184, 115, 51, 0.18)"
                                : "rgba(255, 255, 255, 0.04)"
                              : "transparent",
                            color: isOn || !isBooleanValue ? tokens.copper : tokens.textMuted,
                            fontSize: "10px",
                            fontWeight: 900,
                            textAlign: "center",
                            textTransform: isBooleanValue ? "uppercase" : undefined
                          }}
                        >
                          {value}
                        </code>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedCandidate.previewKind === "plan-benefit") {
      return (
        <div style={{ display: "grid", gap: "12px", padding: "18px", border: `1px solid ${tokens.border}`, borderRadius: "8px", background: tokens.background }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "4px" }}>
              <Badge variant="copper">{strings.labels.productComponent}</Badge>
              <h3 style={{ margin: 0, fontSize: "24px" }}>{featuredPlan.name}</h3>
              <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.45 }}>{featuredPlan.subtitle}</p>
            </div>
            <strong style={{ color: tokens.copper, fontSize: "20px", whiteSpace: "nowrap" }}>
              {moneyFormatter.format(featuredPlan.monthlyPrice)}
            </strong>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {featuredPlan.features.slice(0, 3).map((feature) => (
              <span key={feature} style={{ color: tokens.textMuted, fontSize: "13px" }}>
                {feature}
              </span>
            ))}
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
        <section style={{ maxWidth: "1320px", margin: "0 auto", display: "grid", gap: "18px" }}>
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
                  {strings.labels.manifest}: {selectedCandidate.id === productItemCardManifest.id ? productItemCardManifest.manifestPath : selectedCandidate.manifestKey}
                </code>
                {selectedCandidate.id === productItemCardManifest.id ? (
                  <>
                    <code>
                      composition: {Object.keys(productItemCardManifest.composition).join(", ")}
                    </code>
                    <code>
                      options: {productItemVisibleCompositionOptionKeys.join(", ")}
                    </code>
                    <code>
                      design-system: {productItemCardManifest.designSystemBoundary.futureOwner}
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
