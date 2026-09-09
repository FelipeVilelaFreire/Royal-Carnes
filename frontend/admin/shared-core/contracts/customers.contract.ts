export interface AdminCustomerAddressDto {
  id: string | number;
  label?: string;
  recipient_name?: string;
  postal_code?: string;
  street: string;
  number?: string;
  complement?: string;
  district?: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
  delivery_instructions?: string;
}

export interface AdminCustomerDto {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  status: "active" | "paused" | "blocked" | "archived";
  member_since?: string | null;
  created_at?: string;
  updated_at?: string;
  addresses?: AdminCustomerAddressDto[];
}

export interface AdminCustomerCreateDto {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
}

export type AdminCustomerUpdateDto = Partial<AdminCustomerCreateDto> & {
  status?: AdminCustomerDto["status"];
};

export interface AdminCustomerAddressView {
  id: string | number;
  label: string;
  recipientName: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  deliveryInstructions: string;
}

export interface AdminCustomerView {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  document: string;
  status: "active" | "paused" | "blocked" | "archived";
  memberSince: string;
  createdAt: string;
  updatedAt: string;
  addresses: AdminCustomerAddressView[];
}

export interface AdminCustomerCreateInput {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
}

export type AdminCustomerUpdateInput = Partial<AdminCustomerCreateInput> & {
  status?: AdminCustomerView["status"];
};
