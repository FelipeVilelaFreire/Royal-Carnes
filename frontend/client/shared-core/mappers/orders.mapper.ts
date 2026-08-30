import type {
  ClientOrderConfigDto,
  ClientOrderCreateDto,
  ClientOrderCreateInput,
  ClientOrderDto,
  ClientOrderItemCreateDto,
  ClientOrderItemDto,
  ClientOrderKindDto,
  ClientOrderStatusDto,
  ClientOrderStatusHistoryDto,
} from "../contracts/orders.contract";
import type {
  OrderBase,
  OrderConfigBase,
  OrderItemBase,
  OrderKindBase,
  OrderStatusBase,
  OrderStatusHistoryBase,
} from "../../../shared-core";

export function mapClientOrderKindDto(dto: ClientOrderKindDto): OrderKindBase {
  return {
    id: dto.id,
    key: dto.key,
    label: dto.label,
    commercialModeKey: dto.commercial_mode_key ?? null,
    codeSequenceKey: dto.code_sequence_key,
    requiresInventory: dto.requires_inventory,
    createsDelivery: dto.creates_delivery,
    isActive: dto.is_active,
    sortOrder: dto.sort_order ?? 0,
    metadata: dto.metadata || {},
  };
}

export function mapClientOrderStatusDto(dto: ClientOrderStatusDto): OrderStatusBase {
  return {
    id: dto.id,
    key: dto.key,
    label: dto.label,
    sortOrder: dto.sort_order ?? 0,
    isInitial: dto.is_initial,
    isTerminal: dto.is_terminal,
    isPublic: dto.is_public,
    allowedNextKeys: dto.allowed_next_keys || [],
    effects: dto.effects || {},
    metadata: dto.metadata || {},
  };
}

export function mapClientOrderConfigDto(dto: ClientOrderConfigDto): OrderConfigBase {
  return {
    kinds: (dto.kinds || []).map(mapClientOrderKindDto),
    statuses: (dto.statuses || []).map(mapClientOrderStatusDto),
  };
}

export function mapClientOrderItemDto(dto: ClientOrderItemDto): OrderItemBase {
  return {
    id: dto.id,
    productKey: dto.product_key,
    variantSku: dto.variant_sku ?? null,
    measurementUnitKey: dto.measurement_unit_key ?? null,
    nameSnapshot: dto.name_snapshot,
    quantity: String(dto.quantity ?? "0.000"),
    unitPriceCents: dto.unit_price_cents,
    totalCents: dto.total_cents,
    weightGrams: dto.weight_grams ?? null,
    sourceType: dto.source_type ?? "",
    sourceKey: dto.source_key ?? "",
    metadata: dto.metadata || {},
  };
}

export function mapClientOrderStatusHistoryDto(
  dto: ClientOrderStatusHistoryDto,
): OrderStatusHistoryBase {
  return {
    id: dto.id,
    fromStatusKey: dto.from_status_key ?? "",
    toStatusKey: dto.to_status_key,
    note: dto.note ?? "",
    actorEmail: dto.actor_email ?? null,
    createdAt: dto.created_at,
  };
}

export function mapClientOrderDto(dto: ClientOrderDto): OrderBase {
  return {
    id: dto.id,
    code: dto.code,
    kindKey: dto.kind_key,
    statusKey: dto.status_key,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    addressId: dto.address_id ?? null,
    subscriptionId: dto.subscription_id ?? null,
    subscriptionCycleId: dto.subscription_cycle_id ?? null,
    currency: dto.currency,
    subtotalCents: dto.subtotal_cents,
    discountCents: dto.discount_cents,
    freightCents: dto.freight_cents,
    totalCents: dto.total_cents,
    notes: dto.notes ?? "",
    metadata: dto.metadata || {},
    items: (dto.items || []).map(mapClientOrderItemDto),
    statusHistory: (dto.status_history || []).map(mapClientOrderStatusHistoryDto),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapClientOrderItemCreateInput(
  input: ClientOrderCreateInput["items"][number],
): ClientOrderItemCreateDto {
  return {
    product_key: input.productKey,
    variant_sku: input.variantSku || undefined,
    quantity: input.quantity,
    source_type: input.sourceType,
    source_key: input.sourceKey,
    metadata: input.metadata,
  };
}

export function mapClientOrderCreateInput(
  input: ClientOrderCreateInput,
): ClientOrderCreateDto {
  return {
    kind_key: input.kindKey,
    address_id: input.addressId,
    subscription_id: input.subscriptionId,
    subscription_cycle_id: input.subscriptionCycleId,
    notes: input.notes,
    items: input.items.map(mapClientOrderItemCreateInput),
  };
}
