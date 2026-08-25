export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  recommended?: boolean;
}

export interface SubscriberProfile {
  id: string;
  email: string;
  name: string;
  activePlanId: string;
  subscriptionStatus: "active" | "paused" | "canceled";
  nextDeliveryDate: string;
}
