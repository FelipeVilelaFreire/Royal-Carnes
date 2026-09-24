import { Text } from "@foundation/ui/native";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";

export function StatusPill({ order }: { order: ClientOrderRowViewModel }) {
  const tone = order.statusTone === "danger" ? "danger" : order.statusTone === "success" ? "primary" : "muted";

  return <Text tone={tone} variant="caption" weight="bold">{order.statusLabel}</Text>;
}
