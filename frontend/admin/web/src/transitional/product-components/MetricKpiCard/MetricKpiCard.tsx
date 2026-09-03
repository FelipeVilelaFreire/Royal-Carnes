import React from "react";
import { Card } from "@foundation/ui/Card/Card";
import { Text } from "@foundation/ui/Text/Text";

export interface MetricKpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true
}) => {
  return (
    <Card style={{ padding: "20px" }}>
      <Text variant="caption" style={{ opacity: 0.7, marginBottom: "8px" }}>{title}</Text>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <Text variant="h1" style={{ fontSize: "28px" }}>{value}</Text>
        {change && (
          <span style={{ color: isPositive ? "#22C55E" : "#EF4444", fontSize: "14px", fontWeight: "600" }}>
            {change}
          </span>
        )}
      </div>
    </Card>
  );
};
