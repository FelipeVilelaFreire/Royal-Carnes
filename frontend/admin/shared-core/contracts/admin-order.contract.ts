export type AdminOrderStatus = "packing" | "outForDelivery" | "approved" | "delivered" | "pending" | "cancelled";

export interface AdminOrder {
  id: string;
  code: string;
  customerName: string;
  email: string;
  kindLabel: string;
  summary: string;
  totalFormatted: string;
  statusLabel: string;
  status: AdminOrderStatus;
  createdAt: string;
}
