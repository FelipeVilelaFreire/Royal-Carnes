import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Card } from "@foundation/ui/Card";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { Text } from "@foundation/ui/Text";
import { BoxIcon, ChevronRightIcon, FlameIcon, StarIcon, TruckIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminDashboardViewModel, AdminDashboardWidgetKey } from "@/view-models/dashboard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import type { DashboardConfig } from "../config/types";
import styles from "./DashboardPage.module.css";

export interface DashboardPageProps {
  config: DashboardConfig;
  isFallback?: boolean;
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

export const DashboardPage: React.FC<DashboardPageProps> = ({
  config,
  isLoading = false,
  onViewOrders,
  t,
  viewModel,
}) => {
  const widgetsByKey = new Map(viewModel.widgets.map((widget) => [widget.key, widget]));

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
        <Stack className={styles.content} gap="lg">
          <Inline align="start" justify="between" wrap>
            <Stack className={styles.heading} gap="xs">
              <Text as="h1" variant="h1">
                {t(config.titleKey)}
              </Text>
              <Text tone="muted" variant="body">
                {t(config.subtitleKey)}
              </Text>
            </Stack>

            <Inline className={styles.stateBar} gap="sm">
              {isLoading ? (
                <Badge appearance="soft" tone="neutral">
                  {t("dashboard.loading")}
                </Badge>
              ) : null}
            </Inline>
          </Inline>

          <Grid className={styles.kpiGrid} columns={4} gap="md">
            {config.widgets.map((widget) => {
              const widgetView = widgetsByKey.get(widget.key as AdminDashboardWidgetKey);
              return (
                <Card className={styles.kpiCard} key={widget.key} size="md">
                  <Inline justify="between" wrap={false}>
                    <Text as="span" className={styles.kpiLabel} tone="muted" variant="caption" weight="bold">
                      {t(widget.titleKey)}
                    </Text>
                    <span className={styles.kpiIcon}>{renderWidgetIcon(widget.iconKey, widget.key)}</span>
                  </Inline>

                  <Text as="strong" className={styles.kpiValue} variant="h2">
                    {widgetView?.value || widget.value || "-"}
                  </Text>

                  <Badge appearance="soft" className={styles.kpiHelper} tone={toBadgeTone(widgetView?.tone)}>
                    {widgetView
                      ? t(widgetView.helperKey, widget.helper, widgetView.helperVariables)
                      : widget.helper || "-"}
                  </Badge>
                </Card>
              );
            })}
          </Grid>

          <Card className={styles.tableCard} size="lg">
            <Inline justify="between" wrap>
              <Inline gap="sm" wrap={false}>
                <span className={styles.tableIcon}>
                  <BoxIcon aria-hidden="true" />
                </span>
                <Text as="h2" variant="h3">
                  {t("dashboard.tableTitle")}
                </Text>
              </Inline>

              <Button
                appearance="transparent"
                icon={<ChevronRightIcon aria-hidden="true" />}
                iconPosition="end"
                onClick={onViewOrders}
                size="sm"
              >
                {t("dashboard.viewAllBoxes")}
              </Button>
            </Inline>

            <div className={styles.tableScroller}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("dashboard.tableHeaders.order")}</th>
                    <th>{t("dashboard.tableHeaders.member")}</th>
                    <th>{t("dashboard.tableHeaders.plan")}</th>
                    <th>{t("dashboard.tableHeaders.box")}</th>
                    <th>{t("dashboard.tableHeaders.status")}</th>
                    <th>{t("dashboard.tableHeaders.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewModel.recentOrders.length ? (
                    viewModel.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={styles.orderCode}>{order.id}</td>
                        <td>{order.member}</td>
                        <td>{order.plan}</td>
                        <td>{order.box}</td>
                        <td>
                          <Badge appearance="soft" tone={toBadgeTone(order.statusTone)}>
                            {order.statusLabel}
                          </Badge>
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className={styles.emptyCell} colSpan={6}>
                        {t("dashboard.emptyRecentOrders")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Stack>
      </SectionContainer>
    </div>
  );
};
