import React, { useEffect, useMemo, useState } from "react";
import { useClientOrders } from "../../../../../shared-core/hooks/useClientOrders";
import { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { Button, Container, Inline, Modal, Stack, Surface, Text } from "@foundation/native/client-ui";
import { createMobileAppShellConfig, type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";

export interface MeusPedidosViewProps {
  activePath?: string;
  themeMode?: AppThemeMode;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = ({ themeMode = "dark" }) => {
  const strings = useClientStrings().meusPedidos;
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const orders = useClientOrders();
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
      <Stack gap="md">
        <Stack gap="sm">
          <Text variant="h1" weight="bold">{strings.title}</Text>
          <Text tone="muted">{strings.subtitle}</Text>
        </Stack>

        <Surface
          appearance="outline"
          tone="neutral"
          style={cardStyle}
        >
          <Inline gap="sm" style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stack gap="xs">
              <Text tone="muted" variant="caption" weight="bold">
                {strings.stats.activeOrders}
              </Text>
              <Text variant="h2" weight="bold">{orders.viewModel.totals.activeOrders}</Text>
            </Stack>
            <Stack gap="xs">
              <Text tone="muted" variant="caption" weight="bold">
                {strings.stats.deliveredOrders}
              </Text>
              <Text variant="h2" weight="bold">{orders.viewModel.totals.deliveredOrders}</Text>
            </Stack>
            <Stack gap="xs">
              <Text tone="muted" variant="caption" weight="bold">
                {strings.history.title}
              </Text>
              <Text variant="h2" weight="bold">{orders.viewModel.totals.orders}</Text>
            </Stack>
          </Inline>
        </Surface>

        {currentOrder ? (
          <Surface
            appearance="outline"
            tone="neutral"
            style={cardStyle}
          >
            <Stack gap="sm">
              <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                <Stack gap="xs">
                  <Text tone="muted" variant="caption" weight="bold">
                    {strings.currentOrder.badge}
                  </Text>
                  <Text variant="h3" weight="bold">{currentOrder.code}</Text>
                  <Text tone="muted" variant="caption">{strings.format.dashSeparated.replace("{first}", currentOrder.kindLabel).replace("{second}", currentOrder.statusLabel)}</Text>
                </Stack>
                <Text tone="primary" weight="bold">
                  {currentOrder.totalLabel}
                </Text>
              </Inline>
              <Text tone="muted">{currentOrder.summary}</Text>
              <Stack gap="sm">
                {currentOrder.items.slice(0, 4).map((item) => (
                  <Inline gap="sm" key={item.id} style={{ justifyContent: "space-between" }}>
                    <Text weight="bold">{item.name}</Text>
                    <Text tone="muted" variant="caption">{item.quantityLabel}</Text>
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
            <Stack gap="sm">
              <Text tone="primary" variant="caption" weight="bold">
                {strings.nextBox.badge}
              </Text>
              <Text variant="h3" weight="bold">{strings.nextBox.title}</Text>
              <Text weight="bold">{nextBox.deliveryEstimateLabel}</Text>
              <Text tone="muted">{nextBox.summary}</Text>
            </Stack>
          </Surface>
        ) : null}

        <Stack gap="sm">
          <Text variant="h3" weight="bold">{strings.history.title}</Text>
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
                <Stack gap="sm">
                  <Inline gap="sm" style={{ justifyContent: "space-between" }}>
                    <Text weight="bold">{order.code}</Text>
                    <Text tone="primary" variant="caption" weight="bold">{order.totalLabel}</Text>
                  </Inline>
                  <Text tone="muted" variant="caption">
                    {strings.format.dashSeparated.replace("{first}", order.statusLabel).replace("{second}", `${order.itemCount} ${strings.history.itemSuffix}`)}
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
              <Text tone="muted">
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
          <Stack gap="sm">
            <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
              <Text tone="muted" variant="caption">{selectedOrder.statusLabel}</Text>
              <Text tone="primary" weight="bold">{selectedOrder.totalLabel}</Text>
            </Inline>
            <Text tone="muted">{selectedOrder.summary}</Text>
            <Surface appearance="outline" tone="neutral" style={nestedCardStyle}>
              <Stack gap="xs">
                <Text tone="muted" variant="caption" weight="bold">
                  {strings.detail.payment}
                </Text>
                <Text weight="bold">
                  {selectedOrder.paymentMethodLabel}
                </Text>
              </Stack>
            </Surface>
            <Stack gap="sm">
              {selectedOrder.items.map((item) => (
                <Inline gap="sm" key={item.id} style={{ justifyContent: "space-between" }}>
                  <Text weight="bold">{item.name}</Text>
                  <Text tone="muted" variant="caption">{item.quantityLabel}</Text>
                </Inline>
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Modal>
    </Container>
  );
};
