export interface SubscriberData {
  id: string;
  name: string;
  email: string;
  planName: string;
  address: string;
  subscriptionStatus: "active" | "paused" | "canceled";
  nextBox: {
    scheduledDate: string;
    status: "preparing" | "shipped" | "delivered";
    items: string[];
  };
}

export const mockSubscriber: SubscriberData = {
  id: "sub-1001",
  name: "Felipe Vila Nova",
  email: "felipe@primecut.club",
  planName: "Exclusive Wagyu",
  address: "Av. Atlântica, 1500 - Rio de Janeiro / RJ",
  subscriptionStatus: "active",
  nextBox: {
    scheduledDate: "10 de Setembro, 2026",
    status: "preparing",
    items: [
      "1.5kg Wagyu A5 BMS 10+",
      "2.0kg Picanha Angus Maturada",
      "1.5kg Prime Rib Heritage",
      "Kit Sais de Parrilla & Flor de Sal"
    ]
  }
};

export const mockSubscriberProfile = mockSubscriber;
