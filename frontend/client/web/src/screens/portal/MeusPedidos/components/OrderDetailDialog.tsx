import { Badge } from "@foundation/ui/web/Badge";
import { Card } from "@foundation/ui/web/Card";
import { BottomModal, Modal } from "@foundation/ui/web/Modal";
import { Grid, Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import { OrderTimeline } from "./OrderTimeline";
import { StatusPill } from "./StatusPill";
import styles from "../MeusPedidosView.module.css";

interface OrderDetailDialogProps { isMobile: boolean; onClose: () => void; open: boolean; order: ClientOrderRowViewModel | null; }

export function OrderDetailDialog({ isMobile, onClose, open, order }: OrderDetailDialogProps) {
  const strings = useClientStrings().meusPedidos;
  const Surface = isMobile ? BottomModal : Modal;
  return (
    <Surface ariaLabel={strings.detail.title} closeLabel={strings.detail.close} description={order ? `${order.code} - ${order.kindLabel}` : undefined} onClose={onClose} open={open} size="lg" title={order?.title || strings.detail.title}>
      {order ? (
        <Stack gap="lg">
          <Inline justify="between"><Stack gap="xs"><StatusPill order={order} /><Text tone="text-muted">{order.summary}</Text></Stack><Stack align="end" gap="xs"><Text variant="caption" tone="text-muted">{order.rawOrder.subscriptionId ? strings.currentOrder.subscription : strings.currentOrder.total}</Text><Text variant="h3">{order.rawOrder.subscriptionId ? strings.detail.includedInSubscription : order.totalLabel}</Text></Stack></Inline>
          <Grid className={styles.modalMetaGrid}>
            {[
              { key: "date", label: strings.detail.date, value: order.createdAtLabel },
              { key: "estimate", label: strings.detail.estimate, value: order.deliveryEstimateLabel || strings.detail.awaitingConfirmation },
              { key: "payment", label: strings.detail.payment, value: order.paymentMethodLabel || strings.detail.awaitingConfirmation },
              { key: "code", label: strings.detail.deliveryCode, value: order.deliveryCodeLabel === "--" ? strings.detail.awaitingConfirmation : order.deliveryCodeLabel },
            ].map((item) => <Card className={styles.modalMetric} key={item.key} size="sm"><Stack gap="xs"><Text variant="caption" tone="text-muted">{item.label}</Text><Text weight="var(--theme--typography-bold)">{item.value || "--"}</Text></Stack></Card>)}
          </Grid>
          {order.cycleUsage ? <Card className={styles.cyclePanel} size="sm"><Stack gap="md"><Inline justify="between"><Text weight="var(--theme--typography-bold)">{strings.cycle.title}</Text><Badge appearance="soft" level="xs" tone="primary">{order.cycleUsage.cycleLabel}</Badge></Inline><Grid className={styles.cycleGrid}>{order.cycleUsage.metrics.map((metric) => <Stack gap="xs" key={metric.key}><Text variant="caption" tone="text-muted">{strings.cycle[metric.labelKey]}</Text><Text weight="var(--theme--typography-bold)">{metric.valueLabel}</Text></Stack>)}</Grid></Stack></Card> : null}
          <Stack gap="sm"><Text as="h3" variant="h3">{strings.detail.items}</Text><Grid className={styles.modalItemsGrid}>{order.items.map((item) => <Card className={styles.modalItem} key={item.id} size="sm"><Inline justify="between"><Stack gap="xs"><Text weight="var(--theme--typography-bold)">{item.name}</Text><Text variant="caption" tone="text-muted">{item.categoryLabel || item.quantityLabel}</Text></Stack><Text weight="var(--theme--typography-bold)">{item.quantityLabel}</Text></Inline></Card>)}</Grid></Stack>
          <Stack gap="sm"><Text as="h3" variant="h3">{strings.detail.tracking}</Text><OrderTimeline order={order} /></Stack>
        </Stack>
      ) : null}
    </Surface>
  );
}
