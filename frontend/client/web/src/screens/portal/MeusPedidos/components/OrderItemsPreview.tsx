import { Text } from "@foundation/ui/web/Text";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import styles from "../MeusPedidosView.module.css";

export function OrderItemsPreview({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <div className={styles.itemsList}>
      {order.items.slice(0, 3).map((item) => (
        <div className={styles.itemRow} key={item.id}>
          <Text weight="var(--theme--typography-bold)">{item.name}</Text>
          <Text tone="text-muted">{item.quantityLabel}</Text>
        </div>
      ))}
    </div>
  );
}
