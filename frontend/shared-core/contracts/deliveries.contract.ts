import type {
  DeliveryCode,
  DeliveryConfirmationId,
  DeliveryConfirmationType,
  DeliveryId,
  DeliveryPackageId,
  DeliveryStatusHistoryId,
  DeliveryStatusId,
  DeliveryStatusKey,
} from "../types/deliveries.types";
import type { OrderId } from "../types/orders.types";

export interface DeliveryStatusBase {
  id: DeliveryStatusId;
  key: DeliveryStatusKey;
  label: string;
  sortOrder: number;
  isInitial: boolean;
  isTerminal: boolean;
  isPublic: boolean;
  allowedNextKeys: DeliveryStatusKey[];
  effects: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface DeliveryPackageBase {
  id: DeliveryPackageId;
  label: string;
  packageType: string;
  weightGrams?: number | null;
  metadata: Record<string, unknown>;
}

export interface DeliveryStatusHistoryBase {
  id: DeliveryStatusHistoryId;
  fromStatusKey: DeliveryStatusKey | "";
  toStatusKey: DeliveryStatusKey;
  note: string;
  actorEmail?: string | null;
  createdAt: string;
}

export interface DeliveryConfirmationBase {
  id: DeliveryConfirmationId;
  confirmationType: DeliveryConfirmationType;
  confirmedBy: string;
  note: string;
  actorEmail?: string | null;
  createdAt: string;
}

export interface DeliveryBase {
  id: DeliveryId;
  code: DeliveryCode;
  orderId: OrderId;
  orderCode: string;
  customerId: string | number;
  customerName: string;
  addressId?: string | number | null;
  statusKey: DeliveryStatusKey;
  confirmationCode: string;
  addressSnapshot: Record<string, unknown>;
  notes: string;
  metadata: Record<string, unknown>;
  packages: DeliveryPackageBase[];
  statusHistory: DeliveryStatusHistoryBase[];
  confirmation?: DeliveryConfirmationBase | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryConfigBase {
  statuses: DeliveryStatusBase[];
}

export interface DeliveryCreateInputBase {
  orderId: OrderId;
  codeSequenceKey?: string;
  confirmationCode?: string;
  notes?: string;
}

export interface DeliveryTransitionInputBase {
  statusKey: DeliveryStatusKey;
  note?: string;
}

export interface DeliveryConfirmInputBase {
  confirmationType?: DeliveryConfirmationType;
  confirmedBy?: string;
  note?: string;
}

export type DeliveryErrorCode =
  | "customer_not_found"
  | "delivery_not_found"
  | "delivery_reference_not_found"
  | "delivery_status_not_found"
  | "delivery_initial_status_not_configured"
  | "order_organization_mismatch"
  | "delivery_already_exists"
  | "organization_mismatch"
  | "delivery_status_terminal"
  | "delivery_status_transition_not_allowed"
  | "permission_denied"
  | "network_error"
  | "unknown_error";
