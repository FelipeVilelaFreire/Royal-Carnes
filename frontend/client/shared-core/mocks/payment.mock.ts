import type { ProductExperience } from "./catalog";

export type PaymentMethodKey = "pix" | "creditCard" | "debitCard" | "whatsapp";

export interface PaymentMethodMock {
  key: PaymentMethodKey;
  labelKey: PaymentMethodKey;
  descriptionKey: `${PaymentMethodKey}Description`;
  availableFor: ProductExperience[];
  supportsRecurring: boolean;
  feePercentage: number;
}

export const paymentMethodsMock: PaymentMethodMock[] = [
  {
    key: "pix",
    labelKey: "pix",
    descriptionKey: "pixDescription",
    availableFor: ["subscription", "royalBox", "royalDelivery"],
    supportsRecurring: false,
    feePercentage: 0
  },
  {
    key: "creditCard",
    labelKey: "creditCard",
    descriptionKey: "creditCardDescription",
    availableFor: ["subscription", "royalBox", "royalDelivery"],
    supportsRecurring: true,
    feePercentage: 0
  },
  {
    key: "debitCard",
    labelKey: "debitCard",
    descriptionKey: "debitCardDescription",
    availableFor: ["royalDelivery"],
    supportsRecurring: false,
    feePercentage: 0
  },
  {
    key: "whatsapp",
    labelKey: "whatsapp",
    descriptionKey: "whatsappDescription",
    availableFor: ["subscription", "royalBox", "royalDelivery"],
    supportsRecurring: false,
    feePercentage: 0
  }
];

export const paymentInstallmentsMock = [1, 2, 3];
