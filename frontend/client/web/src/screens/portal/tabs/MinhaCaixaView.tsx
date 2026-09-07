"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { EmptyState } from "@foundation/ui/EmptyState";
import { BoxIcon, CheckIcon, StoreIcon } from "@foundation/ui/Icon/AppIcons";
import { Container, Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Text } from "@foundation/ui/Text";
import { clientRoutes } from "@/manifest/routes";
import { subscriptionsFallbackDataSource } from "@royalprime/client/data-sources/subscriptions.fallback";
import { useClientCurrentCycle } from "@royalprime/client/hooks/useClientCurrentCycle";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { useClientSubscription } from "@royalprime/client/hooks/useClientSubscription";
import styles from "./minha-caixa/styles.module.css";

export interface MinhaCaixaViewProps {
  onNavigate?: (path: string) => void;
  showShell?: boolean;
}

type EligibleProduct = typeof subscriptionsFallbackDataSource.eligibleProducts[number];

function ProductCard({
  isSelected,
  onSelect,
  product,
}: {
  isSelected: boolean;
  onSelect: (product: EligibleProduct) => void;
  product: EligibleProduct;
}) {
  const strings = useClientStrings().minhaCaixa;

  return (
    <Card className={styles.productCard} size="sm">
      <Stack gap="md">
        <img alt={product.name} className={styles.productImage} src={product.imageUrl} />
        <Stack gap="xs">
          <Inline justify="between">
            <Badge appearance="soft" level="xs" tone="neutral">{product.categoryLabel}</Badge>
            <Text variant="caption" tone="text-muted">{product.unitLabel}</Text>
          </Inline>
          <Text as="h3" variant="h3">{product.name}</Text>
          <Text tone="text-muted">{product.description}</Text>
        </Stack>
        <Inline justify="between">
          <Text weight="var(--theme--typography-bold)">{product.priceLabel}</Text>
          <Button
            appearance={isSelected ? "soft" : "outline"}
            icon={isSelected ? <CheckIcon /> : <BoxIcon />}
            onClick={() => onSelect(product)}
            size="sm"
            tone="neutral"
          >
            {isSelected ? strings.catalog.selected : strings.catalog.select}
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
}

export const MinhaCaixaView: React.FC<MinhaCaixaViewProps> = ({ onNavigate }) => {
  const strings = useClientStrings().minhaCaixa;
  const subscription = useClientSubscription({ fallbackOnError: true });
  const cycle = useClientCurrentCycle({ fallbackOnError: true });
  const [pendingProductKey, setPendingProductKey] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([subscription.load(), cycle.load()]).catch(() => undefined);
  }, [cycle.load, subscription.load]);

  const selectedProductKeys = useMemo(
    () => new Set(cycle.viewModel.selectedItems.map((item) => item.productKey).filter(Boolean)),
    [cycle.viewModel.selectedItems],
  );

  const handleSelectProduct = async (product: EligibleProduct) => {
    setPendingProductKey(product.key);
    try {
      await cycle.selectItem({
        entitlementKey: product.entitlementKey,
        productKey: product.key,
        quantity: product.quantity,
        measurementUnitKey: product.measurementUnitKey,
      });
    } catch {
      // The hook keeps the normalized API error; phase 1 fallback keeps the UI usable.
    } finally {
      setPendingProductKey(null);
    }
  };

  const currentPlanName = subscription.viewModel.planName || strings.states.noPlan;
  const billingLabel = subscription.viewModel.planPriceLabel || strings.summary.billingFallback;
  const cycleLabel = cycle.viewModel.cycleNumber
    ? `${strings.cycle.numberPrefix} ${cycle.viewModel.cycleNumber}`
    : strings.states.noCycle;

  return (
    <div className={styles.page}>
      <Container className={styles.content} gutter="page" width="wide">
        <section className={styles.hero}>
          <Stack gap="sm">
            <Text as="h1" variant="h1">{strings.title}</Text>
            <Text tone="text-muted">{strings.subtitle}</Text>
            {subscription.error || cycle.error ? <Text tone="text-muted">{strings.states.error}</Text> : null}
          </Stack>

          <Grid className={styles.statsGrid}>
            <Card className={styles.statCard} size="sm">
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.stats.plan}</Text>
                <Text variant="h3">{currentPlanName}</Text>
              </Stack>
            </Card>
            <Card className={styles.statCard} size="sm">
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.stats.cycle}</Text>
                <Text variant="h3">{cycleLabel}</Text>
              </Stack>
            </Card>
            <Card className={styles.statCard} size="sm">
              <Stack gap="xs">
                <Text variant="caption" tone="text-muted">{strings.stats.selected}</Text>
                <Text variant="h3">{cycle.viewModel.selectedItems.length}</Text>
              </Stack>
            </Card>
          </Grid>
        </section>

        {!subscription.viewModel.isActive ? (
          <EmptyState
            description={strings.states.noPlanDescription}
            framed
            icon={<StoreIcon size={28} />}
            title={strings.states.noPlan}
          />
        ) : (
          <Grid className={styles.mainGrid}>
            <Stack gap="lg">
              <Card className={styles.cyclePanel} size="lg">
                <Stack gap="lg">
                  <Inline className={styles.panelHeader} justify="between">
                    <Stack gap="xs">
                      <Badge appearance="soft" level="xs" tone="primary">{strings.cycle.badge}</Badge>
                      <Text as="h2" variant="h2">{strings.cycle.title}</Text>
                      <Text tone="text-muted">{cycle.viewModel.rangeLabel || strings.cycle.rangeFallback}</Text>
                    </Stack>
                    <Text weight="var(--theme--typography-bold)">
                      {cycle.viewModel.isOpen ? strings.cycle.open : strings.cycle.locked}
                    </Text>
                  </Inline>

                  <Grid className={styles.usageGrid}>
                    {cycle.viewModel.usage.map((metric) => (
                      <Card className={styles.usageCard} key={metric.key} size="sm">
                        <Stack gap="xs">
                          <Text variant="caption" tone="text-muted">{strings.usage[metric.key]}</Text>
                          <Text weight="var(--theme--typography-bold)">{metric.valueLabel}</Text>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Stack>
              </Card>

              <section>
                <Stack gap="md">
                  <Inline justify="between">
                    <Stack gap="xs">
                      <Text as="h2" variant="h2">{strings.selected.title}</Text>
                      <Text tone="text-muted">{strings.selected.subtitle}</Text>
                    </Stack>
                    <Button appearance="soft" onClick={() => onNavigate?.(clientRoutes.produtos)} size="sm" tone="neutral">
                      {strings.selected.editAction}
                    </Button>
                  </Inline>

                  <Grid className={styles.selectedGrid}>
                    {cycle.viewModel.selectedItems.length ? (
                      cycle.viewModel.selectedItems.map((item) => (
                        <Card className={styles.selectedCard} key={item.id} size="sm">
                          <Inline align="start" justify="between">
                            <Stack gap="xs">
                              <Text weight="var(--theme--typography-bold)">{item.name}</Text>
                              <Text variant="caption" tone="text-muted">{item.categoryLabel}</Text>
                            </Stack>
                            <Text tone="text-muted">{item.quantityLabel}</Text>
                          </Inline>
                        </Card>
                      ))
                    ) : (
                      <EmptyState
                        description={strings.selected.emptyDescription}
                        framed
                        icon={<BoxIcon size={28} />}
                        title={strings.selected.emptyTitle}
                      />
                    )}
                  </Grid>
                </Stack>
              </section>

              <section>
                <Stack gap="md">
                  <Stack gap="xs">
                    <Text as="h2" variant="h2">{strings.catalog.title}</Text>
                    <Text tone="text-muted">{strings.catalog.subtitle}</Text>
                  </Stack>
                  <Grid className={styles.productsGrid}>
                    {subscriptionsFallbackDataSource.eligibleProducts.map((product) => (
                      <ProductCard
                        isSelected={selectedProductKeys.has(product.key)}
                        key={product.id}
                        onSelect={handleSelectProduct}
                        product={product}
                      />
                    ))}
                  </Grid>
                  {pendingProductKey ? <Text tone="text-muted">{strings.catalog.saving}</Text> : null}
                </Stack>
              </section>
            </Stack>

            <aside className={styles.summaryColumn}>
              <Card className={styles.summaryCard} size="lg">
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Badge appearance="soft" level="xs" tone="primary">{strings.summary.badge}</Badge>
                    <Text as="h2" variant="h2">{strings.summary.title}</Text>
                    <Text tone="text-muted">{strings.summary.description}</Text>
                  </Stack>
                  <div className={styles.summaryRows}>
                    <Inline justify="between">
                      <Text tone="text-muted">{strings.summary.plan}</Text>
                      <Text weight="var(--theme--typography-bold)">{currentPlanName}</Text>
                    </Inline>
                    <Inline justify="between">
                      <Text tone="text-muted">{strings.summary.cycle}</Text>
                      <Text weight="var(--theme--typography-bold)">{cycleLabel}</Text>
                    </Inline>
                    <Inline justify="between">
                      <Text tone="text-muted">{strings.summary.items}</Text>
                      <Text weight="var(--theme--typography-bold)">{cycle.viewModel.selectedItems.length}</Text>
                    </Inline>
                    <Inline justify="between">
                      <Text tone="text-muted">{strings.summary.billing}</Text>
                      <Text weight="var(--theme--typography-bold)">{billingLabel}</Text>
                    </Inline>
                  </div>
                  <Button appearance="solid" onClick={() => onNavigate?.(clientRoutes.meusPedidos)} tone="neutral">
                    {strings.summary.primaryAction}
                  </Button>
                </Stack>
              </Card>
            </aside>
          </Grid>
        )}
      </Container>
    </div>
  );
};
