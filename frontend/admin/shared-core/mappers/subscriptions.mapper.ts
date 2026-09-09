import type {
  AdminPlanCreateDto,
  AdminPlanDto,
  AdminPlanEntitlementDto,
  AdminPlanFormInput,
  AdminPlanPriceDto,
  AdminPlanSubscriberDto,
  AdminPlanSubscriberView,
  AdminPlanView,
  AdminSubscriptionCreateDto,
  AdminSubscriptionCycleDto,
  AdminSubscriptionCycleItemDto,
  AdminSubscriptionDto,
  AdminSubscriptionFormInput,
  AdminSubscriptionUpdateDto,
  AdminSubscriptionUpdateInput,
} from "../contracts/subscriptions.contract";
import type {
  PlanEntitlementBase,
  PlanPriceBase,
  SubscriptionBase,
  SubscriptionCycleBase,
  SubscriptionCycleItemBase,
} from "../../../shared-core";

function mapAdminPlanPriceDto(dto: AdminPlanPriceDto): PlanPriceBase {
  return {
    id: dto.id,
    currency: dto.currency,
    amountCents: dto.amount_cents,
    billingInterval: dto.billing_interval,
    billingIntervalCount: dto.billing_interval_count,
    priceType: dto.price_type,
  };
}

function mapAdminPlanEntitlementDto(dto: AdminPlanEntitlementDto): PlanEntitlementBase {
  return {
    id: dto.id,
    key: dto.key,
    targetType: dto.target_type,
    targetKey: dto.target_key ?? null,
    targetName: dto.target_name ?? null,
    quantity: String(dto.quantity),
    measurementUnitKey: dto.measurement_unit_key ?? null,
    measurementUnitSymbol: dto.measurement_unit_symbol ?? null,
    constraints: dto.constraints || {},
    sortOrder: dto.sort_order ?? 0,
  };
}

function mapAdminPlanSubscriberDto(dto: AdminPlanSubscriberDto): AdminPlanSubscriberView {
  return {
    id: dto.id,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    status: dto.status,
    startedAt: dto.started_at,
    currentCycleEndsAt: dto.current_cycle_ends_at ?? null,
  };
}

export function mapAdminPlanDto(dto: AdminPlanDto): AdminPlanView {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    description: dto.description ?? null,
    status: dto.status,
    billingInterval: dto.billing_interval,
    trialDays: dto.trial_days ?? 0,
    sortOrder: dto.sort_order ?? 0,
    prices: (dto.prices || []).map(mapAdminPlanPriceDto),
    entitlements: (dto.entitlements || []).map(mapAdminPlanEntitlementDto),
    subscriberCount: dto.subscriber_count ?? 0,
    activeSubscriberCount: dto.active_subscriber_count ?? 0,
    subscribers: (dto.subscribers || []).map(mapAdminPlanSubscriberDto),
  };
}

export function mapAdminSubscriptionCycleItemDto(
  dto: AdminSubscriptionCycleItemDto,
): SubscriptionCycleItemBase {
  return {
    id: dto.id,
    entitlementKey: dto.entitlement_key,
    productKey: dto.product_key ?? null,
    variantSku: dto.variant_sku ?? null,
    quantity: String(dto.quantity),
    measurementUnitKey: dto.measurement_unit_key ?? null,
    status: dto.status,
  };
}

export function mapAdminSubscriptionCycleDto(
  dto: AdminSubscriptionCycleDto,
): SubscriptionCycleBase {
  return {
    id: dto.id,
    cycleNumber: dto.cycle_number,
    status: dto.status,
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    closedAt: dto.closed_at ?? null,
    items: (dto.items || []).map(mapAdminSubscriptionCycleItemDto),
  };
}

export function mapAdminSubscriptionDto(dto: AdminSubscriptionDto): SubscriptionBase {
  return {
    id: dto.id,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    plan: mapAdminPlanDto(dto.plan),
    status: dto.status,
    startedAt: dto.started_at,
    endedAt: dto.ended_at ?? null,
    currentCycleStartsAt: dto.current_cycle_starts_at ?? null,
    currentCycleEndsAt: dto.current_cycle_ends_at ?? null,
    cancelledAt: dto.cancelled_at ?? null,
    cancelReason: dto.cancel_reason ?? null,
    defaultDeliveryAddressId: dto.default_delivery_address_id ?? null,
    preferredDeliveryDay: dto.preferred_delivery_day || "",
    deliveryWindow: dto.delivery_window || "",
    deliveryPreferences: dto.delivery_preferences || "",
    internalNotes: dto.internal_notes || "",
    cycles: (dto.cycles || []).map(mapAdminSubscriptionCycleDto),
  };
}

export function mapAdminPlanFormInput(input: AdminPlanFormInput): AdminPlanCreateDto {
  return {
    key: input.key,
    name: input.name,
    description: input.description,
    status: input.status,
    billing_interval: input.billingInterval,
    trial_days: input.trialDays,
    sort_order: input.sortOrder,
    price_cents: input.priceCents,
    entitlements: input.entitlements?.map((entitlement) => ({
      key: entitlement.key,
      target_type: entitlement.targetType,
      target_key: entitlement.targetKey,
      quantity: entitlement.quantity,
      measurement_unit_key: entitlement.measurementUnitKey,
      constraints: entitlement.constraints,
      sort_order: entitlement.sortOrder,
    })),
  };
}

export function mapAdminSubscriptionFormInput(
  input: AdminSubscriptionFormInput,
): AdminSubscriptionCreateDto {
  return {
    customer_id: input.customerId,
    plan_key: input.planKey,
    status: input.status,
    started_at: input.startedAt,
    default_delivery_address_id: input.defaultDeliveryAddressId,
    preferred_delivery_day: input.preferredDeliveryDay,
    delivery_window: input.deliveryWindow,
    delivery_preferences: input.deliveryPreferences,
    internal_notes: input.internalNotes,
  };
}

export function mapAdminSubscriptionUpdateInput(
  input: AdminSubscriptionUpdateInput,
): AdminSubscriptionUpdateDto {
  return {
    plan_key: input.planKey,
    status: input.status,
    started_at: input.startedAt,
    ended_at: input.endedAt,
    current_cycle_starts_at: input.currentCycleStartsAt,
    current_cycle_ends_at: input.currentCycleEndsAt,
    cancelled_at: input.cancelledAt,
    cancel_reason: input.cancelReason,
    default_delivery_address_id: input.defaultDeliveryAddressId,
    preferred_delivery_day: input.preferredDeliveryDay,
    delivery_window: input.deliveryWindow,
    delivery_preferences: input.deliveryPreferences,
    internal_notes: input.internalNotes,
  };
}
