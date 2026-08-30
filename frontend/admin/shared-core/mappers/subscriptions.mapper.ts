import type {
  AdminPlanCreateDto,
  AdminPlanDto,
  AdminPlanEntitlementDto,
  AdminPlanFormInput,
  AdminPlanPriceDto,
  AdminSubscriptionCreateDto,
  AdminSubscriptionCycleDto,
  AdminSubscriptionCycleItemDto,
  AdminSubscriptionDto,
  AdminSubscriptionFormInput,
} from "../contracts/subscriptions.contract";
import type {
  PlanBase,
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

export function mapAdminPlanDto(dto: AdminPlanDto): PlanBase {
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
    cycles: (dto.cycles || []).map(mapAdminSubscriptionCycleDto),
  };
}

export function mapAdminPlanFormInput(input: AdminPlanFormInput): AdminPlanCreateDto {
  return {
    key: input.key,
    name: input.name,
    description: input.description,
    billing_interval: input.billingInterval,
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
  };
}
