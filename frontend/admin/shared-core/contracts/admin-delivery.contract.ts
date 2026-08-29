export type AdminDeliveryStatus = "packing" | "outForDelivery" | "delivered" | "pending" | "cancelled";

export interface AdminDelivery {
  id: string;
  orderCode: string;
  customerName: string;
  planName: string;
  scheduledDate: string;
  status: AdminDeliveryStatus;
  address: string;
  items: string[];
}
