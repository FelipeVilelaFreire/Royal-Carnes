import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { Grid, Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import { OrderItemsPreview } from "./OrderItemsPreview";
import { OrderTimeline } from "./OrderTimeline";
import { StatusPill } from "./StatusPill";
import styles from "../MeusPedidosView.module.css";

interface CurrentOrderPanelProps {
  nextBox: ClientOrderRowViewModel | null;
  onOpenDetails: (id: string | number) => void;
  order: ClientOrderRowViewModel;
}

export function CurrentOrderPanel({ nextBox, onOpenDetails, order }: CurrentOrderPanelProps) {
  const strings = useClientStrings().meusPedidos;
  return (
    <section>
      <Grid className={styles.currentGrid}>
        <Card className={styles.orderPanel} size="lg">
          <Stack gap="lg">
            <Inline className={styles.panelHeader} justify="between">
              <Stack gap="xs">
                <Badge appearance="soft" level="xs" tone="primary">{strings.currentOrder.badge}</Badge>
                <Text as="h2" variant="h2">{order.title}</Text>
                <Inline gap="sm"><Text tone="text-muted">{order.code}</Text><StatusPill order={order} /></Inline>
              </Stack>
              <Stack align="end" gap="xs">
                <Text variant="caption" tone="text-muted">{order.rawOrder.subscriptionId ? strings.currentOrder.subscription : strings.currentOrder.total}</Text>
                <Text variant="h3">{order.rawOrder.subscriptionId ? order.rawOrder.subscriptionPlanName || order.kindLabel : order.totalLabel}</Text>
              </Stack>
            </Inline>
            <div className={styles.currentDetails}>
              <Stack gap="xs"><Text variant="caption" tone="text-muted">{strings.currentOrder.estimate}</Text><Text weight="var(--theme--typography-bold)">{order.deliveryEstimateLabel || strings.detail.awaitingConfirmation}</Text></Stack>
              <Stack gap="xs"><Text variant="caption" tone="text-muted">{strings.currentOrder.payment}</Text><Text weight="var(--theme--typography-bold)">{order.paymentMethodLabel || strings.detail.awaitingConfirmation}</Text></Stack>
            </div>
            <OrderTimeline order={order} />
            <Inline align="start" gap="lg">
              <div className={styles.deliveryCode}>
                <Text variant="caption" tone="text-muted">{strings.currentOrder.deliveryCode}</Text>
                <Text variant="h1">{order.deliveryCodeLabel}</Text>
                <Text variant="caption" tone="text-muted">{strings.currentOrder.deliveryCodeHint}</Text>
              </div>
              <Stack gap="sm">
                <Text weight="var(--theme--typography-bold)">{strings.currentOrder.items}</Text>
                <OrderItemsPreview order={order} />
                <Button appearance="outline" onClick={() => onOpenDetails(order.id)} size="sm" tone="neutral">{strings.history.details}</Button>
              </Stack>
            </Inline>
          </Stack>
        </Card>
        {nextBox ? (
          <Card className={styles.imagePanel} size="lg">
            {nextBox.imageUrl ? <img alt={nextBox.title} className={styles.boxImage} src={nextBox.imageUrl} /> : null}
            <div className={styles.imageOverlay}><Stack gap="sm"><Badge appearance="soft" level="xs" tone="primary">{strings.nextBox.badge}</Badge><Text as="h2" variant="h2">{strings.nextBox.title}</Text><Text weight="var(--theme--typography-bold)">{nextBox.deliveryEstimateLabel}</Text><Text tone="text-muted">{nextBox.summary}</Text></Stack></div>
          </Card>
        ) : null}
      </Grid>
    </section>
  );
}
