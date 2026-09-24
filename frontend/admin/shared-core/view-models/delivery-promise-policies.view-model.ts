import type { AdminDeliveryPromisePolicyInput } from "../contracts/deliveries.contract";

export interface AdminDeliveryPromisePolicyRowViewModel extends AdminDeliveryPromisePolicyInput {
  id: string | number;
  promiseWindow: string;
  alertWindow: number;
  statusKey: "active" | "inactive";
  statusLabelKey: string;
  statusTone: "neutral" | "success";
}

export function createAdminDeliveryPromisePolicyRowViewModel(
  policy: AdminDeliveryPromisePolicyInput & { id: string | number },
): AdminDeliveryPromisePolicyRowViewModel {
  return {
    ...policy,
    promiseWindow: `${policy.minBusinessDays}–${policy.maxBusinessDays}`,
    alertWindow: policy.approachingBusinessDays,
    statusKey: policy.isActive ? "active" : "inactive",
    statusLabelKey: policy.isActive ? "deliveryPromisePolicies.status.active" : "deliveryPromisePolicies.status.inactive",
    statusTone: policy.isActive ? "success" : "neutral",
  };
}
