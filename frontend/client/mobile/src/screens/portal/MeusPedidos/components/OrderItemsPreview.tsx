import { Inline, Stack, Text } from "@foundation/ui/native";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";

export function OrderItemsPreview({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <Stack gap="xs">
      {order.items.slice(0, 4).map((item) => (
        <Inline gap="sm" key={item.id} style={{ justifyContent: "space-between" }}>
          <Text weight="bold">{item.name}</Text>
          <Text tone="muted" variant="caption">{item.quantityLabel}</Text>
        </Inline>
      ))}
    </Stack>
  );
}
