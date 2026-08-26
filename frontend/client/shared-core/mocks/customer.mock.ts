import type { SubscriptionTier } from "./catalog/types";

export type RoyalCustomerAddress = {
  id: string;
  label: string;
  recipientName: string;
  streetLine: string;
  neighborhoodLine: string;
  zipCode: string;
  phone?: string;
  isPrimary?: boolean;
};

export type RoyalCustomerPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  holderName: string;
  expiresAt: string;
  isDefault?: boolean;
};

export type RoyalCustomerInvoice = {
  id: string;
  date: string;
  description: string;
  amountLabel: string;
  paymentMethodLabel: string;
  status: "PAGO" | "PENDENTE";
};

export type RoyalCustomerMock = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  preferredDoneness: string;
  memberSince: string;
  activeSubscription?: {
    id: string;
    planKey: SubscriptionTier;
    billingLabel: string;
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  addresses: RoyalCustomerAddress[];
  paymentMethods: RoyalCustomerPaymentMethod[];
  notifications: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
    offers: boolean;
  };
};

export const royalCustomerMock: RoyalCustomerMock = {
  id: "customer-felipe-vilela",
  name: "Felipe Vilela",
  email: "felipe@royalcarnes.com.br",
  phone: "(11) 99999-8888",
  cpf: "348.910.482-00",
  birthdate: "1992-06-15",
  preferredDoneness: "Ao Ponto para Mal Passado",
  memberSince: "Agosto de 2026",
  activeSubscription: {
    id: "subscription-royal-pro-felipe",
    planKey: "pro",
    billingLabel: "Mensal",
    nextBillingLabel: "12 de Setembro de 2026",
    nextDeliveryLabel: "12 de Setembro"
  },
  addresses: [
    {
      id: "address-home",
      label: "Casa",
      recipientName: "Felipe Vilela",
      streetLine: "Av. Visconde de Albuquerque, 1200, Apto 302",
      neighborhoodLine: "Leblon, Rio de Janeiro - RJ",
      zipCode: "22450-000",
      phone: "(11) 99999-8888",
      isPrimary: true
    },
    {
      id: "address-office",
      label: "Escritorio / Trabalho",
      recipientName: "Felipe Vilela",
      streetLine: "Av. das Americas, 4200, Bloco 2, Sala 304",
      neighborhoodLine: "Barra da Tijuca, Rio de Janeiro - RJ",
      zipCode: "22640-102"
    }
  ],
  paymentMethods: [
    {
      id: "payment-mastercard-4821",
      brand: "Mastercard",
      last4: "4821",
      holderName: "FELIPE V FREIRE",
      expiresAt: "10/2028",
      isDefault: true
    },
    {
      id: "payment-visa-9012",
      brand: "Visa Infinite",
      last4: "9012",
      holderName: "FELIPE V FREIRE",
      expiresAt: "04/2029"
    }
  ],
  notifications: {
    whatsapp: true,
    email: true,
    sms: false,
    offers: true
  }
};

export const royalCustomerPaymentHistoryMock: RoyalCustomerInvoice[] = [
  {
    id: "INV-2026-08",
    date: "12 AGO 2026",
    description: "Assinatura Royal Pro (Mensal)",
    amountLabel: "875,00",
    paymentMethodLabel: "Mastercard final 4821",
    status: "PAGO"
  },
  {
    id: "INV-2026-07",
    date: "12 JUL 2026",
    description: "Assinatura Royal Pro (Mensal)",
    amountLabel: "875,00",
    paymentMethodLabel: "Mastercard final 4821",
    status: "PAGO"
  },
  {
    id: "INV-2026-06",
    date: "12 JUN 2026",
    description: "Assinatura Royal Pro (Mensal)",
    amountLabel: "875,00",
    paymentMethodLabel: "Mastercard final 4821",
    status: "PAGO"
  },
  {
    id: "INV-2026-05",
    date: "12 MAI 2026",
    description: "Assinatura Royal Pro (Mensal)",
    amountLabel: "875,00",
    paymentMethodLabel: "Mastercard final 4821",
    status: "PAGO"
  }
];
