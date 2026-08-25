import { USE_MOCK_DATA, API_BASE_URL } from "../../config";
import { mockSubscriberProfile } from "../mocks/subscriber.mock";
import { SubscriberProfile } from "../../contracts";

export async function fetchSubscriberProfile(customerId: string): Promise<SubscriberProfile> {
  if (USE_MOCK_DATA) {
    return mockSubscriberProfile;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/subscriptions/profile/?customer=${customerId}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.warn("API Error, falling back to mock profile:", err);
    return mockSubscriberProfile;
  }
}
