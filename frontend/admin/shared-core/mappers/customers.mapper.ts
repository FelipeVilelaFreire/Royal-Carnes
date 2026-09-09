import type {
  AdminCustomerAddressDto,
  AdminCustomerAddressView,
  AdminCustomerCreateDto,
  AdminCustomerCreateInput,
  AdminCustomerDto,
  AdminCustomerUpdateDto,
  AdminCustomerUpdateInput,
  AdminCustomerView,
} from "../contracts/customers.contract";

export function mapAdminCustomerAddressDto(
  dto: AdminCustomerAddressDto,
): AdminCustomerAddressView {
  return {
    id: dto.id,
    label: dto.label || "",
    recipientName: dto.recipient_name || "",
    postalCode: dto.postal_code || "",
    street: dto.street,
    number: dto.number || "",
    complement: dto.complement || "",
    district: dto.district || "",
    city: dto.city,
    state: dto.state,
    country: dto.country,
    isDefault: dto.is_default,
    deliveryInstructions: dto.delivery_instructions || "",
  };
}

export function mapAdminCustomerDto(dto: AdminCustomerDto): AdminCustomerView {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email || "",
    phone: dto.phone || "",
    document: dto.document || "",
    status: dto.status,
    memberSince: dto.member_since || "",
    createdAt: dto.created_at || "",
    updatedAt: dto.updated_at || "",
    addresses: (dto.addresses || []).map(mapAdminCustomerAddressDto),
  };
}

export function mapAdminCustomerCreateInput(
  input: AdminCustomerCreateInput,
): AdminCustomerCreateDto {
  return {
    name: input.name,
    email: input.email || "",
    phone: input.phone || "",
    document: input.document || "",
  };
}

export function mapAdminCustomerUpdateInput(
  input: AdminCustomerUpdateInput,
): AdminCustomerUpdateDto {
  return {
    document: input.document,
    email: input.email,
    name: input.name,
    phone: input.phone,
    status: input.status,
  };
}
