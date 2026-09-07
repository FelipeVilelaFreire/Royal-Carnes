import type { CustomerId } from "../../../shared-core";

export type CustomerStatus = "active" | "inactive" | "pending";

export interface CustomerAddressSummary {
  id: string;
  label: string;
  city?: string | null;
  district?: string | null;
  isDefault?: boolean;
}

export interface ClientCustomerProfile {
  id: CustomerId;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: CustomerStatus;
  addresses: CustomerAddressSummary[];
}

export type ClientCustomerTabKey =
  | "overview"
  | "subscription"
  | "orders"
  | "data"
  | "addresses"
  | "payments"
  | "notifications"
  | "security";

export interface ClientCustomerProfileDraft {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  preferredDoneness: string;
}
