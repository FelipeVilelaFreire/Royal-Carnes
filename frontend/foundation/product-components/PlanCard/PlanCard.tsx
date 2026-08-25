import React from "react";
import { Card } from "../../ui/Card/Card";
import { Text } from "../../ui/Text/Text";
import { Button } from "../../ui/Button/Button";

export interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    recommended?: boolean;
    features: string[];
  };
  onSelect?: (planId: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const price = typeof plan.price === "number" ? plan.price : 0;

  return (
    <Card style={{ position: "relative", padding: "28px" }}>
      {plan.recommended && (
        <div style={{ position: "absolute", top: "16px", right: "16px", background: "#D4AF37", color: "#121212", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
          Mais Popular
        </div>
      )}

      <Text variant="h2" style={{ marginBottom: "4px", fontSize: "24px" }}>{plan.name}</Text>
      <Text variant="caption" style={{ opacity: 0.7, marginBottom: "16px" }}>
        {plan.description}
      </Text>

      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
        <Text variant="caption" style={{ opacity: 0.7 }}>R$</Text>
        <Text variant="h1" style={{ fontSize: "36px", color: "#D4AF37" }}>{price.toFixed(2)}</Text>
        <Text variant="caption" style={{ opacity: 0.7 }}>/ mês</Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
        {plan.features.map((feat, idx) => (
          <Text key={idx} variant="body" style={{ fontSize: "14px" }}>✓ {feat}</Text>
        ))}
      </div>

      <Button
        style={{ width: "100%", background: plan.recommended ? "#D4AF37" : "transparent", color: plan.recommended ? "#121212" : "#F5F5F5", border: plan.recommended ? "none" : "1px solid rgba(255,255,255,0.2)", fontWeight: "700" }}
        onClick={() => onSelect && onSelect(plan.id)}
      >
        Assinar {plan.name}
      </Button>
    </Card>
  );
};
