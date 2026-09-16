import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Inline } from "@foundation/ui/native/Layout";
import type { ClientCustomerTabKey } from "../../../../../../../shared-core/hooks/useClientCustomer";

export function ProfileTabNavigation({
  activeTab,
  items,
  onSelect,
  spacing,
}: {
  activeTab: ClientCustomerTabKey;
  items: Array<{ key: ClientCustomerTabKey; label: string }>;
  onSelect: (tab: ClientCustomerTabKey) => void;
  spacing: unknown;
}) {
  return (
    <Inline style={{ gap: spacing, flexWrap: "wrap" }}>
      {items.map((tab) => (
        <Button
          appearance={activeTab === tab.key ? "soft" : "outline"}
          key={tab.key}
          onAction={() => onSelect(tab.key)}
          tone="neutral"
        >
          {tab.label}
        </Button>
      ))}
    </Inline>
  );
}
