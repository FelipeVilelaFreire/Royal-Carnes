import type { ClientCustomerProfile } from "../types/customer.types";

export interface ClientCustomerViewModel {
  name: string;
  email: string | null;
  phone: string | null;
  primaryAddressLabel: string | null;
  addressCount: number;
}

export function createClientCustomerViewModel(
  customer: ClientCustomerProfile | null,
): ClientCustomerViewModel {
  const primaryAddress =
    customer?.addresses.find((address) => address.isDefault) ||
    customer?.addresses[0] ||
    null;

  return {
    name: customer?.name || "",
    email: customer?.email || null,
    phone: customer?.phone || null,
    primaryAddressLabel: primaryAddress?.label || null,
    addressCount: customer?.addresses.length || 0,
  };
}

