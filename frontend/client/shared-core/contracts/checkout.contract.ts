export type ClientCheckoutProductKind = "meat" | "seasoning" | "charcoal" | "utensil" | "kit";
export type ClientCheckoutProductExperience = "subscription" | "royalBox" | "royalDelivery";
export type ClientCheckoutSubscriptionTier = string;
export type ClientCheckoutBillingMode = "monthly" | "annual" | "oneTime";
export type ClientCheckoutStockStatus = "available" | "limited" | "unavailable";
export type ClientCheckoutShippingPolicy = "included" | "calculated" | "customerChoice";
export type ClientCheckoutFreightOptionKey = "pickup" | "standard" | "express";
export type ClientCheckoutPaymentMethodKey = "pix" | "creditCard" | "payOnDelivery" | "whatsapp";

export interface ClientCheckoutProductCategory {
  id: string;
  name: string;
  kind: ClientCheckoutProductKind;
  description: string;
  image: string;
  order: number;
}

export interface ClientCheckoutProduct {
  id: string;
  sku: string;
  name: string;
  kind: ClientCheckoutProductKind;
  categoryId: string;
  description: string;
  image: string;
  price: number;
  unit: string;
  weightLabel?: string;
  stockStatus: ClientCheckoutStockStatus;
  availableFor: ClientCheckoutProductExperience[];
  planTiers: ClientCheckoutSubscriptionTier[];
  includedInPlans?: ClientCheckoutSubscriptionTier[];
  optionIds?: string[];
  tags: string[];
  featured?: boolean;
}

export interface ClientCheckoutSubscriptionPlan {
  id: string;
  key: ClientCheckoutSubscriptionTier;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  billingModes: ClientCheckoutBillingMode[];
  productSelectionLimit: number;
  proteinKgLimit: number;
  allowedPlanTiers: ClientCheckoutSubscriptionTier[];
  includedCharcoalPackages: number;
  charcoalMaxQuantity?: number;
  charcoalKgLimit: number;
  seasoningSelectionLimit: number;
  sideSelectionLimit: number;
  utensilSelectionLimit: number;
  includesUtensilProductIds: string[];
  shipping: ClientCheckoutShippingPolicy;
  description: string;
  features: string[];
}

export interface ClientCheckoutAddress {
  id: string;
  label: string;
  recipientName: string;
  streetLine: string;
  neighborhoodLine: string;
  zipCode: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface ClientCheckoutFreightOption {
  key: ClientCheckoutFreightOptionKey;
  labelKey: "pickup" | "standardDelivery" | "expressDelivery";
  price: number;
  etaLabel: string;
  availableFor: ClientCheckoutProductExperience[];
}

export interface ClientCheckoutPaymentMethod {
  key: ClientCheckoutPaymentMethodKey;
  labelKey: ClientCheckoutPaymentMethodKey;
  descriptionKey: `${ClientCheckoutPaymentMethodKey}Description`;
  availableFor: ClientCheckoutProductExperience[];
  supportsRecurring: boolean;
  feePercentage: number;
}
