import type { ProductBase } from "../../../shared-core";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
  ClientCheckoutProductKind,
} from "../contracts/checkout.contract";

const checkoutModeByCatalogMode: Record<string, ClientCheckoutProductExperience> = {
  box: "royalBox",
  delivery: "royalDelivery",
  subscription: "subscription",
};

function resolveKind(product: ProductBase): ClientCheckoutProductKind {
  const categoryKeys = product.categories.map((category) => category.key);
  if (categoryKeys.includes("carvao")) return "charcoal";
  if (categoryKeys.includes("temperos")) return "seasoning";
  if (categoryKeys.includes("utensilios")) return "utensil";
  if (categoryKeys.includes("combos")) return "kit";
  return "meat";
}

export function mapCheckoutCatalog(products: ProductBase[]) {
  const categories = new Map<string, ClientCheckoutProductCategory>();
  const mappedProducts = products.map((product): ClientCheckoutProduct => {
    const primaryCategory = product.categories.find((category) => category.key === product.primaryCategoryKey) || product.categories[0];
    const categoryId = primaryCategory?.key || "all";
    if (primaryCategory && !categories.has(categoryId)) {
      categories.set(categoryId, {
        id: categoryId,
        name: primaryCategory.name,
        kind: resolveKind(product),
        description: "",
        image: "",
        order: primaryCategory.sortOrder,
      });
    }
    const preferredPrice = product.prices.find((price) => price.commercialModeKey === "delivery") || product.prices[0];
    const primaryVariant = product.variants.find((variant) => variant.isActive) || product.variants[0];
    return {
      id: String(product.id),
      sku: primaryVariant?.sku || product.key,
      name: product.name,
      kind: resolveKind(product),
      categoryId,
      description: product.description || "",
      image: product.primaryMediaUrl || "",
      price: (preferredPrice?.amountCents || 0) / 100,
      unit: primaryVariant?.measurementUnit?.symbol || product.unit,
      weightLabel: primaryVariant?.weightGrams ? `${primaryVariant.weightGrams / 1000} kg` : undefined,
      stockStatus: "available",
      availableFor: product.commercialModeKeys
        .map((key) => checkoutModeByCatalogMode[key])
        .filter((mode): mode is ClientCheckoutProductExperience => Boolean(mode)),
      planTiers: ["basic", "premium", "pro"],
      tags: product.categories.map((category) => category.key),
    };
  });
  return {
    categories: [...categories.values()].sort((left, right) => left.order - right.order),
    products: mappedProducts,
  };
}
