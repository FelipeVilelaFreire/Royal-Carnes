import type { ClientCustomerProfile } from "../types/customer.types";

export interface ClientCustomerDto {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  addresses?: Array<{
    id: string;
    label?: string | null;
    city?: string | null;
    district?: string | null;
    is_default?: boolean | null;
  }>;
}

export type ClientCustomerView = ClientCustomerProfile;

