export type ProductKind = "meat" | "seasoning" | "charcoal" | "utensil" | "kit";

export type ProductExperience = "subscription" | "royalBox" | "royalDelivery";

export type SubscriptionTier = "basic" | "premium" | "pro";

export type BillingMode = "monthly" | "annual" | "oneTime";

export type CommercialProductKind = "fixedSubscription" | "customSubscription" | "oneTimeOrder";

export type StockStatus = "available" | "limited" | "unavailable";

export type ShippingPolicy = "included" | "calculated" | "customerChoice";

export type ProductCategory = {
  id: string;
  name: string;
  kind: ProductKind;
  description: string;
  image: string;
  order: number;
};

export type ProductCatalog = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  productIds: string[];
  tags: string[];
  featured?: boolean;
  order: number;
};

export type ProductOption = {
  id: string;
  name: string;
  description: string;
  appliesTo: ProductKind[];
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  kind: ProductKind;
  categoryId: string;
  description: string;
  image: string;
  basePrice: number;
  deliveryPrice: number;
  unit: string;
  weightLabel?: string;
  stockStatus: StockStatus;
  availableFor: ProductExperience[];
  planTiers: SubscriptionTier[];
  includedInPlans?: SubscriptionTier[];
  optionIds?: string[];
  tags: string[];
  featured?: boolean;
};

export type SubscriptionPlanMock = {
  id: string;
  key: SubscriptionTier;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  billingModes: BillingMode[];
  productSelectionLimit: number;
  proteinKgLimit: number;
  allowedPlanTiers: SubscriptionTier[];
  includedCharcoalPackages: number;
  charcoalMaxQuantity?: number;
  charcoalKgLimit: number;
  seasoningSelectionLimit: number;
  sideSelectionLimit: number;
  utensilSelectionLimit: number;
  includesUtensilProductIds: string[];
  shipping: ShippingPolicy;
  description: string;
  features: string[];
};

export type ProductFlowMock = {
  id: ProductExperience;
  name: string;
  kind: CommercialProductKind;
  billingLabel: string;
  billingModes: BillingMode[];
  description: string;
  productScope: "planLimited" | "fullCatalog";
  shipping: ShippingPolicy;
  recurrence: {
    enabled: boolean;
    frequency?: "monthly";
    defaultDeliveryDayOfMonth?: number;
    allowsDeliveryDayChoice?: boolean;
  };
  hasSubscriptionPlans: boolean;
  requiresAddress: boolean;
  allowsRepeatLastOrder: boolean;
  allowsCustomAddress: boolean;
  allowsUtensils: boolean;
  allowsUnlimitedCharcoal: boolean;
  priceBehavior: "fixedPlan" | "selectedProducts" | "selectedProductsWithDeliveryMarkup";
};
