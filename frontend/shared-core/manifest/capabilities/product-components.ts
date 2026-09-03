export const royalPrimeProductComponentsCapability = {
  status: "transitional",
  currentOwners: [
    "client/web/src/transitional/product-components",
    "admin/web/src/transitional/product-components",
    "client/web/src/product-components/ecommerce",
  ],
  futureOwner: "foundation/product-components",
  extractionRule: "Extract only when a component is proven generic by real client/admin usage and has no hardcoded screen contract.",
};
