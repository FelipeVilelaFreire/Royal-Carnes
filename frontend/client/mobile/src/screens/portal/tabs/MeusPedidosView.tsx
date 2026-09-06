import React, { useEffect, useMemo, useState } from "react";
import { useClientOrders } from "../../../../../shared-core/hooks/useClientOrders";
import { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { Button, Container, Inline, Modal, Stack, Surface, Text } from "../../../ui";
import { createMobileAppShellConfig, type AppThemeMode } from "../../../shell/AppShell/config";

export interface MeusPedidosViewProps {
  activePath?: string;
  themeMode?: AppThemeMode;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = ({ themeMode = "dark" }) => {
  const strings = useClientStrings().meusPedidos;
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const orders = useClientOrders({ fallbackOnError: true });
  const rows = orders.viewModel.orders;
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
  const selectedOrder = useMemo(
    () => rows.find((order) => order.id === selectedOrderId) || null,
    [rows, selectedOrderId],
  );
  const currentOrder = orders.viewModel.currentOrder;
  const nextBox = orders.viewModel.nextSubscriptionOrder;
  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  };
  const nestedCardStyle = {
    backgroundColor: theme.surfaceContainer,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  };

  useEffect(() => {
    void orders.load().catch(() => undefined);
  }, [orders.load]);

  return (
    <Container
      style={{
        backgroundColor: theme.background,
        minHeight: "100%",
        padding: 20,
      }}
    >
      <Stack style={{ gap: 16 }}>
        <Stack style={{ gap: 8 }}>
          <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "800", textTransform: "uppercase" }}>
            {orders.source === "api" ? strings.source.api : strings.source.fallback}
          </Text>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "800" }}>{strings.title}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 15, lineHeight: 22 }}>{strings.subtitle}</Text>
        </Stack>

        <Surface
          appearance="outline"
          tone="neutral"
          style={cardStyle}
        >
          <Inline style={{ alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Stack style={{ gap: 4 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                {strings.stats.activeOrders}
              </Text>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "800" }}>{orders.viewModel.totals.activeOrders}</Text>
            </Stack>
            <Stack style={{ gap: 4 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                {strings.stats.deliveredOrders}
              </Text>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "800" }}>{orders.viewModel.totals.deliveredOrders}</Text>
            </Stack>
            <Stack style={{ gap: 4 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                {strings.history.title}
              </Text>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "800" }}>{orders.viewModel.totals.orders}</Text>
            </Stack>
          </Inline>
        </Surface>

        {currentOrder ? (
          <Surface
            appearance="outline"
            tone="neutral"
            style={cardStyle}
          >
            <Stack style={{ gap: 12 }}>
              <Inline style={{ alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <Stack style={{ gap: 4 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                    {strings.currentOrder.badge}
                  </Text>
                  <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>{currentOrder.code}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>{currentOrder.kindLabel} - {currentOrder.statusLabel}</Text>
                </Stack>
                <Text style={{ color: theme.accent, fontSize: 15, fontWeight: "800" }}>
                  {currentOrder.totalLabel}
                </Text>
              </Inline>
              <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 20 }}>{currentOrder.summary}</Text>
              <Stack style={{ gap: 8 }}>
                {currentOrder.items.slice(0, 4).map((item) => (
                  <Inline key={item.id} style={{ justifyContent: "space-between", gap: 12 }}>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 13 }}>{item.quantityLabel}</Text>
                  </Inline>
                ))}
              </Stack>
              <Button appearance="outline" tone="neutral" size="sm" onPress={() => setSelectedOrderId(currentOrder.id)}>
                {strings.history.details}
              </Button>
            </Stack>
          </Surface>
        ) : null}

        {nextBox ? (
          <Surface appearance="outline" tone="neutral" style={cardStyle}>
            <Stack style={{ gap: 8 }}>
              <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "800", textTransform: "uppercase" }}>
                {strings.nextBox.badge}
              </Text>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>{strings.nextBox.title}</Text>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{nextBox.deliveryEstimateLabel}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 20 }}>{nextBox.summary}</Text>
            </Stack>
          </Surface>
        ) : null}

        <Stack style={{ gap: 10 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>{strings.history.title}</Text>
          {rows.length ? (
            rows.map((order) => (
              <Surface
                key={order.id}
                appearance="outline"
                tone="neutral"
                style={{
                  ...nestedCardStyle,
                }}
              >
                <Stack style={{ gap: 8 }}>
                  <Inline style={{ justifyContent: "space-between", gap: 12 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: "800" }}>{order.code}</Text>
                    <Text style={{ color: theme.accent, fontSize: 13, fontWeight: "800" }}>{order.totalLabel}</Text>
                  </Inline>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                    {order.statusLabel} - {order.itemCount} {strings.history.itemSuffix}
                  </Text>
                  <Button appearance="outline" tone="neutral" size="sm" onPress={() => setSelectedOrderId(order.id)}>
                    {strings.history.details}
                  </Button>
                </Stack>
              </Surface>
            ))
          ) : (
            <Surface
              appearance="soft"
              tone="neutral"
              style={nestedCardStyle}
            >
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                {strings.states.empty}
              </Text>
            </Surface>
          )}
        </Stack>
      </Stack>
      <Modal
        closeLabel={strings.detail.close}
        description={selectedOrder ? `${selectedOrder.code} - ${selectedOrder.kindLabel}` : undefined}
        onClose={() => setSelectedOrderId(null)}
        open={Boolean(selectedOrder)}
        title={selectedOrder?.title || strings.detail.title}
      >
        {selectedOrder ? (
          <Stack style={{ gap: 12 }}>
            <Inline style={{ alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>{selectedOrder.statusLabel}</Text>
              <Text style={{ color: theme.accent, fontSize: 15, fontWeight: "800" }}>{selectedOrder.totalLabel}</Text>
            </Inline>
            <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 20 }}>{selectedOrder.summary}</Text>
            <Surface appearance="outline" tone="neutral" style={nestedCardStyle}>
              <Stack style={{ gap: 6 }}>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                  {strings.detail.payment}
                </Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>
                  {selectedOrder.paymentMethodLabel}
                </Text>
              </Stack>
            </Surface>
            <Stack style={{ gap: 8 }}>
              {selectedOrder.items.map((item) => (
                <Inline key={item.id} style={{ justifyContent: "space-between", gap: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{item.name}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>{item.quantityLabel}</Text>
                </Inline>
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Modal>
    </Container>
  );
};
