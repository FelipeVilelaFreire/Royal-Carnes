"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@foundation/ui/web/Button";
import { BoxIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Container } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useClientOrders } from "@royalprime/client/hooks/useClientOrders";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { CurrentOrderPanel } from "./components/CurrentOrderPanel";
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import { OrdersHistory } from "./components/OrdersHistory";
import { EmptyStateScreen } from "../feedback/EmptyStateScreen/EmptyStateScreen";
import styles from "./MeusPedidosView.module.css";

export interface MeusPedidosViewProps {
  onNavigate?: (path: string) => void;
  showShell?: boolean;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = () => {
  const strings = useClientStrings().meusPedidos;
  const orders = useClientOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    void orders.load().catch(() => undefined);
  }, [orders.load]);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth <= 768);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const selectedOrder = useMemo(
    () => orders.viewModel.orders.find((order) => order.id === selectedOrderId) || null,
    [orders.viewModel.orders, selectedOrderId],
  );
  const currentOrder = orders.viewModel.currentOrder;
  const historyOrders = orders.viewModel.orders.filter((order) => order.id !== currentOrder?.id);
  const hasOrders = orders.viewModel.orders.length > 0;

  if (!hasOrders) {
    const isError = Boolean(orders.error);
    const title = orders.isLoading ? strings.states.loading : isError ? strings.states.error : strings.states.empty;
    const description = orders.isLoading
      ? strings.states.loadingDescription
      : isError
        ? strings.states.errorDescription
        : strings.states.emptyDescription;

    return (
      <div className={styles.page}>
        <main>
          <EmptyStateScreen
            actions={isError ? <Button appearance="outline" onClick={() => void orders.load()} tone="neutral">{strings.states.retry}</Button> : undefined}
            description={description}
            icon={<BoxIcon />}
            title={title}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ScreenHeader
        description={strings.subtitle}
        mobileGutter="none"
        mobileMode="collapsible"
        mobileTitle={strings.header.mobileTitle}
        showScrollBorder={false}
        title={strings.title}
      />
      <main className="appear-on-scroll">
        <Container className={styles.content} gutter="page" width="wide">
          {orders.error ? <div className={styles.syncNotice} role="status"><Text tone="text-muted">{strings.states.error}</Text></div> : null}

          {currentOrder ? (
            <CurrentOrderPanel
              nextBox={orders.viewModel.nextSubscriptionOrder}
              onOpenDetails={setSelectedOrderId}
              order={currentOrder}
            />
          ) : null}

          {historyOrders.length > 0 ? <OrdersHistory isLoading={orders.isLoading} onOpenDetails={setSelectedOrderId} orders={historyOrders} /> : null}
        </Container>
      </main>

      <OrderDetailDialog
        isMobile={isMobile}
        onClose={() => setSelectedOrderId(null)}
        open={Boolean(selectedOrder)}
        order={selectedOrder}
      />
    </div>
  );
};
