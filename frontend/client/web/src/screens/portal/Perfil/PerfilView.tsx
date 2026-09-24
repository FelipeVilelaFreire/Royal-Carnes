"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@foundation/ui/web/Button";
import { LogoutIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Container, Stack } from "@foundation/ui/web/Layout";
import { ConfirmationModal } from "@foundation/ui/web/Modal";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useClientCustomer } from "@royalprime/client/hooks/useClientCustomer";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { EmptyStateScreen } from "../feedback/EmptyStateScreen/EmptyStateScreen";
import { AccountProfileSummary, AccountProfileSummarySkeleton } from "./minha-conta/fixed/AccountProfileSummary";
import { AccountSidebarNav, AccountSidebarNavSkeleton } from "./minha-conta/fixed/AccountSidebarNav";
import { ProfileModuleContent } from "./minha-conta/modules/ProfileModuleContent";
import styles from "./minha-conta/styles.module.css";
import type { AccountTabItem } from "./minha-conta/types";

export interface PerfilViewProps {
  onNavigate?: (path: string) => void;
  onLogout?: () => Promise<void> | void;
  showShell?: boolean;
}

export const PerfilView: React.FC<PerfilViewProps> = ({ onLogout, onNavigate }) => {
  const strings = useClientStrings().minhaContaV2;
  const customer = useClientCustomer();
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout?.();
      setIsLogoutConfirmationOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!customer.isLoading && (customer.error || !hasCustomer)) {
    const title = customer.error
        ? strings.states.error
        : strings.states.empty;
    const description = customer.error
        ? strings.states.errorDescription
        : strings.states.emptyDescription;

    return (
      <div className={styles.page}>
        <main className={styles.emptyStateMain}>
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
        </main>
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
        <Stack gap="lg">
          {customer.isLoading ? <AccountProfileSummarySkeleton /> : <AccountProfileSummary strings={strings} viewModel={customer.viewModel} />}
          <div className={styles.mainGrid}>
            {customer.isLoading ? <AccountSidebarNavSkeleton /> : <AccountSidebarNav activeTab={customer.activeTab} items={tabs} onSelect={customer.actions.setActiveTab} />}
            <ProfileModuleContent
              customer={customer}
              onLogoutRequest={() => setIsLogoutConfirmationOpen(true)}
              onNavigate={onNavigate}
              strings={strings}
            />
          </div>
        </Stack>
      </Container>
      <ConfirmationModal
        cancelLabel={strings.security.logoutConfirmation.cancel}
        closeLabel={strings.actions.closeModal}
        confirmLabel={strings.security.logoutConfirmation.confirm}
        description={strings.security.logoutConfirmation.description}
        icon={<LogoutIcon size={28} />}
        isLoading={isLoggingOut}
        onCancel={() => setIsLogoutConfirmationOpen(false)}
        onConfirm={() => void confirmLogout()}
        open={isLogoutConfirmationOpen}
        size="xs"
        title={strings.security.logoutConfirmation.title}
        tone="danger"
        variant="center"
      />
    </div>
  );
};
