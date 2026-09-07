"use client";

import React, { useMemo } from "react";
import { Badge, BottomModal, Modal, Stack, Surface, Text } from "@foundation/ui";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { prepareMockOrderViewModel, type PreparedOrderViewModel } from "./orderDisplayModel";
import styles from "./OrderDetailModal.module.css";

export interface OrderDetailModalProps {
  isDark: boolean;
  isMobile?: boolean;
  onClose: () => void;
  open: boolean;
  order: ClientOrderRowViewModel | null;
  viewModel?: PreparedOrderViewModel | null;
}

const statusTone = (tone: PreparedOrderViewModel["statusTone"]) => {
  if (tone === "success") return "success";
  if (tone === "danger") return "danger";
  if (tone === "pending") return "warning";
  return "primary";
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isMobile = false,
  onClose,
  open,
  order,
  viewModel: passedViewModel,
}) => {
  const strings = useClientStrings().orderDetailModal;
  const SurfaceModal = isMobile ? BottomModal : Modal;

  const vm = useMemo(() => {
    if (passedViewModel) return passedViewModel;
    if (order) return prepareMockOrderViewModel(order);
    return null;
  }, [order, passedViewModel]);

  return (
    <SurfaceModal
      ariaLabel={strings.title}
      closeLabel={strings.closeAction}
      description={vm ? `${vm.code} - ${vm.kindLabel}` : undefined}
      onClose={onClose}
      open={open}
      size="lg"
      title={vm?.title}
    >
      {vm ? (
        <div className={styles.content}>
          <div className={styles.header}>
            <Stack gap="xs">
              <Badge appearance="soft" tone={statusTone(vm.statusTone)}>
                {vm.statusLabel}
              </Badge>
              <Text as="p" className={styles.summary} tone="inherit">
                {vm.summary}
              </Text>
            </Stack>
            <div className={styles.totalBlock}>
              <span className={styles.label}>{strings.totalLabel}</span>
              <Text as="strong" className={styles.totalValue} tone="inherit" variant="h3">
                {vm.totalLabel}
              </Text>
            </div>
          </div>

          <div className={styles.metaGrid}>
            {[
              { key: "date", label: strings.dateLabel, value: vm.createdAtLabel },
              { key: "estimate", label: strings.estimateLabel, value: vm.deliveryEstimateLabel },
              { key: "payment", label: strings.paymentTitle, value: vm.paymentMethodLabel },
              { key: "code", label: strings.deliveryCodeLabel, value: vm.deliveryCodeLabel },
            ].map(({ key, label, value }) => (
              <Surface appearance="soft" className={styles.metaTile} key={key}>
                <span className={styles.label}>{label}</span>
                <Text
                  as="strong"
                  className={key === "code" ? styles.accentValue : styles.metricValue}
                  tone="inherit"
                  variant="body"
                >
                  {value}
                </Text>
              </Surface>
            ))}
          </div>

          {vm.cycleUsage ? (
            <Surface appearance="soft" className={styles.cyclePanel}>
              <div className={styles.cycleHeader}>
                <span className={styles.cycleTitle}>
                  {strings.cycleUsagePrefix} {vm.cycleUsage.cycleLabel}
                </span>
                <span className={styles.cycleRemaining}>{vm.cycleUsage.remainingLabel}</span>
              </div>
              <div className={styles.cycleGrid}>
                {vm.cycleUsage.metrics.map((metric) => (
                  <Surface appearance="soft" className={styles.cycleMetric} key={metric.key}>
                    <span className={styles.label}>{strings.cycleMetrics[metric.labelKey]}</span>
                    <Text as="strong" className={styles.metricValue} tone="inherit" variant="body">
                      {metric.valueLabel}
                    </Text>
                  </Surface>
                ))}
              </div>
            </Surface>
          ) : null}

          <Stack gap="sm">
            <Text as="h3" className={styles.sectionTitle} tone="inherit" variant="caption">
              {strings.itemsTitle}
            </Text>
            <div className={styles.itemsGrid}>
              {vm.items.map((item) => (
                <Surface appearance="soft" className={styles.itemCard} key={item.id}>
                  <div>
                    <Text as="strong" className={styles.itemName} tone="inherit" variant="body">
                      {item.name}
                    </Text>
                    <Text as="span" className={styles.itemMeta} tone="inherit" variant="caption">
                      {item.categoryLabel || strings.itemFallbackCategory} - {item.quantityLabel}
                    </Text>
                  </div>
                </Surface>
              ))}
            </div>
          </Stack>

          <Surface appearance="soft" className={styles.timelinePanel}>
            <Text as="h3" className={styles.sectionTitle} tone="inherit" variant="caption">
              {strings.trackingTitle}
            </Text>
            <div className={styles.timeline}>
              {vm.timelineSteps.map((step) => {
                const state = step.completed ? "done" : step.isCurrent ? "current" : "pending";
                return (
                  <div className={styles.timelineStep} data-state={state} key={step.key}>
                    <span className={styles.timelineDot}>
                      {step.completed ? <CheckIcon size={12} /> : null}
                    </span>
                    <Text as="span" tone="inherit" variant="caption">
                      {step.label}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>
      ) : null}
    </SurfaceModal>
  );
};
