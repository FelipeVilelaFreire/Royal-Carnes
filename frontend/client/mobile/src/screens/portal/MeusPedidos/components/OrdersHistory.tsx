import { Button, Inline, Stack, Surface, Text } from "@foundation/ui/native";
import { useClientStrings } from "../../../../../../shared-core/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";

interface OrdersHistoryProps {
  onOpenDetails: (id: string | number) => void;
  orders: ClientOrderRowViewModel[];
}

export function OrdersHistory({ onOpenDetails, orders }: OrdersHistoryProps) {
  const strings = useClientStrings().meusPedidos;

  return (
    <Stack gap="sm">
      <Text variant="h3" weight="bold">{strings.history.title}</Text>
      {orders.map((order) => (
        <Surface key={order.id} appearance="outline" tone="neutral">
          <Stack gap="sm">
            <Inline gap="sm" style={{ justifyContent: "space-between" }}>
              <Text weight="bold">{order.code}</Text>
              <Text tone="primary" variant="caption" weight="bold">{order.totalLabel}</Text>
            </Inline>
            <Text tone="muted" variant="caption">
              {strings.format.dashSeparated.replace("{first}", order.statusLabel).replace("{second}", `${order.itemCount} ${strings.history.itemSuffix}`)}
            </Text>
            <Button appearance="outline" tone="neutral" size="sm" onPress={() => onOpenDetails(order.id)}>
              {strings.history.details}
            </Button>
          </Stack>
        </Surface>
      ))}
    </Stack>
  );
}
