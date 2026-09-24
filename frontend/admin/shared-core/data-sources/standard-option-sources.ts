import { normalizeApiError, type ApiClientConfig } from "../../../shared-core";
import { createAdminCatalogApi } from "../api/catalog.api";
import { createAdminCustomersApi } from "../api/customers.api";
import { createAdminDeliveriesApi } from "../api/deliveries.api";
import { createAdminInventoryApi } from "../api/inventory.api";
import { createAdminOrdersApi } from "../api/orders.api";
import { createAdminSubscriptionsApi } from "../api/subscriptions.api";
import type { AdminStandardFieldOption } from "../view-models/standard.view-model";
import type { AdminStandardOptionSourceResult } from "./standard-data-source.types";

function resolveStatusOptionPresentation(metadata: unknown) {
  const presentation = metadata && typeof metadata === "object"
    ? (metadata as Record<string, unknown>).ui
    : null;
  if (!presentation || typeof presentation !== "object") return {};
  const { statusColor, statusTone } = presentation as Record<string, unknown>;
  return {
    statusColor: typeof statusColor === "string" ? statusColor : undefined,
    statusTone: statusTone === "danger" || statusTone === "neutral" || statusTone === "primary" || statusTone === "success" || statusTone === "warning"
      ? statusTone
      : undefined,
  };
}

async function loadCapacityTargetOptions(
  apiConfig: ApiClientConfig,
  options: { parentCategoriesOnly?: boolean } = {},
): Promise<AdminStandardFieldOption[]> {
  const api = createAdminCatalogApi(apiConfig);
  const [categories, products] = await Promise.all([api.listCategories(), api.listProducts()]);
  const categoryById = new Map(categories.map((category) => [String(category.id), category]));
  const pathFor = (categoryId: string | number | null | undefined) => {
    const names: string[] = [];
    let category = categoryId ? categoryById.get(String(categoryId)) : undefined;
    while (category) {
      names.unshift(category.name);
      category = category.parentId ? categoryById.get(String(category.parentId)) : undefined;
    }
    return names;
  };
  const unitsByCategory = new Map(categories.map((category) => [String(category.id), new Set<string>()]));
  products.forEach((product) => {
    product.categories.forEach((productCategory) => {
      let category = categoryById.get(String(productCategory.id));
      while (category) {
        unitsByCategory.get(String(category.id))?.add(product.unit);
        category = category.parentId ? categoryById.get(String(category.parentId)) : undefined;
      }
    });
  });
  const categoryOptions = categories.flatMap((category) => {
    if (options.parentCategoriesOnly && category.parentId) return [];
    const units = [...(unitsByCategory.get(String(category.id)) || [])];
    if (units.length !== 1) return [];
    const hierarchyLabel = pathFor(category.id).join(" / ");
    return [{
      label: hierarchyLabel,
      meta: { hierarchyLabel, measurementUnitKey: units[0], targetType: "category" },
      value: category.key,
    }];
  });
  const productOptions = options.parentCategoriesOnly ? [] : products.map((product) => {
    const category = product.categories.find((candidate) => candidate.key === product.primaryCategoryKey)
      || product.categories[0];
    const hierarchyLabel = [...pathFor(category?.id), product.name].join(" / ");
    return {
      label: hierarchyLabel,
      meta: { hierarchyLabel, measurementUnitKey: product.unit, targetType: "product" },
      value: product.key,
    };
  });
  return [...categoryOptions, ...productOptions];
}

const adminStandardOptionSourceLoaders = {
  capacidadeAlvos: loadCapacityTargetOptions,
  capacidadeAlvosPai: async (apiConfig: ApiClientConfig) => loadCapacityTargetOptions(apiConfig, { parentCategoriesOnly: true }),
  categorias: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> => {
    const categories = await createAdminCatalogApi(apiConfig).listCategories();
    const byId = new Map(categories.map((category) => [String(category.id), category]));
    const labelFor = (category: typeof categories[number]) => {
      const names = [category.name];
      let parent = category.parentId ? byId.get(String(category.parentId)) : undefined;
      while (parent) {
        names.unshift(parent.name);
        parent = parent.parentId ? byId.get(String(parent.parentId)) : undefined;
      }
      return names.join(" / ");
    };
    return categories.map((category) => ({ label: labelFor(category), value: category.key }));
  },
  colecoes: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listAdminCollections()).map((collection) => ({
      label: collection.name,
      value: collection.key,
    })),
  clientes: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCustomersApi(apiConfig).list()).map((customer) => ({
      label: customer.name,
      value: String(customer.id),
    })),
  enderecos: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCustomersApi(apiConfig).list()).flatMap((customer) =>
      customer.addresses.map((address) => ({
        label: [
          customer.name,
          address.label || address.street,
          [address.street, address.number, address.city, address.state].filter(Boolean).join(", "),
        ].filter(Boolean).join(" - "),
        value: String(address.id),
      })),
    ),
  planos: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminSubscriptionsApi(apiConfig).listPlans()).map((plan) => ({
      label: plan.name,
      value: plan.key,
    })),
  assinaturas: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminSubscriptionsApi(apiConfig).listSubscriptions()).map((subscription) => ({
      label: [subscription.customerName, subscription.plan.name].filter(Boolean).join(" - "),
      value: String(subscription.id),
    })),
  ciclosAssinatura: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminSubscriptionsApi(apiConfig).listSubscriptions()).flatMap((subscription) =>
      subscription.cycles.map((cycle) => ({
        label: [
          subscription.customerName,
          subscription.plan.name,
          String(cycle.cycleNumber),
        ].filter(Boolean).join(" - "),
        meta: {
          customerId: subscription.customerId,
          subscriptionId: subscription.id,
        },
        value: String(cycle.id),
      })),
    ),
  pedidos: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminOrdersApi(apiConfig).list()).map((order) => ({
      label: [order.code, order.customerName].filter(Boolean).join(" - "),
      meta: {
        customerId: order.customerId,
        subscriptionId: order.subscriptionId,
      },
      value: String(order.id),
    })),
  tiposPedido: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminOrdersApi(apiConfig).config()).kinds.map((kind) => ({
      label: kind.label,
      meta: {
        commercialModeKey: kind.commercialModeKey,
        createsDelivery: kind.createsDelivery,
        requiresInventory: kind.requiresInventory,
      },
      value: kind.key,
    })),
  tiposPedidoCriacaoManual: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminOrdersApi(apiConfig).config()).kinds
      .filter((kind) => kind.commercialModeKey !== "box")
      .map((kind) => ({
        label: kind.label,
        meta: {
          commercialModeKey: kind.commercialModeKey,
          createsDelivery: kind.createsDelivery,
          requiresInventory: kind.requiresInventory,
        },
        value: kind.key,
      })),
  orderStatuses: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminOrdersApi(apiConfig).config()).statuses.map((status) => ({
      label: status.label,
      meta: resolveStatusOptionPresentation(status.metadata),
      value: status.key,
    })),
  deliveryStatuses: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminDeliveriesApi(apiConfig).config()).statuses.map((status) => ({
      label: status.label,
      meta: { ...resolveStatusOptionPresentation(status.metadata), allowedNextKeys: status.allowedNextKeys },
      value: status.key,
    })),
  produtos: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listProducts()).map((product) => ({
      label: product.name,
      meta: {
        description: product.unit,
        imageAlt: product.name,
        imageSrc: product.primaryMediaUrl || "",
        measurementUnitKey: product.unit,
      },
      value: product.key,
    })),
  produtosPedido: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> => {
    const [products, inventoryItems] = await Promise.all([
      createAdminCatalogApi(apiConfig).listProducts(),
      createAdminInventoryApi(apiConfig).listItems(),
    ]);

    return products.map((product) => {
      const variants = (product.variants || []).filter((variant) => variant.isActive !== false);
      const defaultVariant = variants.find((variant) => (
        (variant.measurementUnitKey || variant.unit) === product.unit
        && Number(variant.unitQuantity ?? 1) === 1
      )) || variants[0];
      const inventoryItem = inventoryItems.find((item) => (
        item.productKey === product.key
        && (defaultVariant
          ? item.variantSku === defaultVariant.sku
          : !item.variantSku)
      ));

      return {
        label: product.name,
        meta: {
          description: product.unit,
          imageAlt: product.name,
          imageSrc: product.primaryMediaUrl || "",
          maxQuantity: inventoryItem?.sellableQuantity,
          measurementUnitKey: product.unit,
          variantSku: defaultVariant?.sku,
        },
        value: product.key,
      };
    });
  },
  variantes: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listProducts()).flatMap((product) =>
      product.variants.map((variant) => ({
        label: `${product.name} - ${variant.name}`,
        meta: { measurementUnitKey: variant.measurementUnit?.key || variant.unit },
        value: variant.sku || String(variant.id),
      })),
    ),
  commercialModes: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listCommercialModes()).map((mode) => ({
      label: mode.name,
      value: mode.key,
    })),
  unidades: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listMeasurementUnits()).map((unit) => ({
      label: unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name || unit.key || "",
      value: unit.key || "",
    })),
};

export type AdminStandardOptionSourceScope = "detail" | "form" | "list";

function collectFieldSources(
  entityConfig: any,
  scope: AdminStandardOptionSourceScope,
): string[] {
  const sourceSet = new Set<string>();
  const addFieldSources = (fields: any[] = []) => {
    fields.forEach((field) => {
      if (field.source) sourceSet.add(field.source);
      if (field.edit?.source) sourceSet.add(field.edit.source);
      [...(field.columns || []), ...(field.edit?.columns || [])].forEach((column: any) => {
        if (column.source) sourceSet.add(column.source);
        Object.values(column.sources || {}).forEach((source) => sourceSet.add(String(source)));
      });
    });
  };

  if (scope === "detail") {
    (entityConfig?.detailPage?.tabs || []).forEach((tab: any) => {
      addFieldSources(tab.fields || []);
      (tab.sections || []).forEach((section: any) => addFieldSources(
        section.type === "lineItems" ? [section] : section.fields || [],
      ));
    });
  }

  if (scope === "form") {
    (entityConfig?.addPage?.sections || []).forEach((section: any) => addFieldSources(section.fields || []));
    addFieldSources(entityConfig?.addPage?.fields || []);
    addFieldSources(entityConfig?.form?.fields || []);
  }

  if (scope === "list") {
    (entityConfig?.listPage?.filters || []).forEach((filter: any) => {
      if (filter.source) sourceSet.add(filter.source);
    });
  }
  return [...sourceSet];
}

export async function loadAdminStandardOptionSources(
  entityConfig: any,
  apiConfig: ApiClientConfig = {},
  options: { scope?: AdminStandardOptionSourceScope } = {},
): Promise<AdminStandardOptionSourceResult> {
  const sources = collectFieldSources(entityConfig, options.scope || "list");
  if (!sources.length) return { error: null, optionSources: {} };

  try {
    const entries = await Promise.all(
      sources.map(async (source) => {
        const loader = adminStandardOptionSourceLoaders[source as keyof typeof adminStandardOptionSourceLoaders];
        return [source, loader ? await loader(apiConfig) : []] as const;
      }),
    );
    return { error: null, optionSources: Object.fromEntries(entries) };
  } catch (err) {
    return { error: normalizeApiError(err), optionSources: {} };
  }
}
