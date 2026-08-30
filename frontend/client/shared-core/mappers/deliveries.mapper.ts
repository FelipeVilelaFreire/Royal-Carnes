import type {
  ClientDeliveryConfigDto,
  ClientDeliveryConfirmationDto,
  ClientDeliveryDto,
  ClientDeliveryPackageDto,
  ClientDeliveryStatusDto,
  ClientDeliveryStatusHistoryDto,
} from "../contracts/deliveries.contract";
import type {
  DeliveryBase,
  DeliveryConfigBase,
  DeliveryConfirmationBase,
  DeliveryPackageBase,
  DeliveryStatusBase,
  DeliveryStatusHistoryBase,
} from "../../../shared-core";

export function mapClientDeliveryStatusDto(
  dto: ClientDeliveryStatusDto,
): DeliveryStatusBase {
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

export function mapClientDeliveryConfigDto(
  dto: ClientDeliveryConfigDto,
): DeliveryConfigBase {
  return {
    statuses: (dto.statuses || []).map(mapClientDeliveryStatusDto),
  };
}

export function mapClientDeliveryPackageDto(
  dto: ClientDeliveryPackageDto,
): DeliveryPackageBase {
  return {
    id: dto.id,
    label: dto.label ?? "",
    packageType: dto.package_type ?? "",
    weightGrams: dto.weight_grams ?? null,
    metadata: dto.metadata || {},
  };
}

export function mapClientDeliveryStatusHistoryDto(
  dto: ClientDeliveryStatusHistoryDto,
): DeliveryStatusHistoryBase {
  return {
    id: dto.id,
    fromStatusKey: dto.from_status_key ?? "",
    toStatusKey: dto.to_status_key,
    note: dto.note ?? "",
    actorEmail: dto.actor_email ?? null,
    createdAt: dto.created_at,
  };
}

export function mapClientDeliveryConfirmationDto(
  dto: ClientDeliveryConfirmationDto,
): DeliveryConfirmationBase {
  return {
    id: dto.id,
    confirmationType: dto.confirmation_type,
    confirmedBy: dto.confirmed_by ?? "",
    note: dto.note ?? "",
    actorEmail: dto.actor_email ?? null,
    createdAt: dto.created_at,
  };
}

export function mapClientDeliveryDto(dto: ClientDeliveryDto): DeliveryBase {
  return {
    id: dto.id,
    code: dto.code,
    orderId: dto.order_id,
    orderCode: dto.order_code,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    addressId: dto.address_id ?? null,
    statusKey: dto.status_key,
    confirmationCode: dto.confirmation_code ?? "",
    addressSnapshot: dto.address_snapshot || {},
    notes: dto.notes ?? "",
    metadata: dto.metadata || {},
    packages: (dto.packages || []).map(mapClientDeliveryPackageDto),
    statusHistory: (dto.status_history || []).map(mapClientDeliveryStatusHistoryDto),
    confirmation: dto.confirmation
      ? mapClientDeliveryConfirmationDto(dto.confirmation)
      : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
