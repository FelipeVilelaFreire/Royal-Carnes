"use client";

import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { useClientCustomer } from "@royalprime/client/hooks/useClientCustomer";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import {
  CheckIcon,
  ChevronRightIcon,
  LogoutIcon,
  SettingsIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
} from "@foundation/ui/Icon/AppIcons";
import styles from "./MeuClubeView.module.css";

export interface MeuClubeViewProps {
  onNavigate?: (path: string) => void;
}

type AccountMenuIcon = "person" | "truck" | "card" | "tune" | "bell";

const resolveMenuIcon = (icon: AccountMenuIcon) => {
  if (icon === "person") return UserIcon;
  if (icon === "truck") return TruckIcon;
  return SettingsIcon;
};

export const MeuClubeView: React.FC<MeuClubeViewProps> = ({ onNavigate }) => {
  const strings = useClientStrings().meuClube;
  const { viewModel, source } = useClientCustomer();
  const { activePlan, customer } = viewModel;

  const accountMenuItems = strings.accountMenuItems as Array<{
    key: string;
    label: string;
    icon: AccountMenuIcon;
  }>;

  return (
    <div className={styles.page}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div className={styles.content}>
          <Text variant="h1" tone="primary" weight="bold">
            {strings.title}
          </Text>

          <div className={styles.grid}>
            <div className={styles.column}>
              <div className={styles.profileHeader}>
                <Surface className={styles.avatar} appearance="soft" tone="primary">
                  <Text variant="h2" tone="primary" weight="bold">
                    {viewModel.initials}
                  </Text>
                </Surface>

                <div className={styles.column}>
                  <Text variant="h2" weight="bold">
                    {customer.name}
                  </Text>
                  <Text variant="body" tone="muted">
                    {strings.memberSincePrefix} {customer.memberSince}
                  </Text>
                </div>
              </div>

              <Surface className={styles.subscriptionCard} appearance="glass" tone="primary">
                <div className={styles.cardHeader}>
                  <div className={styles.column}>
                    <Badge appearance="soft" tone="success">
                      {strings.activeBadge}
                    </Badge>
                    <Text variant="h3" weight="bold">
                      {activePlan.name}
                    </Text>
                  </div>
                  <StarIcon size={24} color="currentColor" />
                </div>

                <div className={styles.priceBlock}>
                  <div className={styles.priceLine}>
                    <Text variant="h3" weight="bold">
                      {strings.currencyPrefix} {viewModel.planPriceLabel}
                    </Text>
                    <Text variant="caption" tone="muted">
                      {strings.monthSuffix}
                    </Text>
                  </div>
                  <Text variant="caption" tone="muted">
                    {strings.source[source]}
                  </Text>
                </div>

                <div className={styles.actions}>
                  <Button appearance="solid" tone="primary" size="md">
                    {strings.actions.manageSubscription}
                  </Button>
                  <Button appearance="outline" tone="neutral" size="md">
                    {strings.actions.pauseSubscription}
                  </Button>
                </div>

                <button className={styles.linkButton} type="button">
                  <Text variant="caption" tone="muted">
                    {strings.actions.cancelSubscription}
                  </Text>
                </button>
              </Surface>

              <div className={styles.benefits}>
                <Text variant="caption" tone="muted" weight="bold">
                  {strings.benefitsTitle}
                </Text>

                <div className={styles.benefitsList}>
                  {activePlan.features.map((benefit) => (
                    <div className={styles.benefitItem} key={benefit}>
                      <CheckIcon size={18} color="currentColor" />
                      <Text variant="body" weight="medium">
                        {benefit}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${styles.column} ${styles.accountColumn}`}>
              <Text variant="h2" weight="bold">
                {strings.accountTitle}
              </Text>

              <div className={styles.menuList}>
                {accountMenuItems.map((item) => {
                  const Icon = resolveMenuIcon(item.icon);
                  return (
                    <button className={styles.menuButton} key={item.key} type="button">
                      <span className={styles.menuButtonContent}>
                        <Icon size={20} color="currentColor" />
                        <Text variant="body" weight="medium">
                          {item.label}
                        </Text>
                      </span>
                      <ChevronRightIcon size={18} color="currentColor" />
                    </button>
                  );
                })}

                <button
                  className={styles.logoutButton}
                  onClick={() => onNavigate?.("/home")}
                  type="button"
                >
                  <LogoutIcon size={20} color="currentColor" />
                  <Text variant="caption" tone="danger" weight="bold">
                    {strings.actions.logout}
                  </Text>
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
