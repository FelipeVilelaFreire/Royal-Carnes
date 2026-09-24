import type { CategoryBase, ProductBase } from "../../../shared-core";
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

export function mapCheckoutCatalog(products: ProductBase[], catalogCategories: CategoryBase[] = []) {
  const categoryById = new Map(catalogCategories.map((category) => [String(category.id), category]));
  const categories = new Map<string, ClientCheckoutProductCategory>(
    catalogCategories
      .filter((category) => category.isActive)
      .map((category) => [category.key, {
        id: category.key,
        name: category.name,
        kind: "meat" as ClientCheckoutProductKind,
        description: "",
        image: "",
        order: category.sortOrder,
        parentId: category.parentId ? String(category.parentId) : null,
      }]),
  );
  const mappedProducts = products.map((product): ClientCheckoutProduct => {
    const primaryCategory = product.categories.find((category) => category.key === product.primaryCategoryKey) || product.categories[0];
    const categoryId = primaryCategory?.key || "all";
    product.categories.forEach((category) => {
      if (categories.has(category.key)) return;
      categories.set(category.key, {
        id: category.key,
        name: category.name,
        kind: resolveKind(product),
        description: "",
        image: "",
        order: category.sortOrder,
        parentId: category.parentId ? String(category.parentId) : null,
      });
    });
    const categoryKeys = product.categories.flatMap((category) => {
      const keys = [category.key];
      let parentId = category.parentId ? String(category.parentId) : null;
      while (parentId) {
        const parent = categoryById.get(parentId);
        if (!parent) break;
        keys.push(parent.key);
        parentId = parent.parentId ? String(parent.parentId) : null;
      }
      return keys;
    });
    const preferredPrice = product.prices.find((price) => price.commercialModeKey === "delivery") || product.prices[0];
    const primaryVariant = product.variants.find((variant) => variant.isActive) || product.variants[0];
    return {
      id: String(product.id),
      productKey: product.key,
      variantSku: primaryVariant?.sku,
      sku: primaryVariant?.sku || product.key,
      name: product.name,
      kind: resolveKind(product),
      categoryId,
      description: product.description || "",
      // Keep the checkout visual identity aligned with Catalogo: some products
      // expose their photo only through the media collection, not primaryMediaUrl.
      image: product.primaryMediaUrl || product.media[0]?.url || "",
      price: (preferredPrice?.amountCents || 0) / 100,
      unit: primaryVariant?.measurementUnit?.symbol || product.unit,
      weightLabel: primaryVariant?.weightGrams ? `${primaryVariant.weightGrams / 1000} kg` : undefined,
      stockStatus: "available",
      availableFor: product.commercialModeKeys
        .map((key) => checkoutModeByCatalogMode[key])
        .filter((mode): mode is ClientCheckoutProductExperience => Boolean(mode)),
      planTiers: ["basic", "premium", "pro"],
      tags: [...new Set(categoryKeys)],
    };
  });
  return {
    categories: [...categories.values()].sort((left, right) => left.order - right.order),
    products: mappedProducts,
  };
}
