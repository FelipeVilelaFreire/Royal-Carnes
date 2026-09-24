import type { ClientCheckoutProductExperience } from "../contracts/checkout.contract";

export type ClientCheckoutStepKey = "montagem" | "entrega" | "pagamento" | "resumo";
export type ClientCheckoutAddressFieldKey = "label" | "zipCode" | "street" | "number" | "neighborhood" | "city" | "state" | "complement";

export interface ClientCheckoutAddressFieldConfig {
  autoComplete: string;
  gridSpan: number;
  key: ClientCheckoutAddressFieldKey;
  labelKey: ClientCheckoutAddressFieldKey;
  maxLength?: number;
  placeholderKey: ClientCheckoutAddressFieldKey;
  inputMode?: "numeric" | "text";
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
  defaultPaymentMethod: "pix",
  defaultInstallments: 1,
  deliveryDays: [5, 10, 15, 20, 25],
  addressFields: [
    { key: "label", labelKey: "label", placeholderKey: "label", gridSpan: 20, autoComplete: "off" },
    { key: "zipCode", labelKey: "zipCode", placeholderKey: "zipCode", gridSpan: 4, autoComplete: "postal-code", inputMode: "numeric", maxLength: 9 },
    { key: "street", labelKey: "street", placeholderKey: "street", gridSpan: 11, autoComplete: "street-address" },
    { key: "number", labelKey: "number", placeholderKey: "number", gridSpan: 5, autoComplete: "address-line2", inputMode: "numeric" },
    { key: "neighborhood", labelKey: "neighborhood", placeholderKey: "neighborhood", gridSpan: 6, autoComplete: "address-level3" },
    { key: "city", labelKey: "city", placeholderKey: "city", gridSpan: 6, autoComplete: "address-level2" },
    { key: "state", labelKey: "state", placeholderKey: "state", gridSpan: 2, autoComplete: "address-level1" },
    { key: "complement", labelKey: "complement", placeholderKey: "complement", gridSpan: 6, autoComplete: "address-line2" },
  ] satisfies ClientCheckoutAddressFieldConfig[],
};

export type ClientCheckoutConfig = typeof clientCheckoutConfig;
