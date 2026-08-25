import { USE_MOCK_DATA, API_BASE_URL } from "../../config";
import { mockAdminDashboard } from "../mocks/dashboard.mock";

export async function fetchAdminDashboard() {
  if (USE_MOCK_DATA) {
    return mockAdminDashboard;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/subscriptions/stats/`);
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return await res.json();
  } catch (err) {
    console.warn("API Error, falling back to mock dashboard:", err);
    return mockAdminDashboard;
  }
}
