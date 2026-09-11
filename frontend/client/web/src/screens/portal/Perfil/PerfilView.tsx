"use client";

import React, { useMemo } from "react";
import { Container, Stack } from "@foundation/ui/Layout";
import { useClientCustomer, type ClientCustomerTabKey } from "@royalprime/client/hooks/useClientCustomer";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import {
  AccountHeroSummary,
  AccountSidebarNav,
  AddressListPanel,
  CycleUsageGrid,
  NotificationsPanel,
  PaymentPanel,
  PlanComparisonModal,
  ProfileFormPanel,
  RecentOrdersPanel,
  SecurityPanel,
  SubscriptionPanel,
} from "./minha-conta/components";
import styles from "./minha-conta/styles.module.css";
import type { AccountTabItem } from "./minha-conta/types";

export interface PerfilViewProps {
  onNavigate?: (path: string) => void;
  showShell?: boolean;
}

export const PerfilView: React.FC<PerfilViewProps> = ({ onNavigate }) => {
  const strings = useClientStrings().minhaContaV2;
  const customer = useClientCustomer();

  const tabs = useMemo<AccountTabItem[]>(() => [
    { key: "overview", label: strings.tabs.overview },
    { key: "subscription", label: strings.tabs.subscription },
    { key: "orders", label: strings.tabs.orders },
    { key: "data", label: strings.tabs.personalData },
    { key: "addresses", label: strings.tabs.addresses },
    { key: "payments", label: strings.tabs.payment },
    { key: "notifications", label: strings.tabs.preferences },
    { key: "security", label: strings.tabs.security },
  ], [strings]);

  const renderActivePanel = (activeTab: ClientCustomerTabKey) => {
    if (activeTab === "subscription") {
      return (
        <SubscriptionPanel
          currentPlanKey={customer.selectedPlanKey}
          onChangePlan={customer.actions.openPlansModal}
          plans={customer.dataSource.plans}
          strings={strings}
          viewModel={customer.viewModel}
        />
      );
    }

    if (activeTab === "orders") {
      return (
        <RecentOrdersPanel
          onNavigate={onNavigate}
          orders={customer.dataSource.recentOrders}
          strings={strings}
        />
      );
    }

    if (activeTab === "data") {
      return (
        <ProfileFormPanel
          draft={customer.profileDraft}
          onSave={customer.actions.saveProfileDraft}
          onUpdate={customer.actions.updateProfileDraft}
          saveState={customer.saveState}
          strings={strings}
        />
      );
    }

    if (activeTab === "addresses") {
      return (
        <AddressListPanel
          addresses={customer.dataSource.customer.addresses}
          strings={strings}
        />
      );
    }

    if (activeTab === "payments") {
      return (
        <PaymentPanel
          invoices={customer.dataSource.invoices}
          paymentMethods={customer.dataSource.customer.paymentMethods}
          strings={strings}
        />
      );
    }

    if (activeTab === "notifications") {
      return (
        <NotificationsPanel
          notifications={customer.notifications}
          onUpdate={customer.actions.updateNotification}
          strings={strings}
        />
      );
    }

    if (activeTab === "security") {
      return <SecurityPanel strings={strings} />;
    }

    return (
      <Stack gap="lg">
        <AccountHeroSummary
          onChangePlan={customer.actions.openPlansModal}
          strings={strings}
          viewModel={customer.viewModel}
        />
        <CycleUsageGrid metrics={customer.viewModel.usageMetrics} strings={strings} />
        <RecentOrdersPanel
          onNavigate={onNavigate}
          orders={customer.dataSource.recentOrders.slice(0, 2)}
          strings={strings}
        />
      </Stack>
    );
  };

  return (
    <div className={styles.page}>
      <Container className={styles.content} gutter="page" width="wide">
        <div className={styles.mainGrid}>
          <AccountSidebarNav
            activeTab={customer.activeTab}
            items={tabs}
            onSelect={customer.actions.setActiveTab}
            strings={strings}
            viewModel={customer.viewModel}
          />
          <Stack gap="lg">
            {renderActivePanel(customer.activeTab)}
          </Stack>
        </div>
      </Container>
      <PlanComparisonModal
        currentPlanKey={customer.selectedPlanKey}
        onClose={() => customer.actions.setIsPlansModalOpen(false)}
        onConfirm={customer.actions.confirmPlanChange}
        onSelect={customer.actions.setPendingPlanKey}
        open={customer.isPlansModalOpen}
        plans={customer.dataSource.plans}
        selectedPlanKey={customer.pendingPlanKey}
        strings={strings}
      />
    </div>
  );
};
