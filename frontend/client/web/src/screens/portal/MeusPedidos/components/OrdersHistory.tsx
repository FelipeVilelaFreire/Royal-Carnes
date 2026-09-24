import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import { StatusPill } from "./StatusPill";
import styles from "../MeusPedidosView.module.css";

interface OrdersHistoryProps { isLoading: boolean; onOpenDetails: (id: string | number) => void; orders: ClientOrderRowViewModel[]; }

export function OrdersHistory({ isLoading, onOpenDetails, orders }: OrdersHistoryProps) {
  const strings = useClientStrings().meusPedidos;
  return (
    <Card className={styles.historyPanel} size="lg">
      <Stack gap="lg">
        <Inline justify="between"><Text as="h2" variant="h2">{strings.history.title}</Text>{isLoading ? <Text tone="text-muted">{strings.states.loading}</Text> : null}</Inline>
        <div className={styles.historyList}>
          {orders.map((order) => (
            <Card className={[styles.historyRow, styles.modalItem].join(" ")} key={order.id} size="lg">
              <Stack gap="md">
                <Inline align="start" justify="between">
                  <Stack gap="xs"><Text weight="var(--theme--typography-bold)">{order.kindLabel}</Text><Text variant="caption" tone="text-muted">{strings.format.dashSeparated.replace("{first}", order.code).replace("{second}", order.title)}</Text></Stack>
                  <StatusPill order={order} />
                </Inline>
                <div className={styles.historyMeta}>
                  <Stack gap="xs"><Text variant="caption" tone="text-muted">{order.createdAtLabel}</Text><Text variant="caption" tone="text-muted">{order.itemCount} {strings.history.itemSuffix}</Text></Stack>
                  <Text weight="var(--theme--typography-bold)">{order.totalLabel}</Text>
                </div>
                <Inline className={styles.actions}><Button appearance="outline" onClick={() => onOpenDetails(order.id)} size="sm" tone="neutral">{strings.history.details}</Button></Inline>
              </Stack>
            </Card>
          ))}
        </div>
      </Stack>
    </Card>
  );
}
