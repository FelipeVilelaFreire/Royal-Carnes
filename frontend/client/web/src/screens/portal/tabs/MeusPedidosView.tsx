"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { EmptyState } from "@foundation/ui/EmptyState";
import { CheckIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { BottomModal, Modal } from "@foundation/ui/Modal";
import { Container, Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Text } from "@foundation/ui/Text";
import { useClientOrders } from "@royalprime/client/hooks/useClientOrders";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import styles from "./meus-pedidos/styles.module.css";
import { orderSurfaceStyles } from "./meus-pedidos/surfaceStyles";

export interface MeusPedidosViewProps {
  onNavigate?: (path: string) => void;
  showShell?: boolean;
}

const statusToneLabel = (tone: ClientOrderRowViewModel["statusTone"]) => tone;

function StatusPill({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <span className={styles.statusPill} data-tone={statusToneLabel(order.statusTone)}>
      <span className={styles.dot} aria-hidden="true" />
      {order.statusLabel}
    </span>
  );
}

function OrderItemsPreview({ order }: { order: ClientOrderRowViewModel }) {
  return (
    <div className={styles.itemsList}>
      {order.items.slice(0, 3).map((item) => (
        <div className={styles.itemRow} key={item.id}>
          <Text weight="var(--theme--typography-bold)">{item.name}</Text>
          <Text tone="text-muted">{item.quantityLabel}</Text>
        </div>
      ))}
    </div>
  );
}

function OrderDetailDialog({
  isMobile,
  onClose,
  open,
  order,
}: {
  isMobile: boolean;
  onClose: () => void;
  open: boolean;
  order: ClientOrderRowViewModel | null;
}) {
  const strings = useClientStrings().meusPedidos;
  const Surface = isMobile ? BottomModal : Modal;

  return (
    <Surface
      ariaLabel={strings.detail.title}
      closeLabel={strings.detail.close}
      description={order ? `${order.code} - ${order.kindLabel}` : undefined}
      onClose={onClose}
      open={open}
      size="lg"
      title={order?.title || strings.detail.title}
    >
      {order ? (
        <Stack gap="lg">
          <Inline justify="between">
            <Stack gap="xs">
              <StatusPill order={order} />
              <Text tone="text-muted">{order.summary}</Text>
            </Stack>
            <Stack align="end" gap="xs">
              <Text variant="caption" tone="text-muted">{strings.currentOrder.total}</Text>
              <Text variant="h3">{order.totalLabel}</Text>
            </Stack>
          </Inline>

          <Grid className={styles.modalMetaGrid}>
            {[
              { key: "date", label: strings.detail.date, value: order.createdAtLabel },
              { key: "estimate", label: strings.detail.estimate, value: order.deliveryEstimateLabel },
              { key: "payment", label: strings.detail.payment, value: order.paymentMethodLabel },
              { key: "code", label: strings.detail.deliveryCode, value: order.deliveryCodeLabel },
            ].map((item) => (
              <Card className={styles.modalMetric} key={item.key} size="sm" style={orderSurfaceStyles.modalMetric}>
                <Stack gap="xs">
                  <Text variant="caption" tone="text-muted">{item.label}</Text>
                  <Text weight="var(--theme--typography-bold)">{item.value || "--"}</Text>
                </Stack>
              </Card>
            ))}
          </Grid>

          {order.cycleUsage ? (
            <Card className={styles.cyclePanel} size="sm" style={orderSurfaceStyles.cycle}>
              <Stack gap="md">
                <Inline justify="between">
                  <Text weight="var(--theme--typography-bold)">{strings.cycle.title}</Text>
                  <span className={styles.cycleBadge}>
                    {order.cycleUsage.cycleLabel}
                  </span>
                </Inline>
                <Grid className={styles.cycleGrid}>
                  {order.cycleUsage.metrics.map((metric) => (
                    <Stack gap="xs" key={metric.key}>
                      <Text variant="caption" tone="text-muted">{strings.cycle[metric.labelKey]}</Text>
                      <Text weight="var(--theme--typography-bold)">{metric.valueLabel}</Text>
                    </Stack>
                  ))}
                </Grid>
              </Stack>
            </Card>
          ) : null}

          <Stack gap="sm">
            <Text as="h3" variant="h3">{strings.detail.items}</Text>
            <Grid className={styles.modalItemsGrid}>
              {order.items.map((item) => (
                <Card className={styles.modalItem} key={item.id} size="sm" style={orderSurfaceStyles.modalItem}>
                  <Inline justify="between">
                    <Stack gap="xs">
                      <Text weight="var(--theme--typography-bold)">{item.name}</Text>
                      <Text variant="caption" tone="text-muted">{item.categoryLabel || item.quantityLabel}</Text>
                    </Stack>
                    <Text weight="var(--theme--typography-bold)">{item.quantityLabel}</Text>
                  </Inline>
                </Card>
              ))}
            </Grid>
          </Stack>

          <Stack gap="sm">
            <Text as="h3" variant="h3">{strings.detail.tracking}</Text>
            <div className={styles.timelineGrid}>
              {order.timelineSteps.map((step) => (
                <div
                  className={styles.timelineStep}
                  data-completed={step.completed || undefined}
                  data-current={step.isCurrent || undefined}
                  key={step.key}
                >
                  <span className={styles.timelineMarker}>
                    {step.completed ? <CheckIcon size={12} /> : null}
                  </span>
                  <Text variant="caption" tone={step.completed || step.isCurrent ? "text" : "text-muted"}>
                    {step.label}
                  </Text>
                </div>
              ))}
            </div>
          </Stack>
        </Stack>
      ) : null}
    </Surface>
  );
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = () => {
  const strings = useClientStrings().meusPedidos;
  const orders = useClientOrders({ fallbackOnError: true });
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
  const nextBox = orders.viewModel.nextSubscriptionOrder;

  return (
    <div className={styles.page}>
      <Container className={styles.content} gutter="page" width="wide">
        <section className={styles.hero}>
          <Stack gap="sm">
            <span className={styles.sourceBadge}>
              {orders.source === "api" ? strings.source.api : strings.source.fallback}
            </span>
            <Text as="h1" variant="h1">{strings.title}</Text>
            <Text tone="text-muted">{strings.subtitle}</Text>
            {orders.error ? <Text tone="text-muted">{strings.states.error}</Text> : null}
          </Stack>
          <Grid className={styles.statsGrid}>
            <Card className={styles.statCard} size="sm" style={orderSurfaceStyles.stat}>
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.stats.activeOrders}</Text>
                <Text variant="h2">{orders.viewModel.totals.activeOrders}</Text>
              </Stack>
            </Card>
            <Card className={styles.statCard} size="sm" style={orderSurfaceStyles.stat}>
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.stats.deliveredOrders}</Text>
                <Text variant="h2">{orders.viewModel.totals.deliveredOrders}</Text>
              </Stack>
            </Card>
            <Card className={styles.statCard} size="sm" style={orderSurfaceStyles.stat}>
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.history.title}</Text>
                <Text variant="h2">{orders.viewModel.totals.orders}</Text>
              </Stack>
            </Card>
          </Grid>
        </section>

        {orders.viewModel.orders.length === 0 ? (
          <EmptyState
            description={strings.subtitle}
            framed
            icon={<UserIcon size={28} />}
            title={orders.isLoading ? strings.states.loading : strings.states.empty}
          />
        ) : null}

        {currentOrder ? (
          <section>
          <Grid className={styles.currentGrid}>
            <Card className={styles.orderPanel} size="lg" style={orderSurfaceStyles.order}>
              <Stack gap="lg">
                <Inline className={styles.panelHeader} justify="between">
                  <Stack gap="xs">
                    <span className={styles.sourceBadge}>{strings.currentOrder.badge}</span>
                    <Text as="h2" variant="h2">{currentOrder.code}</Text>
                    <Text tone="text-muted">{currentOrder.kindLabel} - {currentOrder.statusLabel}</Text>
                  </Stack>
                  <Stack align="end" gap="xs">
                    <Text variant="caption" tone="text-muted">{strings.currentOrder.total}</Text>
                    <Text variant="h3">{currentOrder.totalLabel}</Text>
                  </Stack>
                </Inline>

                <div className={styles.timelineGrid}>
                  {currentOrder.timelineSteps.map((step) => (
                    <div
                      className={styles.timelineStep}
                      data-completed={step.completed || undefined}
                      data-current={step.isCurrent || undefined}
                      key={step.key}
                    >
                      <span className={styles.timelineMarker}>
                        {step.completed ? <CheckIcon size={12} /> : null}
                      </span>
                      <Text variant="caption" tone={step.completed || step.isCurrent ? "text" : "text-muted"}>
                        {step.label}
                      </Text>
                    </div>
                  ))}
                </div>

                <Inline align="start" gap="lg">
                  <div className={styles.deliveryCode}>
                    <Text variant="caption" tone="text-muted">{strings.currentOrder.deliveryCode}</Text>
                    <Text variant="h1">{currentOrder.deliveryCodeLabel}</Text>
                    <Text variant="caption" tone="text-muted">{strings.currentOrder.deliveryCodeHint}</Text>
                  </div>
                  <Stack gap="sm">
                    <Text weight="var(--theme--typography-bold)">{strings.currentOrder.items}</Text>
                    <OrderItemsPreview order={currentOrder} />
                  </Stack>
                </Inline>
              </Stack>
            </Card>

            {nextBox ? (
              <Card className={styles.imagePanel} size="lg" style={orderSurfaceStyles.image}>
                {nextBox.imageUrl ? (
                  <img alt={nextBox.title} className={styles.boxImage} src={nextBox.imageUrl} />
                ) : null}
                <div className={styles.imageOverlay}>
                  <Stack gap="sm">
                    <span className={styles.sourceBadge}>{strings.nextBox.badge}</span>
                    <Text as="h2" variant="h2">{strings.nextBox.title}</Text>
                    <Text weight="var(--theme--typography-bold)">{nextBox.deliveryEstimateLabel}</Text>
                    <Text tone="text-muted">{nextBox.summary}</Text>
                  </Stack>
                </div>
              </Card>
            ) : null}
          </Grid>
          </section>
        ) : null}

        <Card className={styles.historyPanel} size="lg" style={orderSurfaceStyles.history}>
          <Stack gap="lg">
            <Inline justify="between">
              <Text as="h2" variant="h2">{strings.history.title}</Text>
              {orders.isLoading ? <Text tone="text-muted">{strings.states.loading}</Text> : null}
            </Inline>
            <div className={styles.historyList}>
              {orders.viewModel.orders.map((order) => (
                <Card className={styles.historyRow} key={order.id} size="sm" style={orderSurfaceStyles.modalItem}>
                  <Stack gap="xs">
                    <Text weight="var(--theme--typography-bold)">{order.kindLabel}</Text>
                    <Text variant="caption" tone="text-muted">{order.code} - {order.title}</Text>
                  </Stack>
                  <Text>{order.createdAtLabel}</Text>
                  <StatusPill order={order} />
                  <Text weight="var(--theme--typography-bold)">{order.totalLabel}</Text>
                  <Inline className={styles.actions}>
                    <Button appearance="outline" onClick={() => setSelectedOrderId(order.id)} size="sm" tone="neutral">
                      {strings.history.details}
                    </Button>
                    {order.canReview ? (
                      <Button appearance="outline" size="sm" tone="neutral">
                        {strings.history.review}
                      </Button>
                    ) : null}
                  </Inline>
                </Card>
              ))}
            </div>
          </Stack>
        </Card>
      </Container>

      <OrderDetailDialog
        isMobile={isMobile}
        onClose={() => setSelectedOrderId(null)}
        open={Boolean(selectedOrder)}
        order={selectedOrder}
      />
    </div>
  );
};
