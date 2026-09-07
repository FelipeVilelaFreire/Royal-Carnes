import { normalizeApiError, type ApiClientConfig, type ApiErrorEnvelope } from "../../../shared-core";
import { createAdminCatalogApi } from "../api/catalog.api";
import { createAdminDeliveriesApi } from "../api/deliveries.api";
import { createAdminInventoryApi } from "../api/inventory.api";
import { createAdminOrdersApi } from "../api/orders.api";
import { createAdminSubscriptionsApi } from "../api/subscriptions.api";
import { createAdminUsersApi } from "../api/users.api";
import { createAdminCatalogViewModel } from "../view-models/catalog.view-model";
import { createAdminDeliveriesViewModel } from "../view-models/deliveries.view-model";
import { createAdminInventoryViewModel } from "../view-models/inventory.view-model";
import { createAdminOrdersViewModel } from "../view-models/orders.view-model";
import {
  createAdminPlanRowViewModel,
  createAdminSubscriptionRowViewModel,
} from "../view-models/subscriptions.view-model";
import { createAdminUsersViewModel } from "../view-models/users.view-model";

export interface AdminStandardDataSourceConfig {
  key: string;
  fallbackOnError?: boolean;
}

export interface AdminStandardDataSourceResult {
  error: ApiErrorEnvelope | null;
  isFallback: boolean;
  rows: any[] | null;
}

function mapOrderRows(rows: ReturnType<typeof createAdminOrdersViewModel>["orders"]) {
  return rows.map((row) => ({
    ...row,
    status: row.statusKey,
    summary: String(row.itemCount),
    totalFormatted: row.totalLabel,
  }));
}

function mapDeliveryRows(rows: ReturnType<typeof createAdminDeliveriesViewModel>["deliveries"]) {
  return rows.map((row) => ({
    ...row,
    planName: row.orderCode,
    scheduledDate: row.createdAt,
    status: row.statusLabel,
  }));
}

function mapProductRows(rows: ReturnType<typeof createAdminCatalogViewModel>["rows"]) {
  return rows.map((row) => ({
    ...row,
    line: row.categoryNames.join(", "),
    origin: "",
    preparation: "",
    priceFormatted: row.priceLabel || "",
    weight: String(row.variantCount),
  }));
}

function mapInventoryRows(rows: ReturnType<typeof createAdminInventoryViewModel>["items"]) {
  return rows.map((row) => ({
    ...row,
    name: row.productName,
    quantity: row.sellableQuantity,
    updatedAt: row.updatedAt,
  }));
}

export async function loadAdminStandardRows(
  dataSource: AdminStandardDataSourceConfig | undefined,
  apiConfig: ApiClientConfig = {},
): Promise<AdminStandardDataSourceResult> {
  if (!dataSource?.key) {
    return { error: null, isFallback: false, rows: null };
  }

  try {
    if (dataSource.key === "pedidos") {
      const api = createAdminOrdersApi(apiConfig);
      const [config, orders] = await Promise.all([api.config(), api.list()]);
      return {
        error: null,
        isFallback: false,
        rows: mapOrderRows(createAdminOrdersViewModel(orders, config).orders),
      };
    }

    if (dataSource.key === "deliveries") {
      const api = createAdminDeliveriesApi(apiConfig);
      const [config, deliveries] = await Promise.all([api.config(), api.list()]);
      return {
        error: null,
        isFallback: false,
        rows: mapDeliveryRows(createAdminDeliveriesViewModel(deliveries, config).deliveries),
      };
    }

    if (dataSource.key === "produtos") {
      const api = createAdminCatalogApi(apiConfig);
      const [collections, commercialModes, products] = await Promise.all([
        api.listCollections(),
        api.listCommercialModes(),
        api.listProducts(),
      ]);
      return {
        error: null,
        isFallback: false,
        rows: mapProductRows(
          createAdminCatalogViewModel({ collections, commercialModes, products }).rows,
        ),
      };
    }

    if (dataSource.key === "usuarios") {
      const users = await createAdminUsersApi(apiConfig).list();
      return {
        error: null,
        isFallback: false,
        rows: createAdminUsersViewModel(users).users,
      };
    }

    if (dataSource.key === "assinaturas") {
      const subscriptions = await createAdminSubscriptionsApi(apiConfig).listSubscriptions();
      return {
        error: null,
        isFallback: false,
        rows: subscriptions.map(createAdminSubscriptionRowViewModel),
      };
    }

    if (dataSource.key === "planos") {
      const plans = await createAdminSubscriptionsApi(apiConfig).listPlans();
      return {
        error: null,
        isFallback: false,
        rows: plans.map(createAdminPlanRowViewModel),
      };
    }

    if (dataSource.key === "estoque") {
      const items = await createAdminInventoryApi(apiConfig).listItems();
      return {
        error: null,
        isFallback: false,
        rows: mapInventoryRows(createAdminInventoryViewModel(items).items),
      };
    }

    return { error: null, isFallback: true, rows: null };
  } catch (err) {
    const error = normalizeApiError(err);
    if (dataSource.fallbackOnError) {
      return { error, isFallback: true, rows: null };
    }
    return { error, isFallback: false, rows: [] };
  }
}
