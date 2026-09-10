import { normalizeApiError, type ApiClientConfig } from "../../../shared-core";
import { createAdminCatalogApi } from "../api/catalog.api";
import { createAdminCustomersApi } from "../api/customers.api";
import { createAdminOrdersApi } from "../api/orders.api";
import { createAdminSubscriptionsApi } from "../api/subscriptions.api";
import type { AdminStandardFieldOption } from "../view-models/standard.view-model";
import type { AdminStandardOptionSourceResult } from "./standard-data-source.types";

const adminStandardOptionSourceLoaders = {
  categorias: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listCategories()).map((category) => ({
      label: category.name,
      value: category.key,
    })),
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
  produtos: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listProducts()).map((product) => ({
      label: product.name,
      meta: {
        measurementUnitKey: product.unit,
      },
      value: product.key,
    })),
  variantes: async (apiConfig: ApiClientConfig): Promise<AdminStandardFieldOption[]> =>
    (await createAdminCatalogApi(apiConfig).listProducts()).flatMap((product) =>
      product.variants.map((variant) => ({
        label: `${product.name} - ${variant.name}`,
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

function collectFieldSources(entityConfig: any): string[] {
  const sourceSet = new Set<string>();
  const addFieldSources = (fields: any[] = []) => {
    fields.forEach((field) => {
      if (field.source) sourceSet.add(field.source);
      (field.columns || []).forEach((column: any) => {
        if (column.source) sourceSet.add(column.source);
        Object.values(column.sources || {}).forEach((source) => sourceSet.add(String(source)));
      });
    });
  };

  (entityConfig?.detailPage?.tabs || []).forEach((tab: any) => {
    addFieldSources(tab.fields || []);
    (tab.sections || []).forEach((section: any) => addFieldSources(section.fields || []));
  });
  (entityConfig?.addPage?.sections || []).forEach((section: any) => addFieldSources(section.fields || []));
  addFieldSources(entityConfig?.addPage?.fields || []);
  addFieldSources(entityConfig?.form?.fields || []);
  return [...sourceSet];
}

export async function loadAdminStandardOptionSources(
  entityConfig: any,
  apiConfig: ApiClientConfig = {},
): Promise<AdminStandardOptionSourceResult> {
  const sources = collectFieldSources(entityConfig);
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
