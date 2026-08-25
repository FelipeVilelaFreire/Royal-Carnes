import { USE_MOCK_DATA, API_BASE_URL } from "../../config";
import { mockPlans } from "../mocks/plans.mock";
import { SubscriptionPlan } from "../../contracts";

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  if (USE_MOCK_DATA) {
    return mockPlans;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/plans/`);
    if (!res.ok) throw new Error("Failed to fetch plans");
    const data = await res.json();
    return data.plans;
  } catch (err) {
    console.warn("API Error, falling back to mock plans:", err);
    return mockPlans;
  }
}
