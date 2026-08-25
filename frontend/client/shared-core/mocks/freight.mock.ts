import type { ProductExperience } from "./catalog";

export type FreightOptionKey = "pickup" | "standard" | "express";
export type FreightLabelKey = "pickup" | "standardDelivery" | "expressDelivery";

export interface FreightOptionMock {
  key: FreightOptionKey;
  labelKey: FreightLabelKey;
  price: number;
  etaLabel: string;
  availableFor: ProductExperience[];
}

export const freightOptionsMock: FreightOptionMock[] = [
  {
    key: "pickup",
    labelKey: "pickup",
    price: 0,
    etaLabel: "Retirada na loja",
    availableFor: ["royalDelivery"]
  },
  {
    key: "standard",
    labelKey: "standardDelivery",
    price: 19.9,
    etaLabel: "1 a 2 dias uteis",
    availableFor: ["royalDelivery"]
  },
  {
    key: "express",
    labelKey: "expressDelivery",
    price: 34.9,
    etaLabel: "Hoje ou proximo periodo",
    availableFor: ["royalDelivery"]
  }
];

export const freightPoliciesMock: Record<
  ProductExperience,
  {
    kind: "included" | "calculated";
    price: number;
    defaultOptionKey?: FreightOptionKey;
  }
> = {
  subscription: {
    kind: "included",
    price: 0
  },
  royalBox: {
    kind: "included",
    price: 0
  },
  royalDelivery: {
    kind: "calculated",
    price: 0,
    defaultOptionKey: "standard"
  }
};
