import type { ClientCustomerProfile } from "../types/customer.types";

export type ClientCustomerSubscriptionTier = string;
export type ClientCustomerOrderStatus = "sentToStore" | "approved" | "preparing" | "outForDelivery" | "delivered" | "cancelled";
export type ClientCustomerOrderTone = "success" | "danger" | "pending" | "active";

export interface ClientCustomerDto {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  member_since?: string | null;
  birth_date?: string | null;
  preferences?: Record<string, unknown>;
  notification_settings?: Partial<ClientCustomerNotificationPreferences>;
  payment_methods?: Array<{
    id: string | number;
    method_type: string;
    label?: string | null;
    provider?: string | null;
    metadata?: Record<string, unknown>;
    is_default?: boolean | null;
  }>;
  status?: string | null;
  addresses?: Array<{
    id: string;
    label?: string | null;
    recipient_name?: string | null;
    postal_code?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    city?: string | null;
    district?: string | null;
    state?: string | null;
    is_default?: boolean | null;
  }>;
}

export type ClientCustomerView = ClientCustomerProfile;

export interface ClientCustomerAddress {
  id: string;
  label: string;
  recipientName: string;
  streetLine: string;
  neighborhoodLine: string;
  zipCode: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface ClientCustomerPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  holderName: string;
  expiresAt: string;
  isDefault?: boolean;
}

export interface ClientCustomerInvoice {
  id: string;
  date: string;
  description: string;
  amountLabel: string;
  paymentMethodLabel: string;
  status: "PAGO" | "PENDENTE";
}

export interface ClientCustomerNotificationPreferences {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  offers: boolean;
}

export interface ClientCustomerActiveSubscription {
  id: string;
  planKey: ClientCustomerSubscriptionTier;
  billingLabel: string;
  nextBillingLabel: string;
  nextDeliveryLabel: string;
}

export interface ClientCustomerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  preferredDoneness: string;
  memberSince: string;
  activeSubscription?: ClientCustomerActiveSubscription;
  addresses: ClientCustomerAddress[];
  paymentMethods: ClientCustomerPaymentMethod[];
  notifications: ClientCustomerNotificationPreferences;
}

export interface ClientCustomerPlan {
  key: ClientCustomerSubscriptionTier;
  name: string;
  monthlyPrice: number;
  productSelectionLimit: number;
  proteinKgLimit: number;
  charcoalKgLimit: number;
  seasoningSelectionLimit: number;
  sideSelectionLimit: number;
  utensilSelectionLimit: number;
  features: string[];
}

export interface ClientCustomerCycleUsage {
  cycleLabel: string;
  cutsUsed: number;
  cutsLimit: number;
  weightKgUsed: number;
  weightKgLimit: number;
  charcoalKgUsed: number;
  charcoalKgLimit: number;
  complementsUsed: number;
  complementsLimit: number;
  seasoningsUsed: number;
  seasoningsLimit: number;
  sidesUsed: number;
  sidesLimit: number;
  utensilsUsed: number;
  utensilsLimit: number;
}

export interface ClientCustomerRecentOrder {
  id: string;
  code: string;
  kindLabel: string;
  title: string;
  summary: string;
  statusLabel: string;
  statusTone: ClientCustomerOrderTone;
  createdAtLabel: string;
  estimateLabel: string;
  totalLabel: string;
  imageUrl: string;
}

export interface ClientCustomerDataSource {
  customer: ClientCustomerAccount;
  invoices: ClientCustomerInvoice[];
  plans: ClientCustomerPlan[];
  recentOrders: ClientCustomerRecentOrder[];
  cycleUsage: ClientCustomerCycleUsage | null;
}
