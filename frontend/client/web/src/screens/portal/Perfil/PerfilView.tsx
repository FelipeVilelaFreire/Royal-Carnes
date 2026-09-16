"use client";

import React, { useMemo } from "react";
import { Container, Stack } from "@foundation/ui/web/Layout";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useClientCustomer } from "@royalprime/client/hooks/useClientCustomer";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { PlanComparisonModal } from "./minha-conta/components";
import { AccountProfileSummary } from "./minha-conta/fixed/AccountProfileSummary";
import { AccountSidebarNav } from "./minha-conta/fixed/AccountSidebarNav";
import { ProfileModuleContent } from "./minha-conta/modules/ProfileModuleContent";
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

  return (
    <div className={styles.page}>
      <div className={styles.mobileScreenHeader}>
        <ScreenHeader
          description={strings.subtitle}
          eyebrow={strings.eyebrow}
          mobileMode="collapsible"
          mobileTitle={strings.title}
          showScrollBorder={false}
          title={strings.title}
        />
      </div>
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
            <AccountProfileSummary
              onChangePlan={customer.actions.openPlansModal}
              strings={strings}
              viewModel={customer.viewModel}
            />
            <ProfileModuleContent customer={customer} onNavigate={onNavigate} strings={strings} />
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
