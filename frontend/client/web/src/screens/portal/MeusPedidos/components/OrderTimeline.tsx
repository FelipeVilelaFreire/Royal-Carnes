import { CheckIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Text } from "@foundation/ui/web/Text";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import styles from "../MeusPedidosView.module.css";

export function OrderTimeline({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <div className={styles.timelineGrid}>
      {order.timelineSteps.map((step) => (
        <div className={styles.timelineStep} data-completed={step.completed || undefined} data-current={step.isCurrent || undefined} key={step.key}>
          <span className={styles.timelineMarker}>{step.completed ? <CheckIcon size={12} /> : null}</span>
          <Text variant="caption" tone={step.completed || step.isCurrent ? "text" : "text-muted"}>{step.label}</Text>
        </div>
      ))}
    </div>
  );
}
