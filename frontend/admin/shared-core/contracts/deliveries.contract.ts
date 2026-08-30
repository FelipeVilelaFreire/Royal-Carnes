import type {
  DeliveryBase,
  DeliveryConfigBase,
  DeliveryConfirmInputBase,
  DeliveryConfirmationBase,
  DeliveryCreateInputBase,
  DeliveryPackageBase,
  DeliveryStatusBase,
  DeliveryStatusHistoryBase,
  DeliveryTransitionInputBase,
} from "../../../shared-core";

export interface AdminDeliveryStatusDto {
  id: string | number;
  key: string;
  label: string;
  sort_order?: number;
  is_initial: boolean;
  is_terminal: boolean;
  is_public: boolean;
  allowed_next_keys?: string[];
  effects?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AdminDeliveryConfigDto {
  statuses: AdminDeliveryStatusDto[];
}

export interface AdminDeliveryPackageDto {
  id: string | number;
  label?: string;
  package_type?: string;
  weight_grams?: number | null;
  metadata?: Record<string, unknown>;
}

export interface AdminDeliveryStatusHistoryDto {
  id: string | number;
  from_status_key?: string;
  to_status_key: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface AdminDeliveryConfirmationDto {
  id: string | number;
  confirmation_type: string;
  confirmed_by?: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface AdminDeliveryDto {
  id: string | number;
  code: string;
  order_id: string | number;
  order_code: string;
  customer_id: string | number;
  customer_name: string;
  address_id?: string | number | null;
  status_key: string;
  confirmation_code?: string;
  address_snapshot?: Record<string, unknown>;
  notes?: string;
  metadata?: Record<string, unknown>;
  packages?: AdminDeliveryPackageDto[];
  status_history?: AdminDeliveryStatusHistoryDto[];
  confirmation?: AdminDeliveryConfirmationDto | null;
  created_at: string;
  updated_at: string;
}

export interface AdminDeliveryCreateDto {
  order_id: string | number;
  code_sequence_key?: string;
  confirmation_code?: string;
  notes?: string;
}

export interface AdminDeliveryTransitionDto {
  status_key: string;
  note?: string;
}

export interface AdminDeliveryConfirmDto {
  confirmation_type?: string;
  confirmed_by?: string;
  note?: string;
}

export type AdminDeliveryStatusView = DeliveryStatusBase;
export type AdminDeliveryConfigView = DeliveryConfigBase;
export type AdminDeliveryPackageView = DeliveryPackageBase;
export type AdminDeliveryStatusHistoryView = DeliveryStatusHistoryBase;
export type AdminDeliveryConfirmationView = DeliveryConfirmationBase;
export type AdminDeliveryView = DeliveryBase;
export type AdminDeliveryCreateInput = DeliveryCreateInputBase;
export type AdminDeliveryTransitionInput = DeliveryTransitionInputBase;
export type AdminDeliveryConfirmInput = DeliveryConfirmInputBase;
