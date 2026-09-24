import { Inline, Text } from "@foundation/ui/native";
import type { ClientOrderRowViewModel } from "../../../../../../shared-core/view-models/orders.view-model";

export function OrderTimeline({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <Inline gap="sm">
      {order.timelineSteps.map((step) => (
        <Text
          key={step.key}
          tone={step.completed || step.isCurrent ? "primary" : "muted"}
          variant="caption"
          weight={step.isCurrent ? "bold" : undefined}
        >
          {step.label}
        </Text>
      ))}
    </Inline>
  );
}
