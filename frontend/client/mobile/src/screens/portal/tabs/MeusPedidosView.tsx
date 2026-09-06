import React, { useEffect } from "react";
import { clientPtBR } from "../../../../../shared-core/locales/pt-BR";
import { useClientOrders } from "../../../../../shared-core/hooks/useClientOrders";
import { Button, Container, Inline, Stack, Surface, Text } from "../../../ui";
import { createMobileAppShellConfig, type AppThemeMode } from "../../../shell/AppShell/config";

export interface MeusPedidosViewProps {
  activePath?: string;
  themeMode?: AppThemeMode;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = ({ themeMode = "dark" }) => {
  const strings = clientPtBR.meusPedidos;
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const orders = useClientOrders();
  const rows = orders.viewModel.orders;

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
            {strings.currentOrder.badge}
          </Text>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "800" }}>{strings.title}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 15, lineHeight: 22 }}>{strings.subtitle}</Text>
        </Stack>

        <Surface
          appearance="outline"
          tone="neutral"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 16,
          }}
        >
          <Inline style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stack style={{ gap: 4 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
                {strings.stats.activeOrders}
              </Text>
              <Text style={{ color: theme.text, fontSize: 24, fontWeight: "800" }}>{rows.length}</Text>
            </Stack>
            <Button appearance="outline" tone="neutral" size="sm">
              {orders.isLoading ? strings.states.loading : strings.history.details}
            </Button>
          </Inline>
        </Surface>

        <Stack style={{ gap: 10 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>{strings.history.title}</Text>
          {rows.length ? (
            rows.map((order) => (
              <Surface
                key={order.id}
                appearance="outline"
                tone="neutral"
                style={{
                  backgroundColor: theme.surfaceContainer,
                  borderColor: theme.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 14,
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
                </Stack>
              </Surface>
            ))
          ) : (
            <Surface
              appearance="soft"
              tone="neutral"
              style={{
                backgroundColor: theme.surfaceContainer,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                {clientPtBR.minhaContaV2.empty.noOrders}
              </Text>
            </Surface>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};
