import { Button, Inline, Stack, Surface, Text } from "@foundation/ui/native";
import { useClientStrings } from "../../../../../../shared-core/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";
import { OrderItemsPreview } from "./OrderItemsPreview";

interface CurrentOrderPanelProps {
  nextBox: ClientOrderRowViewModel | null;
  onOpenDetails: (id: string | number) => void;
  order: ClientOrderRowViewModel;
}

export function CurrentOrderPanel({ nextBox, onOpenDetails, order }: CurrentOrderPanelProps) {
  const strings = useClientStrings().meusPedidos;

  return (
    <>
      <Surface appearance="outline" tone="neutral">
        <Stack gap="sm">
          <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Stack gap="xs">
              <Text tone="muted" variant="caption" weight="bold">{strings.currentOrder.badge}</Text>
              <Text variant="h3" weight="bold">{order.code}</Text>
              <Text tone="muted" variant="caption">
                {strings.format.dashSeparated
                  .replace("{first}", order.kindLabel)
                  .replace("{second}", order.statusLabel)}
              </Text>
            </Stack>
            <Text tone="primary" weight="bold">{order.totalLabel}</Text>
          </Inline>
          <Text tone="muted">{order.summary}</Text>
          <OrderItemsPreview order={order} />
          <Button appearance="outline" tone="neutral" size="sm" onPress={() => onOpenDetails(order.id)}>
            {strings.history.details}
          </Button>
        </Stack>
      </Surface>

      {nextBox ? (
        <Surface appearance="outline" tone="neutral">
          <Stack gap="sm">
            <Text tone="primary" variant="caption" weight="bold">{strings.nextBox.badge}</Text>
            <Text variant="h3" weight="bold">{strings.nextBox.title}</Text>
            <Text weight="bold">{nextBox.deliveryEstimateLabel}</Text>
            <Text tone="muted">{nextBox.summary}</Text>
          </Stack>
        </Surface>
      ) : null}
    </>
  );
}
