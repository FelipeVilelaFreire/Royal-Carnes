import { normalizeApiError, type ApiClientConfig } from "../../../shared-core";
import { createAdminCatalogApi } from "../api/catalog.api";
import { createAdminCustomersApi } from "../api/customers.api";
import { createAdminDeliveriesApi } from "../api/deliveries.api";
import { createAdminInventoryApi } from "../api/inventory.api";
import { createAdminOrdersApi } from "../api/orders.api";
import { createAdminPaymentsApi } from "../api/payments.api";
import { createAdminSubscriptionsApi } from "../api/subscriptions.api";
import { createAdminUsersApi } from "../api/users.api";
import type { AdminPlanFormInput } from "../contracts/subscriptions.contract";
import {
  createAdminCatalogViewModel,
  createAdminCategoryRowsViewModel,
  createAdminCollectionRowsViewModel,
} from "../view-models/catalog.view-model";
import { createAdminCustomerRowViewModel } from "../view-models/customers.view-model";
import { createAdminDeliveriesViewModel } from "../view-models/deliveries.view-model";
import { createAdminInventoryViewModel } from "../view-models/inventory.view-model";
import { createAdminOrdersViewModel } from "../view-models/orders.view-model";
import { createAdminPaymentRowViewModel } from "../view-models/payments.view-model";
import {
  createAdminPlanRowViewModel,
  createAdminSubscriptionRowViewModel,
} from "../view-models/subscriptions.view-model";
import { createAdminUsersViewModel } from "../view-models/users.view-model";
import type {
  AdminStandardDataSourceConfig,
  AdminStandardDataSourceResult,
  AdminStandardMutationResult,
} from "./standard-data-source.types";
export { loadAdminStandardOptionSources } from "./standard-option-sources";
export type {
  AdminStandardDataSourceConfig,
  AdminStandardDataSourceResult,
  AdminStandardMutationResult,
  AdminStandardOptionSourceResult,
} from "./standard-data-source.types";

function mapOrderRows(rows: ReturnType<typeof createAdminOrdersViewModel>["orders"]) {
  return rows.map((row) => ({
    ...row,
    status: row.statusKey,
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
    allCategoryLabel: row.categoryNames.join(", "),
    categoryLabel: row.primaryCategoryName,
    collectionLabel: row.collectionNames.join(", "),
    collectionKeysLabel: row.collectionKeys.join(", "),
    commercialModeLabel: row.commercialModeKeys.join(", "),
    priceFormatted: row.priceLabel || "",
    statusLabelKey: `common.status${row.status.charAt(0).toUpperCase()}${row.status.slice(1)}`,
  }));
}

function splitKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseOptionalInteger(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : undefined;
}

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function normalizeLineItems(value: unknown): Array<Record<string, any>> {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
}

function normalizePlanEntitlements(value: unknown): NonNullable<AdminPlanFormInput["entitlements"]> {
  const allowedTargetTypes = new Set(["collection", "category", "product", "variant"]);
  const entitlements: NonNullable<AdminPlanFormInput["entitlements"]> = [];
  normalizeLineItems(value)
    .map((item, index) => {
      const targetType = String(item.targetType || "product");
      const targetKey = String(item.targetKey || "");
      const quantity = String(item.quantity || "");
      if (!allowedTargetTypes.has(targetType) || !targetKey || !quantity) return null;
      return {
        constraints: item.constraints || {},
        key: item.key || `${targetType}-${targetKey}-${index + 1}`,
        measurementUnitKey: item.measurementUnitKey || undefined,
        quantity,
        sortOrder: parseOptionalInteger(item.sortOrder) ?? index,
        targetKey,
        targetType: targetType as "collection" | "category" | "product" | "variant",
      };
    })
    .forEach((item) => {
      if (item) entitlements.push(item);
    });
  return entitlements;
}

function isUploadFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

async function resolveProductImageValue(value: unknown, apiConfig: ApiClientConfig): Promise<string | null | undefined> {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (isUploadFile(value)) {
    const uploaded = await createAdminCatalogApi(apiConfig).uploadMedia(value);
    return uploaded.url;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  return undefined;
}

async function mapCatalogProductResult(
  product: Awaited<ReturnType<ReturnType<typeof createAdminCatalogApi>["detail"]>>,
  apiConfig: ApiClientConfig,
) {
  const collections = await createAdminCatalogApi(apiConfig).listCollections();
  return mapProductRows(createAdminCatalogViewModel({
    collections,
    commercialModes: [],
    products: [product],
  }).rows)[0];
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
      const deliveriesApi = createAdminDeliveriesApi(apiConfig);
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const [config, deliveryConfig, deliveries, orders, payments] = await Promise.all([
        api.config(),
        deliveriesApi.config(),
        deliveriesApi.list(),
        api.list(),
        paymentsApi.list(),
      ]);
      return {
        error: null,
        isFallback: false,
        rows: mapOrderRows(
          createAdminOrdersViewModel(orders, config, deliveries, deliveryConfig, payments).orders,
        ),
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

    if (dataSource.key === "categorias") {
      const categories = await createAdminCatalogApi(apiConfig).listAdminCategories();
      return {
        error: null,
        isFallback: false,
        rows: createAdminCategoryRowsViewModel(categories),
      };
    }

    if (dataSource.key === "colecoes") {
      const collections = await createAdminCatalogApi(apiConfig).listAdminCollections();
      return {
        error: null,
        isFallback: false,
        rows: createAdminCollectionRowsViewModel(collections),
      };
    }

    if (dataSource.key === "usuarios") {
      const users = await createAdminUsersApi(apiConfig).list();
      return {
        error: null,
        isFallback: false,
        rows: createAdminUsersViewModel(users).users.map((user) => ({
          ...user,
          statusLabelKey: user.status === "inactive" ? "common.statusInactive" : "common.statusActive",
        })),
      };
    }

    if (dataSource.key === "clientes") {
      const customers = await createAdminCustomersApi(apiConfig).list();
      return {
        error: null,
        isFallback: false,
        rows: customers.map(createAdminCustomerRowViewModel),
      };
    }

    if (dataSource.key === "assinaturas") {
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const ordersApi = createAdminOrdersApi(apiConfig);
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const [orderConfig, orders, payments, subscriptions] = await Promise.all([
        ordersApi.config(),
        ordersApi.list(),
        paymentsApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        isFallback: false,
        rows: subscriptions.map((subscription) =>
          createAdminSubscriptionRowViewModel(subscription, orders, orderConfig, payments),
        ),
      };
    }

    if (dataSource.key === "pagamentos") {
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const ordersApi = createAdminOrdersApi(apiConfig);
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const [payments, orderConfig, orders, subscriptions] = await Promise.all([
        paymentsApi.list(),
        ordersApi.config(),
        ordersApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        isFallback: false,
        rows: payments.map((payment) =>
          createAdminPaymentRowViewModel(payment, orders, orderConfig, subscriptions),
        ),
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

export async function loadAdminStandardRow(
  dataSource: AdminStandardDataSourceConfig | undefined,
  rowId: string | number | undefined,
  apiConfig: ApiClientConfig = {},
): Promise<AdminStandardMutationResult> {
  if (!dataSource?.key || rowId === undefined) {
    return { error: null, row: null };
  }

  try {
    if (dataSource.key === "clientes") {
      const customer = await createAdminCustomersApi(apiConfig).detail(rowId);
      return { error: null, row: createAdminCustomerRowViewModel(customer) };
    }

    if (dataSource.key === "produtos") {
      const product = await createAdminCatalogApi(apiConfig).detail(rowId);
      return { error: null, row: await mapCatalogProductResult(product, apiConfig) };
    }

    if (dataSource.key === "planos") {
      const plans = await createAdminSubscriptionsApi(apiConfig).listPlans();
      return { error: null, row: plans.map(createAdminPlanRowViewModel).find((row) => row.id === rowId) || null };
    }

    if (dataSource.key === "assinaturas") {
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const ordersApi = createAdminOrdersApi(apiConfig);
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const [orderConfig, orders, payments, subscriptions] = await Promise.all([
        ordersApi.config(),
        ordersApi.list(),
        paymentsApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        row:
          subscriptions
            .map((subscription) =>
              createAdminSubscriptionRowViewModel(subscription, orders, orderConfig, payments),
            )
            .find((row) => row.id === rowId) || null,
      };
    }

    if (dataSource.key === "pagamentos") {
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const ordersApi = createAdminOrdersApi(apiConfig);
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const [payments, orderConfig, orders, subscriptions] = await Promise.all([
        paymentsApi.list(),
        ordersApi.config(),
        ordersApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        row: payments
          .map((payment) => createAdminPaymentRowViewModel(payment, orders, orderConfig, subscriptions))
          .find((row) => row.id === rowId) || null,
      };
    }

    if (dataSource.key === "categorias") {
      const categories = await createAdminCatalogApi(apiConfig).listAdminCategories();
      const category = categories.find((candidate) => candidate.id === rowId) || await createAdminCatalogApi(apiConfig).categoryDetail(rowId);
      const rows = createAdminCategoryRowsViewModel(categories);
      return { error: null, row: rows.find((row) => row.id === category.id) || createAdminCategoryRowsViewModel([category])[0] };
    }

    if (dataSource.key === "pedidos") {
      const api = createAdminOrdersApi(apiConfig);
      const deliveriesApi = createAdminDeliveriesApi(apiConfig);
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const [config, deliveryConfig, deliveries, order, payments] = await Promise.all([
        api.config(),
        deliveriesApi.config(),
        deliveriesApi.list(),
        api.detail(rowId),
        paymentsApi.list(),
      ]);
      return {
        error: null,
        row: mapOrderRows(
          createAdminOrdersViewModel([order], config, deliveries, deliveryConfig, payments).orders,
        )[0],
      };
    }

    return { error: null, row: null };
  } catch (err) {
    return { error: normalizeApiError(err), row: null };
  }
}

export async function createAdminStandardRow(
  dataSource: AdminStandardDataSourceConfig | undefined,
  values: Record<string, any>,
  apiConfig: ApiClientConfig = {},
): Promise<AdminStandardMutationResult> {
  if (!dataSource?.key) {
    return { error: null, row: null };
  }

  try {
    if (dataSource.key === "clientes") {
      const customer = await createAdminCustomersApi(apiConfig).create({
        document: values.document,
        email: values.email,
        name: values.name,
        phone: values.phone,
      });
      return { error: null, row: createAdminCustomerRowViewModel(customer) };
    }

    if (dataSource.key === "produtos") {
      const image = await resolveProductImageValue(values.image, apiConfig);
      const product = await createAdminCatalogApi(apiConfig).create({
        categoryKeys: splitKeys(values.categoryKeys),
        collectionKeys: splitKeys(values.collectionKeys),
        commercialModeKeys: splitKeys(values.commercialModeKeys),
        description: values.description,
        image,
        key: values.key,
        name: values.name,
        priceCents: parseOptionalInteger(values.priceCents),
        status: values.status || "active",
        unit: values.unit || undefined,
      });
      return { error: null, row: await mapCatalogProductResult(product, apiConfig) };
    }

    if (dataSource.key === "planos") {
      const plan = await createAdminSubscriptionsApi(apiConfig).createPlan({
        billingInterval: values.billingInterval || "month",
        description: values.description,
        entitlements: normalizePlanEntitlements(values.entitlements),
        key: values.key,
        name: values.name,
        priceCents: parseOptionalInteger(values.priceCents),
        sortOrder: parseOptionalInteger(values.sortOrder),
        status: values.status || "active",
        trialDays: parseOptionalInteger(values.trialDays),
      });
      return { error: null, row: createAdminPlanRowViewModel(plan) };
    }

    if (dataSource.key === "assinaturas") {
      const subscription = await createAdminSubscriptionsApi(apiConfig).createSubscription({
        customerId: values.customerId,
        defaultDeliveryAddressId: values.defaultDeliveryAddressId || null,
        deliveryPreferences: values.deliveryPreferences,
        deliveryWindow: values.deliveryWindow,
        internalNotes: values.internalNotes,
        planKey: values.planKey,
        preferredDeliveryDay: values.preferredDeliveryDay,
        startedAt: values.startedAt || undefined,
        status: values.status || "active",
      });
      return { error: null, row: createAdminSubscriptionRowViewModel(subscription) };
    }

    if (dataSource.key === "pagamentos") {
      const payment = await createAdminPaymentsApi(apiConfig).create({
        amountCents: parseOptionalInteger(values.amountCents) ?? 0,
        currency: values.currency || "BRL",
        customerId: values.customerId,
        dueAt: values.dueAt || undefined,
        notes: values.notes,
        orderId: values.orderId || null,
        paidAt: values.paidAt || undefined,
        reference: values.reference,
        status: values.status || "pending",
        subscriptionId: values.subscriptionId || null,
      });
      const ordersApi = createAdminOrdersApi(apiConfig);
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const [orderConfig, orders, subscriptions] = await Promise.all([
        ordersApi.config(),
        ordersApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        row: createAdminPaymentRowViewModel(payment, orders, orderConfig, subscriptions),
      };
    }

    if (dataSource.key === "categorias") {
      const api = createAdminCatalogApi(apiConfig);
      const category = await api.createCategory({
        isActive: parseOptionalBoolean(values.isActive) ?? true,
        key: values.key,
        name: values.name,
        parentKey: values.parentKey || undefined,
        sortOrder: parseOptionalInteger(values.sortOrder),
      });
      const categories = await api.listAdminCategories();
      return {
        error: null,
        row: createAdminCategoryRowsViewModel(categories).find((row) => row.id === category.id) || createAdminCategoryRowsViewModel([category])[0],
      };
    }

    if (dataSource.key === "pedidos") {
      const order = await createAdminOrdersApi(apiConfig).create({
        addressId: values.addressId || null,
        customerId: values.customerId,
        items: normalizeLineItems(values.items).map((item) => ({
          metadata: item.metadata || {},
          productKey: item.productKey,
          quantity: item.quantity,
          sourceKey: item.sourceKey || undefined,
          sourceType: item.sourceType || undefined,
          variantSku: item.variantSku || undefined,
        })),
        kindKey: values.kindKey,
        notes: values.notes,
        subscriptionCycleId: values.subscriptionCycleId || null,
        subscriptionId: values.subscriptionId || null,
      });
      const ordersApi = createAdminOrdersApi(apiConfig);
      const deliveriesApi = createAdminDeliveriesApi(apiConfig);
      const paymentsApi = createAdminPaymentsApi(apiConfig);
      const [config, deliveryConfig, deliveries, payments] = await Promise.all([
        ordersApi.config(),
        deliveriesApi.config(),
        deliveriesApi.list(),
        paymentsApi.list(),
      ]);
      return {
        error: null,
        row: mapOrderRows(
          createAdminOrdersViewModel([order], config, deliveries, deliveryConfig, payments).orders,
        )[0],
      };
    }

    return { error: null, row: null };
  } catch (err) {
    return { error: normalizeApiError(err), row: null };
  }
}

export async function updateAdminStandardRow(
  dataSource: AdminStandardDataSourceConfig | undefined,
  rowId: string | number | undefined,
  values: Record<string, any>,
  apiConfig: ApiClientConfig = {},
): Promise<AdminStandardMutationResult> {
  if (!dataSource?.key || rowId === undefined) {
    return { error: null, row: null };
  }

  try {
    if (dataSource.key === "clientes") {
      const customer = await createAdminCustomersApi(apiConfig).update(rowId, {
        document: values.document,
        email: values.email,
        name: values.name,
        phone: values.phone,
        status: values.status,
      });
      return { error: null, row: createAdminCustomerRowViewModel(customer) };
    }

    if (dataSource.key === "produtos") {
      const image = await resolveProductImageValue(values.image, apiConfig);
      const product = await createAdminCatalogApi(apiConfig).update(rowId, {
        categoryKeys: values.categoryKeys === undefined ? undefined : splitKeys(values.categoryKeys),
        collectionKeys: values.collectionKeys === undefined ? undefined : splitKeys(values.collectionKeys),
        commercialModeKeys: values.commercialModeKeys === undefined ? undefined : splitKeys(values.commercialModeKeys),
        description: values.description,
        image,
        key: values.key,
        name: values.name,
        priceCents: parseOptionalInteger(values.priceCents),
        status: values.status,
        unit: values.unit,
      });
      return { error: null, row: await mapCatalogProductResult(product, apiConfig) };
    }

    if (dataSource.key === "planos") {
      const plans = await createAdminSubscriptionsApi(apiConfig).listPlans();
      const currentPlan = plans.find((plan) => plan.id === rowId);
      if (!currentPlan) return { error: null, row: null };
      const plan = await createAdminSubscriptionsApi(apiConfig).createPlan({
        billingInterval: values.billingInterval || currentPlan.billingInterval || "month",
        description: values.description ?? currentPlan.description ?? undefined,
        key: currentPlan.key,
        name: values.name || currentPlan.name,
        entitlements: normalizePlanEntitlements(values.entitlements ?? currentPlan.entitlements),
        priceCents: parseOptionalInteger(values.priceCents),
        sortOrder: parseOptionalInteger(values.sortOrder) ?? currentPlan.sortOrder,
        status: values.status || currentPlan.status || "active",
        trialDays: parseOptionalInteger(values.trialDays) ?? currentPlan.trialDays,
      });
      return { error: null, row: createAdminPlanRowViewModel(plan) };
    }

    if (dataSource.key === "assinaturas") {
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const ordersApi = createAdminOrdersApi(apiConfig);
      const subscription = await subscriptionsApi.updateSubscription(rowId, {
        cancelReason: values.cancelReason,
        cancelledAt: values.cancelledAtInput || undefined,
        currentCycleEndsAt: values.currentCycleEndsAtInput || undefined,
        currentCycleStartsAt: values.currentCycleStartsAtInput || undefined,
        defaultDeliveryAddressId: values.defaultDeliveryAddressId || null,
        deliveryPreferences: values.deliveryPreferences,
        deliveryWindow: values.deliveryWindow,
        endedAt: values.endedAtInput || undefined,
        internalNotes: values.internalNotes,
        planKey: values.planKey,
        preferredDeliveryDay: values.preferredDeliveryDay,
        startedAt: values.startedAtInput || undefined,
        status: values.status,
      });
      const [orderConfig, orders] = await Promise.all([ordersApi.config(), ordersApi.list()]);
      return {
        error: null,
        row: createAdminSubscriptionRowViewModel(subscription, orders, orderConfig),
      };
    }

    if (dataSource.key === "pagamentos") {
      const payment = await createAdminPaymentsApi(apiConfig).update(rowId, {
        amountCents: parseOptionalInteger(values.amountCents),
        currency: values.currency,
        dueAt: values.dueAtInput || undefined,
        notes: values.notes,
        paidAt: values.paidAtInput || undefined,
        reference: values.reference,
        status: values.status,
      });
      const ordersApi = createAdminOrdersApi(apiConfig);
      const subscriptionsApi = createAdminSubscriptionsApi(apiConfig);
      const [orderConfig, orders, subscriptions] = await Promise.all([
        ordersApi.config(),
        ordersApi.list(),
        subscriptionsApi.listSubscriptions(),
      ]);
      return {
        error: null,
        row: createAdminPaymentRowViewModel(payment, orders, orderConfig, subscriptions),
      };
    }

    return { error: null, row: null };
  } catch (err) {
    return { error: normalizeApiError(err), row: null };
  }
}
