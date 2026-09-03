import React from "react";
import { Card } from "@foundation/ui/Card/Card";
import { Text } from "@foundation/ui/Text/Text";

export interface DeliveryTrackerProps {
  status: "preparing" | "in_transit" | "delivered";
  estimatedDate?: string;
  trackingCode?: string;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  status = "preparing",
  estimatedDate = "Amanhã até 18h",
  trackingCode = "PC-987654"
}) => {
  const statusLabels = {
    preparing: "Separando Cortes Especiais",
    in_transit: "Em Transporte Refrigerado",
    delivered: "Entregue"
  };

  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Text variant="h3" style={{ margin: 0 }}>Rastreio da Assinatura</Text>
        <span style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
          {statusLabels[status]}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Text variant="body" style={{ opacity: 0.8 }}>Código: <strong>{trackingCode}</strong></Text>
        <Text variant="body" style={{ opacity: 0.8 }}>Previsão: <strong>{estimatedDate}</strong></Text>
      </div>
    </Card>
  );
};
