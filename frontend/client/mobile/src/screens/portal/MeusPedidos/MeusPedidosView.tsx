import React, { useEffect, useMemo, useState } from "react";
import { useClientOrders } from "../../../../../shared-core/hooks/useClientOrders";
import { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { Button, Container, Inline, Stack, Surface, Text } from "@foundation/ui/native";
import { useUi } from "@foundation/ui/native/context";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { normalizeScreenHeaderScrollProgress } from "@foundation/product-components/screens/shared";
import { type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";
import { EmptyStateScreen } from "../feedback/EmptyStateScreen/EmptyStateScreen";
import { CurrentOrderPanel } from "./components/CurrentOrderPanel";
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import { OrdersHistory } from "./components/OrdersHistory";

export interface MeusPedidosViewProps {
  activePath?: string;
  themeMode?: AppThemeMode;
}

type NativeScrollEvent = {
  nativeEvent?: {
    contentOffset?: {
      y?: number;
    };
  };
};

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = () => {
  const strings = useClientStrings().meusPedidos;
  const { designSystem, hosts } = useUi();
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const orders = useClientOrders();
  const rows = orders.viewModel.orders;
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
  const selectedOrder = useMemo(
    () => rows.find((order) => order.id === selectedOrderId) || null,
    [rows, selectedOrderId],
  );
  const currentOrder = orders.viewModel.currentOrder;
  const nextBox = orders.viewModel.nextSubscriptionOrder;
  const hasOrders = rows.length > 0;
  const [headerScrollProgress, setHeaderScrollProgress] = useState(0);
  const screenHeaderScrollRange = Math.max(Number(designSystem.theme.tokens.spacing?.space3xl || 0), 1);

  useEffect(() => {
    void orders.load().catch(() => undefined);
  }, [orders.load]);

  if (!hasOrders) {
    const isError = Boolean(orders.error);

    return (
      <ScrollContainer>
        <EmptyStateScreen
          actions={isError ? (
            <Button appearance="outline" tone="neutral" onPress={() => void orders.load()}>
              {strings.states.retry}
            </Button>
          ) : undefined}
          description={orders.isLoading
            ? strings.states.loadingDescription
            : isError
              ? strings.states.errorDescription
              : strings.states.emptyDescription}
          iconIntent="orders"
          title={orders.isLoading
            ? strings.states.loading
            : isError
              ? strings.states.error
              : strings.states.empty}
        />
      </ScrollContainer>
    );
  }

  return (
    <ScrollContainer
      onScroll={hosts.ScrollView ? (event: NativeScrollEvent) => setHeaderScrollProgress(
        normalizeScreenHeaderScrollProgress((event.nativeEvent?.contentOffset?.y || 0) / screenHeaderScrollRange),
      ) : undefined}
      scrollEventThrottle={hosts.ScrollView ? 16 : undefined}
      stickyHeaderIndices={hosts.ScrollView ? [0] : undefined}
    >
      <ScreenHeader
        description={strings.subtitle}
        eyebrow={strings.header.eyebrow}
        mobileMode="collapsible"
        mobileTitle={strings.header.mobileTitle}
        scrollProgress={headerScrollProgress}
        showScrollBorder={false}
        title={strings.title}
      />
      <Container style={{ flex: 1, minHeight: "100%", padding: designSystem.theme.tokens.spacing?.spaceLg }}>
        <Stack gap="md">
          <Surface appearance="outline" tone="neutral">
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

          {currentOrder ? <CurrentOrderPanel nextBox={nextBox} onOpenDetails={setSelectedOrderId} order={currentOrder} /> : null}

          <OrdersHistory onOpenDetails={setSelectedOrderId} orders={rows} />
        </Stack>
        <OrderDetailDialog onClose={() => setSelectedOrderId(null)} open={Boolean(selectedOrder)} order={selectedOrder} />
      </Container>
    </ScrollContainer>
  );
};
