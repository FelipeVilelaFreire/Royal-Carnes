"use client";

import React, { useMemo } from "react";
import { Button } from "@foundation/ui/web/Button";
import { UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Container, Stack } from "@foundation/ui/web/Layout";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useClientCustomer } from "@royalprime/client/hooks/useClientCustomer";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { EmptyStateScreen } from "../feedback/EmptyStateScreen/EmptyStateScreen";
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

  const hasCustomer = Boolean(customer.dataSource.customer.id);

  if (customer.isLoading || customer.error || !hasCustomer) {
    const title = customer.isLoading
      ? strings.states.loading
      : customer.error
        ? strings.states.error
        : strings.states.empty;
    const description = customer.isLoading
      ? strings.states.loadingDescription
      : customer.error
        ? strings.states.errorDescription
        : strings.states.emptyDescription;

    return (
      <div className={styles.page}>
        <EmptyStateScreen
          actions={customer.error ? (
            <Button appearance="outline" onClick={() => void customer.actions.reload()} tone="neutral">
              {strings.states.retry}
            </Button>
          ) : undefined}
          description={description}
          icon={<UserIcon />}
          title={title}
        />
      </div>
    );
  }

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
            <AccountProfileSummary strings={strings} viewModel={customer.viewModel} />
            <ProfileModuleContent customer={customer} onNavigate={onNavigate} strings={strings} />
          </Stack>
        </div>
      </Container>
    </div>
  );
};
