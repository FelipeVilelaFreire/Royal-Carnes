import type { PlanBenefitCardProps } from "./PlanBenefitCard";

type PlanBenefitCardOptionDefinition = {
  key: string;
  control: "boolean" | "number" | "text" | "select";
  values?: string[];
  defaultValue?: string | number | boolean;
  owner: "product-component" | "consumer-state" | "foundation";
};

type PlanBenefitCardComposition = Partial<Pick<PlanBenefitCardProps,
  | "showName"
  | "showDescription"
  | "showPrice"
  | "showBillingCycle"
  | "showBenefits"
  | "showSavings"
  | "showBadge"
  | "showAction"
  | "showSelectedState"
  | "showHighlight"
  | "priceMode"
  | "benefitsMode"
  | "promotionMode"
  | "actionMode"
  | "layoutMode"
>>;

export const planBenefitCardManifest = {
  id: "plan-benefit-card",
  name: "PlanBenefitCard",
  service: "ecommerce",
  componentLevel: "level-1",
  targetPath: "frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx",
  manifestPath: "frontend/client/web/src/product-components/ecommerce/plan-benefit-card.manifest.ts",
  owner: "RoyalPrime ecommerce",
  status: "mapped",
  manifestScope: {
    owns: [
      "plan data contract",
      "benefit composition slots",
      "billing and promotion modes",
      "enabled interactions"
    ],
    doesNotOwn: [
      "border radius",
      "font scale",
      "button styling",
      "surface recipe",
      "icon drawing",
      "color palette"
    ]
  },
  designSystemBoundary: {
    futureOwner: "ServiceOS Foundation/AppShell",
    rule: "The card chooses plan slots and modes; Foundation/AppShell decides visual primitives, spacing, typography and action recipes.",
    currentAdapter: "RoyalPrime legacy design-system supplies Button and local visual tokens until the ServiceOS Foundation path exists."
  },
  composition: {
    header: {
      slots: ["badge", "highlight", "name", "selectedState"],
      visibleProps: ["showBadge", "showHighlight", "showName", "showSelectedState"]
    },
    body: {
      slots: ["description", "benefits"],
      visibleProps: ["showDescription", "showBenefits"],
      modes: ["summary", "list", "count", "hidden"]
    },
    commerce: {
      slots: ["monthlyPrice", "annualMonthlyPrice", "billingCycleLabel", "savingsLabel"],
      visibleProps: ["showPrice", "showBillingCycle", "showSavings"],
      modes: ["monthly", "annual", "included", "hidden"]
    },
    actions: {
      slots: ["primaryAction"],
      visibleProps: ["showAction"],
      modes: ["none", "select", "upgrade", "manage", "view-details"],
      rule: "The consumer flow owns selection, disabled state and action handler."
    }
  },
  optionGroups: [
    {
      id: "composition",
      options: [
        { key: "showName", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showDescription", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showPrice", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showBillingCycle", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showBenefits", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showSavings", control: "boolean", defaultValue: false, owner: "product-component" },
        { key: "showBadge", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showAction", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showSelectedState", control: "boolean", defaultValue: true, owner: "product-component" },
        { key: "showHighlight", control: "boolean", defaultValue: false, owner: "product-component" }
      ]
    },
    {
      id: "presentationModes",
      options: [
        {
          key: "priceMode",
          control: "select",
          values: ["monthly", "annual", "included", "hidden"],
          defaultValue: "monthly",
          owner: "product-component"
        },
        {
          key: "benefitsMode",
          control: "select",
          values: ["summary", "list", "count", "hidden"],
          defaultValue: "list",
          owner: "product-component"
        },
        {
          key: "promotionMode",
          control: "select",
          values: ["none", "annual-savings", "limited-offer", "recommended"],
          defaultValue: "none",
          owner: "product-component"
        },
        {
          key: "layoutMode",
          control: "select",
          values: ["compact", "standard", "comparison"],
          defaultValue: "standard",
          owner: "product-component"
        }
      ]
    },
    {
      id: "interactionModes",
      options: [
        {
          key: "actionMode",
          control: "select",
          values: ["none", "select", "upgrade", "manage", "view-details"],
          defaultValue: "select",
          owner: "product-component"
        },
        { key: "selected", control: "boolean", defaultValue: false, owner: "consumer-state" },
        { key: "disabled", control: "boolean", defaultValue: false, owner: "consumer-state" }
      ]
    },
    {
      id: "actions",
      options: [
        { key: "actionLabel", control: "text", owner: "product-component" },
        { key: "selectedActionLabel", control: "text", owner: "product-component" },
        { key: "onAction", control: "boolean", owner: "consumer-state" }
      ]
    }
  ],
  compositions: {
    monthlyPlan: {
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
      layoutMode: "standard"
    },
    annualPromotion: {
      showName: true,
      showDescription: true,
      showPrice: true,
      showBillingCycle: true,
      showBenefits: true,
      showSavings: true,
      showBadge: true,
      showAction: true,
      showSelectedState: true,
      showHighlight: true,
      priceMode: "annual",
      benefitsMode: "summary",
      promotionMode: "annual-savings",
      actionMode: "upgrade",
      layoutMode: "standard"
    },
    comparison: {
      showName: true,
      showDescription: false,
      showPrice: true,
      showBillingCycle: true,
      showBenefits: true,
      showSavings: false,
      showBadge: false,
      showAction: true,
      showSelectedState: true,
      showHighlight: false,
      priceMode: "monthly",
      benefitsMode: "list",
      promotionMode: "none",
      actionMode: "select",
      layoutMode: "comparison"
    },
    compact: {
      showName: true,
      showDescription: false,
      showPrice: true,
      showBillingCycle: false,
      showBenefits: true,
      showSavings: false,
      showBadge: false,
      showAction: false,
      showSelectedState: false,
      showHighlight: false,
      priceMode: "monthly",
      benefitsMode: "count",
      promotionMode: "none",
      actionMode: "none",
      layoutMode: "compact"
    },
    manageSubscription: {
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
      benefitsMode: "summary",
      promotionMode: "recommended",
      actionMode: "manage",
      layoutMode: "standard"
    }
  },
  dataContract: {
    required: ["name", "description", "isDark", "tokens"],
    optional: [
      "monthlyPrice",
      "annualMonthlyPrice",
      "billingCycleLabel",
      "annualBillingCycleLabel",
      "savingsLabel",
      "badge",
      "benefits",
      "benefitCountLabel",
      "highlightLabel",
      "pricePrefixLabel",
      "selectedLabel",
      "showName",
      "showDescription",
      "showPrice",
      "showBillingCycle",
      "showBenefits",
      "showSavings",
      "showBadge",
      "showAction",
      "showSelectedState",
      "showHighlight",
      "priceMode",
      "benefitsMode",
      "promotionMode",
      "actionMode",
      "layoutMode",
      "selected",
      "disabled",
      "actionLabel",
      "selectedActionLabel"
    ]
  },
  capabilities: {
    planHeader: true,
    billingCycle: true,
    monthlyPrice: true,
    annualPrice: true,
    savings: true,
    benefits: true,
    benefitsMode: true,
    promotionMode: true,
    selectedState: true,
    disabledState: true,
    primaryAction: true,
    actionMode: true,
    layoutMode: true
  }
} as const satisfies {
  id: string;
  name: string;
  service: "ecommerce";
  componentLevel: "level-1";
  targetPath: string;
  manifestPath: string;
  owner: string;
  status: "mapped" | "needs-manifest" | "needs-contract";
  manifestScope: {
    owns: string[];
    doesNotOwn: string[];
  };
  designSystemBoundary: {
    futureOwner: string;
    rule: string;
    currentAdapter: string;
  };
  composition: Record<string, {
    slots: string[];
    visibleProps: string[];
    modes?: string[];
    rule?: string;
  }>;
  optionGroups: Array<{
    id: string;
    options: PlanBenefitCardOptionDefinition[];
  }>;
  compositions: Record<string, PlanBenefitCardComposition>;
  dataContract: {
    required: string[];
    optional: string[];
  };
  capabilities: Record<string, boolean>;
};
