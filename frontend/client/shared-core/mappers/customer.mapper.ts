import type { ClientCustomerDto, ClientCustomerView } from "../contracts/customer.contract";

export function mapClientCustomerDto(dto: ClientCustomerDto): ClientCustomerView {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email ?? null,
    phone: dto.phone ?? null,
    status: dto.status === "inactive" || dto.status === "pending" ? dto.status : "active",
    addresses: (dto.addresses || []).map((address) => ({
      id: address.id,
      label: address.label || "Endereco",
      city: address.city ?? null,
      district: address.district ?? null,
      isDefault: Boolean(address.is_default),
    })),
  };
}

