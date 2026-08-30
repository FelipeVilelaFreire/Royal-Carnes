import type {
  DeliveryBase,
  DeliveryConfigBase,
  DeliveryConfirmationBase,
  DeliveryPackageBase,
  DeliveryStatusBase,
  DeliveryStatusHistoryBase,
} from "../../../shared-core";

export interface ClientDeliveryStatusDto {
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

export interface ClientDeliveryConfigDto {
  statuses: ClientDeliveryStatusDto[];
}

export interface ClientDeliveryPackageDto {
  id: string | number;
  label?: string;
  package_type?: string;
  weight_grams?: number | null;
  metadata?: Record<string, unknown>;
}

export interface ClientDeliveryStatusHistoryDto {
  id: string | number;
  from_status_key?: string;
  to_status_key: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface ClientDeliveryConfirmationDto {
  id: string | number;
  confirmation_type: string;
  confirmed_by?: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface ClientDeliveryDto {
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
  packages?: ClientDeliveryPackageDto[];
  status_history?: ClientDeliveryStatusHistoryDto[];
  confirmation?: ClientDeliveryConfirmationDto | null;
  created_at: string;
  updated_at: string;
}

export type ClientDeliveryStatusView = DeliveryStatusBase;
export type ClientDeliveryConfigView = DeliveryConfigBase;
export type ClientDeliveryPackageView = DeliveryPackageBase;
export type ClientDeliveryStatusHistoryView = DeliveryStatusHistoryBase;
export type ClientDeliveryConfirmationView = DeliveryConfirmationBase;
export type ClientDeliveryView = DeliveryBase;
