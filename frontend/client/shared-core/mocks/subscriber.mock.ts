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
  planName: "Premium",
  address: "Av. Atlântica, 1500 - Rio de Janeiro / RJ",
  subscriptionStatus: "active",
  nextBox: {
    scheduledDate: "10 de Setembro, 2026",
    status: "preparing",
    items: [
      "1kg Picanha",
      "1kg Fraldinha",
      "1kg Linguica toscana",
      "2 pacotes de carvao premium 5 kg"
    ]
  }
};

export const mockSubscriberProfile = mockSubscriber;
