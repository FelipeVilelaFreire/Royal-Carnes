export type AdminPaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export interface AdminPaymentDto {
  id: string | number;
  reference: string;
  customer_id: string | number;
  customer_name: string;
  subscription_id?: string | number | null;
  subscription_plan_name?: string | null;
  order_id?: string | number | null;
  order_code?: string | null;
  status: AdminPaymentStatus;
  currency: string;
  amount_cents: number;
  due_at?: string | null;
  paid_at?: string | null;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminPaymentView {
  id: string | number;
  reference: string;
  customerId: string | number;
  customerName: string;
  subscriptionId: string | number | null;
  subscriptionPlanName: string | null;
  orderId: string | number | null;
  orderCode: string | null;
  status: AdminPaymentStatus;
  currency: string;
  amountCents: number;
  dueAt: string | null;
  paidAt: string | null;
  notes: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentFormInput {
  reference: string;
  customerId: string | number;
  subscriptionId?: string | number | null;
  orderId?: string | number | null;
  status?: AdminPaymentStatus;
  currency?: string;
  amountCents: number;
  dueAt?: string | null;
  paidAt?: string | null;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminPaymentCreateDto {
  reference: string;
  customer_id: string | number;
  subscription_id?: string | number | null;
  order_id?: string | number | null;
  status?: AdminPaymentStatus;
  currency?: string;
  amount_cents: number;
  due_at?: string | null;
  paid_at?: string | null;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type AdminPaymentUpdateInput = Partial<Omit<AdminPaymentFormInput, "customerId" | "subscriptionId" | "orderId">>;

export interface AdminPaymentUpdateDto {
  reference?: string;
  status?: AdminPaymentStatus;
  currency?: string;
  amount_cents?: number;
  due_at?: string | null;
  paid_at?: string | null;
  notes?: string;
  metadata?: Record<string, unknown>;
}

