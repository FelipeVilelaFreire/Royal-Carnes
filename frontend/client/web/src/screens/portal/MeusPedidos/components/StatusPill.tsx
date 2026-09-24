import { Badge } from "@foundation/ui/web/Badge";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";

export function StatusPill({ order }: { order: ClientOrderRowViewModel }) {
  return <Badge appearance="soft" level="xs" tone={order.statusTone}>{order.statusLabel}</Badge>;
}
