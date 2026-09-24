import { Inline, Modal, Stack, Surface, Text } from "@foundation/ui/native";
import { useClientStrings } from "../../../../../../shared-core/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";
import { OrderItemsPreview } from "./OrderItemsPreview";

interface OrderDetailDialogProps {
  onClose: () => void;
  open: boolean;
  order: ClientOrderRowViewModel | null;
}

export function OrderDetailDialog({ onClose, open, order }: OrderDetailDialogProps) {
  const strings = useClientStrings().meusPedidos;

  return (
    <Modal
      closeLabel={strings.detail.close}
      description={order ? `${order.code} - ${order.kindLabel}` : undefined}
      onClose={onClose}
      open={open}
      title={order?.title || strings.detail.title}
    >
      {order ? (
        <Stack gap="sm">
          <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Text tone="muted" variant="caption">{order.statusLabel}</Text>
            <Text tone="primary" weight="bold">{order.totalLabel}</Text>
          </Inline>
          <Text tone="muted">{order.summary}</Text>
          <Surface appearance="outline" tone="neutral">
            <Stack gap="xs">
              <Text tone="muted" variant="caption" weight="bold">{strings.detail.payment}</Text>
              <Text weight="bold">{order.paymentMethodLabel}</Text>
            </Stack>
          </Surface>
          <OrderItemsPreview order={order} />
        </Stack>
      ) : null}
    </Modal>
  );
}
