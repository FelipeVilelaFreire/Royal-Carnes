import { USE_MOCK_DATA, API_BASE_URL } from "../../config";
import { mockAdminDeliveries } from "../mocks/deliveries.mock";

export async function fetchAdminDeliveries() {
  if (USE_MOCK_DATA) {
    return mockAdminDeliveries;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/deliveries/shipments/`);
    if (!res.ok) throw new Error("Failed to fetch shipments");
    const data = await res.json();
    return data.shipments;
  } catch (err) {
    console.warn("API Error, falling back to mock deliveries:", err);
    return mockAdminDeliveries;
  }
}
