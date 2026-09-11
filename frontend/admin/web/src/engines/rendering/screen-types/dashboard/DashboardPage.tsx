import React from "react";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Grid, Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { ChevronRightIcon, FlameIcon, StarIcon, TruckIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminDashboardViewModel, AdminDashboardWidgetKey } from "@/view-models/dashboard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import type { DashboardConfig } from "../config/types";
import styles from "./DashboardPage.module.css";

export interface DashboardPageProps {
  config: DashboardConfig;
  isLoading?: boolean;
  onViewOrders?: () => void;
  t: AdminTranslate;
  viewModel: AdminDashboardViewModel;
}

function renderWidgetIcon(key: string | undefined, widgetKey: string) {
  const iconKey = key || widgetKey;
  if (iconKey === "subscribers") return <UserIcon aria-hidden="true" />;
  if (iconKey === "deliveries") return <TruckIcon aria-hidden="true" />;
  if (iconKey === "retention") return <StarIcon aria-hidden="true" />;
  return <FlameIcon aria-hidden="true" />;
}

function toBadgeTone(tone: string | undefined) {
  if (tone === "success" || tone === "warning" || tone === "danger" || tone === "primary") return tone;
  return "neutral";
}

function renderMetricHelper(text: string, tone: string | undefined) {
  return (
    <span className={styles.metricHelper} data-tone={toBadgeTone(tone)}>
      <span aria-hidden="true" className={styles.metricHelperDot} />
      <Text as="span" tone="muted" variant="caption">{text}</Text>
    </span>
  );
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ config, isLoading = false, onViewOrders, t, viewModel }) => {
  const widgetsByKey = new Map(viewModel.widgets.map((widget) => [widget.key, widget]));

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere={config.layout.atmosphere} usefulColumns={config.layout.usefulColumns} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="start" justify="between" wrap>
            <Stack className={styles.heading} gap="xs">
              {config.headerBadge ? <span className={styles.headerEyebrow}><span aria-hidden="true" className={styles.headerEyebrowDot} /><Text as="span" tone="muted" variant="caption" weight="bold">{t(config.headerBadge.labelKey)}</Text></span> : null}
              <Text as="h1" variant="h1">{t(config.titleKey)}</Text>
              <Text tone="muted" variant="body">{t(config.subtitleKey)}</Text>
            </Stack>
            <Inline className={styles.stateBar} gap="sm">
              {isLoading ? <Badge appearance="soft" tone="neutral">{t("dashboard.loading")}</Badge> : null}
            </Inline>
          </Inline>

          <Grid className={styles.kpiGrid} columns={config.layout.kpis.columns} gap={config.layout.kpis.gap}>
            {config.widgets.map((widget) => {
              const widgetView = widgetsByKey.get(widget.key as AdminDashboardWidgetKey);
              return (
                <Surface appearance={widget.surface.appearance} className={styles.kpiCard} key={widget.key} tone={widget.surface.tone}>
                  <Inline justify="between" wrap={false}>
                    <Text as="span" className={styles.kpiLabel} tone="muted" variant="caption" weight="bold">{t(widget.titleKey)}</Text>
                    <span className={styles.kpiIcon}>{renderWidgetIcon(widget.iconKey, widget.key)}</span>
                  </Inline>
                  <Text as="strong" className={styles.kpiValue} font="var(--theme--typography-monoFamily)" variant="h2">{widgetView?.value || widget.value || "-"}</Text>
                  {renderMetricHelper(widgetView ? t(widgetView.helperKey, widget.helper, widgetView.helperVariables) : widget.helper || "-", widgetView?.tone)}
                </Surface>
              );
            })}
          </Grid>

          <Stack className={styles.tableSection} gap="sm">
            <Inline className={styles.tableHeader} justify="between" wrap>
              <Inline gap="sm" wrap={false}>
                <Text as="h2" variant="h3">{t(config.recentOrders.titleKey)}</Text>
                <Badge appearance="soft" level="2xs" tone="neutral">{t("dashboard.recordCount", undefined, { count: viewModel.recentOrders.length })}</Badge>
              </Inline>
              <Button appearance="transparent" icon={<ChevronRightIcon aria-hidden="true" />} iconPosition="end" onClick={onViewOrders} size="sm">
                {t(config.recentOrders.action.labelKey)}
              </Button>
            </Inline>
            <Surface appearance={config.recentOrders.surface.appearance} className={styles.tableCard} tone={config.recentOrders.surface.tone}>
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead><tr>{config.recentOrders.columns.map((column) => <th key={column.key}>{t(column.labelKey)}</th>)}</tr></thead>
                <tbody>{viewModel.recentOrders.length ? viewModel.recentOrders.map((order) => (
                  <tr key={order.id}>{config.recentOrders.columns.map((column) => {
                    if (column.key === "order") return <td className={styles.orderCode} key={column.key}>{order.id}</td>;
                    if (column.key === "status") return <td key={column.key}><Badge appearance="soft" indicator statusColor={order.statusColor} tone={toBadgeTone(order.statusTone)}>{order.statusLabel}</Badge></td>;
                    return <td className={column.key === "member" ? styles.primaryCell : styles.secondaryCell} key={column.key}>{order[column.key as "member" | "plan" | "box" | "date"]}</td>;
                  })}</tr>
                )) : <tr><td className={styles.emptyCell} colSpan={config.recentOrders.columns.length}>{t("dashboard.emptyRecentOrders")}</td></tr>}</tbody>
              </table>
            </div>
            </Surface>
          </Stack>

          <Stack className={styles.tableSection} gap="sm">
            <Inline className={styles.tableHeader} justify="between" wrap>
              <Inline gap="sm" wrap={false}>
                <Text as="h2" variant="h3">{t(config.plans.titleKey)}</Text>
                <Badge appearance="soft" level="2xs" tone="neutral">{t("dashboard.planCount", undefined, { count: viewModel.plans.length })}</Badge>
              </Inline>
            </Inline>
            <Surface appearance={config.plans.surface.appearance} className={styles.tableCard} tone={config.plans.surface.tone}>
            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead><tr>{config.plans.columns.map((column) => <th key={column.key}>{t(column.labelKey)}</th>)}</tr></thead>
                <tbody>{viewModel.plans.length ? viewModel.plans.map((plan) => (
                  <tr key={plan.id}><td className={styles.planName}>{plan.name}</td><td className={styles.moneyValue}>{plan.price}</td><td className={styles.secondaryCell}>{t(plan.billingIntervalKey)}</td><td>{plan.entitlementCount}</td><td>{plan.activeSubscribers}</td><td><Badge appearance="soft" indicator statusColor={plan.statusColor} tone={toBadgeTone(plan.statusTone)}>{t(plan.statusKey)}</Badge></td></tr>
                )) : <tr><td className={styles.emptyCell} colSpan={config.plans.columns.length}>{t("dashboard.emptyPlans")}</td></tr>}</tbody>
              </table>
            </div>
            </Surface>
          </Stack>
        </Stack>
      </SectionContainer>
    </div>
  );
};
