import React, { useEffect, useMemo, useState } from "react";
import { subscriptionsFallbackDataSource } from "../../../../../shared-core/data-sources/subscriptions.fallback";
import { useClientCurrentCycle } from "../../../../../shared-core/hooks/useClientCurrentCycle";
import { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { useClientSubscription } from "../../../../../shared-core/hooks/useClientSubscription";
import { Button, Container, Icon, Inline, Stack, Surface, Text } from "../../../ui";
import { createMobileAppShellConfig, type AppThemeMode } from "../../../shell/AppShell/config";

export interface MinhaCaixaViewProps {
  activePath?: string;
  themeMode?: AppThemeMode;
}

type EligibleProduct = typeof subscriptionsFallbackDataSource.eligibleProducts[number];

export const MinhaCaixaView: React.FC<MinhaCaixaViewProps> = ({ themeMode = "dark" }) => {
  const strings = useClientStrings().minhaCaixa;
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const subscription = useClientSubscription({ fallbackOnError: true });
  const cycle = useClientCurrentCycle({ fallbackOnError: true });
  const [pendingProductKey, setPendingProductKey] = useState<string | null>(null);
  const selectedProductKeys = useMemo(
    () => new Set(cycle.viewModel.selectedItems.map((item) => item.productKey).filter(Boolean)),
    [cycle.viewModel.selectedItems],
  );

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  };
  const nestedCardStyle = {
    backgroundColor: theme.surfaceContainer,
    borderColor: theme.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  };

  useEffect(() => {
    void Promise.all([subscription.load(), cycle.load()]).catch(() => undefined);
  }, [cycle.load, subscription.load]);

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
      // The hook stores the normalized API error; fallback keeps phase 1 navigable.
    } finally {
      setPendingProductKey(null);
    }
  };

  const currentPlanName = subscription.viewModel.planName || strings.states.noPlan;
  const cycleLabel = cycle.viewModel.cycleNumber
    ? `${strings.cycle.numberPrefix} ${cycle.viewModel.cycleNumber}`
    : strings.states.noCycle;

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
          {subscription.error || cycle.error ? (
            <Text tone="muted" variant="caption">{strings.states.error}</Text>
          ) : null}
        </Stack>

        <Surface appearance="outline" tone="neutral" style={cardStyle}>
          <Stack gap="sm">
            <Inline gap="sm" style={{ justifyContent: "space-between" }}>
              <Stack gap="xs">
                <Text tone="muted" variant="caption" weight="bold">
                  {strings.stats.plan}
                </Text>
                <Text variant="h3" weight="bold">{currentPlanName}</Text>
              </Stack>
              <Stack gap="xs" style={{ alignItems: "flex-end" }}>
                <Text tone="muted" variant="caption" weight="bold">
                  {strings.stats.selected}
                </Text>
                <Text tone="primary" variant="h3" weight="bold">
                  {cycle.viewModel.selectedItems.length}
                </Text>
              </Stack>
            </Inline>
            <Text tone="muted">
              {cycleLabel}
            </Text>
          </Stack>
        </Surface>

        <Surface appearance="outline" tone="neutral" style={cardStyle}>
          <Stack gap="sm">
            <Text variant="h3" weight="bold">{strings.cycle.title}</Text>
            <Text tone="muted">
              {cycle.viewModel.rangeLabel || strings.cycle.rangeFallback}
            </Text>
            <Stack gap="sm">
              {cycle.viewModel.usage.map((metric) => (
                <Inline gap="sm" key={metric.key} style={{ justifyContent: "space-between" }}>
                  <Text tone="muted" variant="caption">{strings.usage[metric.key]}</Text>
                  <Text weight="bold">{metric.valueLabel}</Text>
                </Inline>
              ))}
            </Stack>
          </Stack>
        </Surface>

        <Stack gap="sm">
          <Text variant="h3" weight="bold">{strings.selected.title}</Text>
          {cycle.viewModel.selectedItems.length ? (
            cycle.viewModel.selectedItems.map((item) => (
              <Surface key={item.id} appearance="outline" tone="neutral" style={nestedCardStyle}>
                <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Stack gap="xs">
                    <Text weight="bold">{item.name}</Text>
                    <Text tone="muted" variant="caption">{item.categoryLabel}</Text>
                  </Stack>
                  <Text tone="muted" variant="caption">{item.quantityLabel}</Text>
                </Inline>
              </Surface>
            ))
          ) : (
            <Surface appearance="soft" tone="neutral" style={nestedCardStyle}>
              <Text tone="muted">{strings.selected.emptyTitle}</Text>
            </Surface>
          )}
        </Stack>

        <Stack gap="sm">
          <Text variant="h3" weight="bold">{strings.catalog.title}</Text>
          {subscriptionsFallbackDataSource.eligibleProducts.slice(0, 5).map((product) => {
            const isSelected = selectedProductKeys.has(product.key);
            return (
              <Surface key={product.id} appearance="outline" tone="neutral" style={nestedCardStyle}>
                <Stack gap="sm">
                  <Inline gap="sm" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Stack gap="xs">
                      <Text weight="bold">{product.name}</Text>
                      <Text tone="muted" variant="caption">{product.categoryLabel}</Text>
                    </Stack>
                    <Text tone="primary" variant="caption" weight="bold">{product.unitLabel}</Text>
                  </Inline>
                  <Text tone="muted">{product.description}</Text>
                  <Button
                    appearance={isSelected ? "soft" : "outline"}
                    disabled={pendingProductKey === product.key}
                    icon={<Icon intent={isSelected ? "success" : "box"} />}
                    onPress={() => handleSelectProduct(product)}
                    size="sm"
                    tone="neutral"
                  >
                    {isSelected ? strings.catalog.selected : strings.catalog.select}
                  </Button>
                </Stack>
              </Surface>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};
