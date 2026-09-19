import type { AdminCustomerView } from "../contracts/customers.contract";

const customerStatusLabelKeys: Record<AdminCustomerView["status"], string> = {
  active: "common.statusActive",
  archived: "common.statusArchived",
  blocked: "common.statusBlocked",
  paused: "common.statusPaused",
};

const customerStatusTones: Record<AdminCustomerView["status"], "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  paused: "warning",
  blocked: "danger",
  archived: "neutral",
};

function resolveDefaultAddressLabel(customer: AdminCustomerView): string {
  const address = customer.addresses.find((item) => item.isDefault) || customer.addresses[0];
  if (!address) return "";
  return [address.street, address.number, address.city, address.state].filter(Boolean).join(", ");
}

export function createAdminCustomerRowViewModel(customer: AdminCustomerView) {
  return {
    ...customer,
    addressCount: customer.addresses.length,
    defaultAddress: resolveDefaultAddressLabel(customer),
    statusLabelKey: customerStatusLabelKeys[customer.status],
    statusTone: customerStatusTones[customer.status],
  };
}
