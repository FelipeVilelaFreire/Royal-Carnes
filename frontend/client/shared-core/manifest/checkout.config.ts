import type { ClientCheckoutProductExperience } from "../contracts/checkout.contract";

export type ClientCheckoutStepKey = "montagem" | "entrega" | "pagamento" | "resumo";
export type ClientCheckoutAddressFieldKey = "zipCode" | "street" | "number" | "neighborhood" | "city" | "complement";

export interface ClientCheckoutAddressFieldConfig {
  key: ClientCheckoutAddressFieldKey;
  labelKey: ClientCheckoutAddressFieldKey;
  placeholderKey: ClientCheckoutAddressFieldKey;
  gridColumn: string;
}

interface ClientCheckoutConfigDefinition {
  modeOrder: ClientCheckoutProductExperience[];
  orderKindByMode: Record<ClientCheckoutProductExperience, string | null>;
  stepOrder: ClientCheckoutStepKey[];
  defaultMode: ClientCheckoutProductExperience | null;
  defaultStep: ClientCheckoutStepKey;
  defaultPlanKey: string;
  defaultDeliveryDay: number;
  defaultPaymentMethod: string;
  defaultInstallments: number;
  deliveryDays: number[];
  addressFields: ClientCheckoutAddressFieldConfig[];
}

export const clientCheckoutConfig: ClientCheckoutConfigDefinition = {
  modeOrder: ["subscription", "royalBox", "royalDelivery"] satisfies ClientCheckoutProductExperience[],
  orderKindByMode: {
    subscription: "subscription-cycle",
    royalBox: "royal-box",
    royalDelivery: "delivery",
  } satisfies Record<ClientCheckoutProductExperience, string | null>,
  stepOrder: ["montagem", "entrega", "pagamento", "resumo"] satisfies ClientCheckoutStepKey[],
  defaultMode: null as ClientCheckoutProductExperience | null,
  defaultStep: "montagem" satisfies ClientCheckoutStepKey,
  defaultPlanKey: "pro",
  defaultDeliveryDay: 10,
  defaultPaymentMethod: "creditCard",
  defaultInstallments: 1,
  deliveryDays: [5, 10, 15, 20, 25],
  addressFields: [
    { key: "zipCode", labelKey: "zipCode", placeholderKey: "zipCode", gridColumn: "span 3" },
    { key: "street", labelKey: "street", placeholderKey: "street", gridColumn: "span 6" },
    { key: "number", labelKey: "number", placeholderKey: "number", gridColumn: "span 3" },
    { key: "neighborhood", labelKey: "neighborhood", placeholderKey: "neighborhood", gridColumn: "span 4" },
    { key: "city", labelKey: "city", placeholderKey: "city", gridColumn: "span 4" },
    { key: "complement", labelKey: "complement", placeholderKey: "complement", gridColumn: "span 4" },
  ] satisfies ClientCheckoutAddressFieldConfig[],
};

export type ClientCheckoutConfig = typeof clientCheckoutConfig;
