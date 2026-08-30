import type {
  AdminDeliveryConfigDto,
  AdminDeliveryConfirmDto,
  AdminDeliveryConfirmInput,
  AdminDeliveryConfirmationDto,
  AdminDeliveryCreateDto,
  AdminDeliveryCreateInput,
  AdminDeliveryDto,
  AdminDeliveryPackageDto,
  AdminDeliveryStatusDto,
  AdminDeliveryStatusHistoryDto,
  AdminDeliveryTransitionDto,
  AdminDeliveryTransitionInput,
} from "../contracts/deliveries.contract";
import type {
  DeliveryBase,
  DeliveryConfigBase,
  DeliveryConfirmationBase,
  DeliveryPackageBase,
  DeliveryStatusBase,
  DeliveryStatusHistoryBase,
} from "../../../shared-core";

export function mapAdminDeliveryStatusDto(
  dto: AdminDeliveryStatusDto,
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

export function mapAdminDeliveryConfigDto(
  dto: AdminDeliveryConfigDto,
): DeliveryConfigBase {
  return {
    statuses: (dto.statuses || []).map(mapAdminDeliveryStatusDto),
  };
}

export function mapAdminDeliveryPackageDto(
  dto: AdminDeliveryPackageDto,
): DeliveryPackageBase {
  return {
    id: dto.id,
    label: dto.label ?? "",
    packageType: dto.package_type ?? "",
    weightGrams: dto.weight_grams ?? null,
    metadata: dto.metadata || {},
  };
}

export function mapAdminDeliveryStatusHistoryDto(
  dto: AdminDeliveryStatusHistoryDto,
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

export function mapAdminDeliveryConfirmationDto(
  dto: AdminDeliveryConfirmationDto,
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

export function mapAdminDeliveryDto(dto: AdminDeliveryDto): DeliveryBase {
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
    packages: (dto.packages || []).map(mapAdminDeliveryPackageDto),
    statusHistory: (dto.status_history || []).map(mapAdminDeliveryStatusHistoryDto),
    confirmation: dto.confirmation
      ? mapAdminDeliveryConfirmationDto(dto.confirmation)
      : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapAdminDeliveryCreateInput(
  input: AdminDeliveryCreateInput,
): AdminDeliveryCreateDto {
  return {
    order_id: input.orderId,
    code_sequence_key: input.codeSequenceKey,
    confirmation_code: input.confirmationCode,
    notes: input.notes,
  };
}

export function mapAdminDeliveryTransitionInput(
  input: AdminDeliveryTransitionInput,
): AdminDeliveryTransitionDto {
  return {
    status_key: input.statusKey,
    note: input.note,
  };
}

export function mapAdminDeliveryConfirmInput(
  input: AdminDeliveryConfirmInput,
): AdminDeliveryConfirmDto {
  return {
    confirmation_type: input.confirmationType,
    confirmed_by: input.confirmedBy,
    note: input.note,
  };
}
