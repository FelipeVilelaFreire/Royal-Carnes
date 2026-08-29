/**
 * Real Backend DTO Contracts matching Django API & seeds
 */
export type BackendDeliveryStatus =
  | "pending"
  | "packing"
  | "out-for-delivery"
  | "delivered"
  | "failed"
  | "cancelled"
  | string;

export interface DeliveryStatusHistoryDto {
  status_key: string;
  note?: string;
  created_at?: string;
}

export interface DeliveryDto {
  id: number | string;
  code: string;
  order_id: number | string;
  order_code: string;
  customer_id?: number | string;
  customer_name?: string;
  address_id?: number | string;
  status_key: string;
  confirmation_code?: string;
  address_snapshot?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  packages?: any[];
  status_history?: DeliveryStatusHistoryDto[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Legacy UI Contract types (for backward compatibility)
 */
export type RoyalDeliveryStatus =
  | "packing"
  | "outForDelivery"
  | "delivered"
  | "pending"
  | "cancelled"
  | "out-for-delivery"
  | "failed"
  | string;

export interface DeliveryStatusDefinition {
  key: string;
  label: string;
  tone: "success" | "danger" | "pending" | "active";
}

export interface RoyalDeliveryPackage {
  id: string;
  trackingCode?: string;
  carrierName?: string;
  items: string[];
}

export interface RoyalDelivery {
  id: string;
  code: string;
  orderId: string;
  orderCode: string;
  customerId: string;
  customerName?: string;
  addressId: string;
  statusKey: string;
  confirmationCode?: string;
  addressSnapshot?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  packages?: RoyalDeliveryPackage[];
  statusHistory?: Array<{
    status: string;
    updatedAt: string;
  }>;
  confirmation?: {
    confirmedAt?: string;
    signatureUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryConfigResponse {
  statuses: DeliveryStatusDefinition[];
}
