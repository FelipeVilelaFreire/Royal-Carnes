export type LibraryMaturityLevel = {
  id: "level-0" | "level-1" | "level-2" | "level-3";
  level: string;
  titleKey: string;
  descriptionKey: string;
  owner: string;
  status: "active" | "future";
};

export type LibraryCandidate = {
  id: string;
  name: string;
  type: "product-component";
  previewKind: "product-item" | "plan-benefit" | "payment-method" | "order-summary";
  currentPath: string;
  maturityLevel: LibraryMaturityLevel["id"];
  manifestKey: string;
  status: "mapped" | "needs-manifest" | "needs-contract";
};

export const libraryMaturityLevelsMock: LibraryMaturityLevel[] = [
  {
    id: "level-0",
    level: "0",
    titleKey: "library.levels.level0.title",
    descriptionKey: "library.levels.level0.description",
    owner: "RoyalPrime screen",
    status: "active"
  },
  {
    id: "level-1",
    level: "1",
    titleKey: "library.levels.level1.title",
    descriptionKey: "library.levels.level1.description",
    owner: "RoyalPrime ecommerce",
    status: "active"
  },
  {
    id: "level-2",
    level: "2",
    titleKey: "library.levels.level2.title",
    descriptionKey: "library.levels.level2.description",
    owner: "ServiceOS product component",
    status: "future"
  },
  {
    id: "level-3",
    level: "3",
    titleKey: "library.levels.level3.title",
    descriptionKey: "library.levels.level3.description",
    owner: "ServiceOS Foundation/AppShell",
    status: "future"
  }
];

export const libraryCandidatesMock: LibraryCandidate[] = [
  {
    id: "product-item-card",
    name: "ProductItemCard",
    type: "product-component",
    previewKind: "product-item",
    currentPath: "frontend/client/web/src/product-components/ecommerce/ProductItemCard.tsx",
    maturityLevel: "level-1",
    manifestKey: "product-item-card.manifest.ts",
    status: "mapped"
  },
  {
    id: "plan-benefit-card",
    name: "PlanBenefitCard",
    type: "product-component",
    previewKind: "plan-benefit",
    currentPath: "frontend/client/web/src/product-components/ecommerce/PlanBenefitCard.tsx",
    maturityLevel: "level-1",
    manifestKey: "plan-benefit-card.manifest.ts",
    status: "mapped"
  },
  {
    id: "payment-method-card",
    name: "PaymentMethodCard",
    type: "product-component",
    previewKind: "payment-method",
    currentPath: "frontend/client/web/src/product-components/ecommerce/PaymentMethodCard.tsx",
    maturityLevel: "level-1",
    manifestKey: "payment-method-card.manifest.ts",
    status: "needs-manifest"
  },
  {
    id: "order-summary-card",
    name: "OrderSummaryCard",
    type: "product-component",
    previewKind: "order-summary",
    currentPath: "frontend/client/web/src/product-components/ecommerce/OrderSummaryCard.tsx",
    maturityLevel: "level-1",
    manifestKey: "order-summary-card.manifest.ts",
    status: "needs-manifest"
  }
];
