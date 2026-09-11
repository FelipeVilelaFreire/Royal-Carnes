"use client";

import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { Input } from "@foundation/ui/web/Input";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Modal } from "@foundation/ui/web/Modal";
import { Text } from "@foundation/ui/web/Text";
import { CartIcon, CheckIcon, EditIcon, TruckIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCustomerAccountViewModel,
  ClientCustomerUsageMetric,
} from "@royalprime/client/view-models/customer.view-model";
import type {
  ClientCustomerAddress,
  ClientCustomerInvoice,
  ClientCustomerNotificationPreferences,
  ClientCustomerPaymentMethod,
  ClientCustomerPlan,
  ClientCustomerRecentOrder,
  ClientCustomerSubscriptionTier,
} from "@royalprime/client/contracts/customer.contract";
import type {
  ClientCustomerProfileDraft,
  ClientCustomerTabKey,
} from "@royalprime/client/hooks/useClientCustomer";
import { clientRoutes } from "@royalprime/client/manifest/routes";
import { AccountAvatar, AccountChip, AccountProgress } from "./primitives";
import styles from "./styles.module.css";
import type { AccountTabItem, MinhaContaStrings } from "./types";

const statusClassName = (tone: string) => {
  if (tone === "success") return styles.statusSuccess;
  if (tone === "danger") return styles.statusDanger;
  if (tone === "pending") return styles.statusPending;
  return "";
};

export function AccountSectionHeader({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <Stack gap="xs">
      <Text as="h2" variant="h2">{title}</Text>
      <Text tone="text-muted">{description}</Text>
    </Stack>
  );
}

export function AccountSidebarNav({
  activeTab,
  items,
  onSelect,
  strings,
  viewModel,
}: {
  activeTab: ClientCustomerTabKey;
  items: AccountTabItem[];
  onSelect: (tab: ClientCustomerTabKey) => void;
  strings: MinhaContaStrings;
  viewModel: ClientCustomerAccountViewModel;
}) {
  return (
    <aside className={styles.sidebar}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text as="span" variant="caption" tone="text" weight="var(--theme--typography-bold)">
            {strings.eyebrow}
          </Text>
          <Text as="h1" variant="h2">{strings.title}</Text>
          <Text tone="text-muted">
            {strings.format.greeting.replace("{greeting}", strings.greetingPrefix).replace("{name}", viewModel.customer.name.split(" ")[0]).replace("{subtitle}", strings.subtitle)}
          </Text>
        </Stack>
        <Card className={styles.highlightCard} size="sm">
          <Stack gap="sm">
            <Inline justify="between" wrap={false}>
              <Text variant="caption" tone="text-muted">{strings.planLabel}</Text>
              <AccountChip>{strings.badge}</AccountChip>
            </Inline>
            <Text weight="var(--theme--typography-bold)">{strings.planNamePrefix} {viewModel.activeSubscriptionLabel}</Text>
            <Text variant="caption" tone="text-muted">{strings.format.labelValue.replace("{label}", strings.renewLabel).replace("{value}", viewModel.nextBillingLabel)}</Text>
            <Button appearance="outline" size="sm" tone="neutral" onClick={() => onSelect("subscription")}>
              {strings.actions.manageSubscription}
            </Button>
          </Stack>
        </Card>
        <nav>
          <Inline className={styles.tabList} gap="xs">
            {items.map((item) => {
              const isActive = item.key === activeTab;
              return (
                <Button
                  appearance={isActive ? "soft" : "transparent"}
                  className={styles.tabButton}
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  size="sm"
                  tone="neutral"
                >
                  {item.label}
                </Button>
              );
            })}
          </Inline>
        </nav>
      </Stack>
    </aside>
  );
}

export function AccountHeroSummary({
  onChangePlan,
  strings,
  viewModel,
}: {
  onChangePlan: () => void;
  strings: MinhaContaStrings;
  viewModel: ClientCustomerAccountViewModel;
}) {
  return (
    <Card className={[styles.heroCard, styles.highlightCard].join(" ")} size="lg">
      <Stack gap="lg">
        <Inline align="start" justify="between">
          <Inline align="center" gap="md">
            <AccountAvatar initials={viewModel.initials} />
            <Stack gap="xs">
              <Text as="h2" variant="h1">{viewModel.customer.name}</Text>
              <Text tone="text-muted">{strings.headerGreeting}</Text>
            </Stack>
          </Inline>
          <Button appearance="outline" tone="neutral" onClick={onChangePlan}>
            {strings.actions.changePlan}
          </Button>
        </Inline>
        <div className={styles.statsGrid}>
          <SummaryStat label={strings.labels.plan} value={`${strings.planNamePrefix} ${viewModel.activeSubscriptionLabel}`} />
          <SummaryStat label={strings.renewLabel} value={viewModel.nextBillingLabel} />
          <SummaryStat label={strings.deliveryLabel} value={viewModel.nextDeliveryLabel} />
          <SummaryStat label={strings.memberSinceLabel} value={viewModel.customer.memberSince} />
        </div>
      </Stack>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap="xs">
      <Text variant="caption" tone="text-muted">{label}</Text>
      <Text weight="var(--theme--typography-bold)">{value}</Text>
    </Stack>
  );
}

export function CycleUsageGrid({
  metrics,
  strings,
}: {
  metrics: ClientCustomerUsageMetric[];
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <AccountSectionHeader title={strings.sections.capacityTitle} description={strings.sections.capacityDescription} />
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} strings={strings} />
          ))}
        </div>
      </Stack>
    </Card>
  );
}

function MetricCard({
  metric,
  strings,
}: {
  metric: ClientCustomerUsageMetric;
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.nestedCard} size="sm">
      <Stack gap="sm">
        <Text variant="caption" tone="text-muted">{strings.usage[metric.labelKey as keyof typeof strings.usage]}</Text>
        <Text variant="h3">{metric.valueLabel}</Text>
        <AccountProgress value={metric.percent} />
      </Stack>
    </Card>
  );
}

export function RecentOrdersPanel({
  onNavigate,
  orders,
  strings,
}: {
  onNavigate?: (path: string) => void;
  orders: ClientCustomerRecentOrder[];
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <Inline justify="between">
          <AccountSectionHeader title={strings.sections.recentOrdersTitle} description={strings.sections.recentOrdersDescription} />
          <Button appearance="outline" tone="neutral" onClick={() => onNavigate?.(clientRoutes.meusPedidos)}>
            {strings.actions.viewDetails}
          </Button>
        </Inline>
        {orders.length === 0 ? <Text tone="text-muted">{strings.empty.noOrders}</Text> : null}
        <Stack gap="sm">
          {orders.map((order) => (
            <Card className={styles.nestedCard} key={order.id} size="sm">
              <Inline align="start" gap="md" justify="between">
                <Inline align="start" gap="md">
                  <img className={styles.orderImage} src={order.imageUrl} alt={order.title} />
                  <Stack gap="xs">
                    <Inline gap="xs">
                      <AccountChip>{order.kindLabel}</AccountChip>
                      <AccountChip muted>{order.code}</AccountChip>
                    </Inline>
                    <Text as="h3" variant="h3">{order.title}</Text>
                    <Text tone="text-muted">{order.summary}</Text>
                  </Stack>
                </Inline>
                <Stack align="end" gap="xs">
                  <Text className={statusClassName(order.statusTone)} weight="var(--theme--typography-bold)">
                    {order.statusLabel}
                  </Text>
                  <Text variant="caption" tone="text-muted">{strings.format.labelValue.replace("{label}", strings.labels.estimate).replace("{value}", order.estimateLabel)}</Text>
                  <Text weight="var(--theme--typography-bold)">{order.totalLabel}</Text>
                </Stack>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export function SubscriptionPanel({
  currentPlanKey,
  onChangePlan,
  plans,
  strings,
  viewModel,
}: {
  currentPlanKey: ClientCustomerSubscriptionTier;
  onChangePlan: () => void;
  plans: ClientCustomerPlan[];
  strings: MinhaContaStrings;
  viewModel: ClientCustomerAccountViewModel;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <Inline justify="between">
          <AccountSectionHeader title={strings.sections.subscriptionTitle} description={strings.sections.subscriptionDescription} />
          <Button appearance="outline" tone="neutral" onClick={onChangePlan}>{strings.actions.changePlan}</Button>
        </Inline>
        <div className={styles.cardsGrid}>
          {plans.map((plan) => (
            <PlanCard
              isCurrent={plan.key === currentPlanKey}
              key={plan.key}
              plan={plan}
              strings={strings}
              valueLabel={plan.key === currentPlanKey ? viewModel.planPriceLabel : plan.monthlyPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            />
          ))}
        </div>
      </Stack>
    </Card>
  );
}

function PlanCard({
  isCurrent,
  onSelect,
  plan,
  strings,
  valueLabel,
}: {
  isCurrent?: boolean;
  onSelect?: () => void;
  plan: ClientCustomerPlan;
  strings: MinhaContaStrings;
  valueLabel: string;
}) {
  return (
    <Card className={isCurrent ? styles.highlightCard : styles.nestedCard} size="sm" onClick={onSelect}>
      <Stack gap="sm">
        <Inline justify="between">
          <Text variant="caption" tone="text">{strings.planNamePrefix} {plan.name}</Text>
          {isCurrent ? <AccountChip>{strings.states.current}</AccountChip> : null}
        </Inline>
        <Text variant="h3">{strings.currencyPrefix} {valueLabel}</Text>
        <Text variant="caption" tone="text-muted">{strings.format.dashSeparated.replace("{first}", strings.format.valueWithUnit.replace("{value}", String(plan.productSelectionLimit)).replace("{unit}", strings.usage.cuts)).replace("{second}", strings.format.valueWithUnit.replace("{value}", String(plan.proteinKgLimit)).replace("{unit}", strings.format.kilogram))}</Text>
        <Stack gap="xs">
          {plan.features.slice(0, 3).map((feature) => (
            <Inline key={feature} gap="xs" wrap={false}>
              <CheckIcon size={14} />
              <Text variant="caption">{feature}</Text>
            </Inline>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export function ProfileFormPanel({
  draft,
  onSave,
  onUpdate,
  saveState,
  strings,
}: {
  draft: ClientCustomerProfileDraft;
  onSave: () => void;
  onUpdate: (field: keyof ClientCustomerProfileDraft, value: string) => void;
  saveState: "idle" | "saved";
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <AccountSectionHeader title={strings.sections.personalTitle} description={strings.sections.personalDescription} />
        <div className={styles.cardsGrid}>
          <Input label={strings.labels.name} value={draft.name} onChange={(event) => onUpdate("name", event.target.value)} />
          <Input label={strings.labels.email} value={draft.email} onChange={(event) => onUpdate("email", event.target.value)} />
          <Input label={strings.labels.phone} value={draft.phone} onChange={(event) => onUpdate("phone", event.target.value)} />
          <Input label={strings.labels.cpf} value={draft.cpf} onChange={(event) => onUpdate("cpf", event.target.value)} />
          <Input label={strings.labels.birthdate} type="date" value={draft.birthdate} onChange={(event) => onUpdate("birthdate", event.target.value)} />
          <Input label={strings.labels.preferredDoneness} value={draft.preferredDoneness} onChange={(event) => onUpdate("preferredDoneness", event.target.value)} />
        </div>
        <Inline>
          <Button appearance="outline" tone="neutral" onClick={onSave}>{strings.actions.saveChanges}</Button>
          {saveState === "saved" ? (
            <Text className={styles.statusSuccess} weight="var(--theme--typography-semibold)">
              {strings.feedback.saved}
            </Text>
          ) : null}
        </Inline>
      </Stack>
    </Card>
  );
}

export function AddressListPanel({
  addresses,
  strings,
}: {
  addresses: ClientCustomerAddress[];
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <Inline justify="between">
          <AccountSectionHeader title={strings.sections.addressesTitle} description={strings.sections.addressesDescription} />
          <Button appearance="outline" tone="neutral">{strings.actions.addAddress}</Button>
        </Inline>
        <div className={styles.cardsGrid}>
          {addresses.map((address) => (
            <Card className={styles.nestedCard} key={address.id} size="sm">
              <Stack gap="sm">
                <Inline justify="between">
                  <Inline gap="xs">
                    <TruckIcon size={18} />
                    <Text variant="h3">{address.label}</Text>
                  </Inline>
                  {address.isPrimary ? <AccountChip>{strings.labels.defaultAddress}</AccountChip> : null}
                </Inline>
                <Stack gap="xs">
                  <Text weight="var(--theme--typography-bold)">{address.recipientName}</Text>
                  <Text tone="text-muted">{address.streetLine}</Text>
                  <Text tone="text-muted">{address.neighborhoodLine}</Text>
                  <Text variant="caption" tone="text-muted">{address.zipCode}{address.phone ? ` | ${address.phone}` : ""}</Text>
                </Stack>
                <Button appearance="transparent" tone="neutral" icon={<EditIcon />}>{strings.actions.edit}</Button>
              </Stack>
            </Card>
          ))}
        </div>
      </Stack>
    </Card>
  );
}

export function PaymentPanel({
  invoices,
  paymentMethods,
  strings,
}: {
  invoices: ClientCustomerInvoice[];
  paymentMethods: ClientCustomerPaymentMethod[];
  strings: MinhaContaStrings;
}) {
  return (
    <Stack gap="lg">
      <Card className={styles.panelCard}>
        <Stack gap="lg">
          <Inline justify="between">
            <AccountSectionHeader title={strings.sections.paymentTitle} description={strings.sections.paymentDescription} />
            <Button appearance="outline" tone="neutral">{strings.actions.addPaymentMethod}</Button>
          </Inline>
          <div className={styles.cardsGrid}>
            {paymentMethods.map((paymentMethod) => (
              <Card className={styles.nestedCard} key={paymentMethod.id} size="sm">
                <Stack gap="sm">
                  <Inline justify="between">
                    <Inline gap="xs">
                      <CartIcon size={18} />
                      <Text variant="h3">{paymentMethod.brand}</Text>
                    </Inline>
                    {paymentMethod.isDefault ? <AccountChip>{strings.labels.defaultPayment}</AccountChip> : null}
                  </Inline>
                  <Text weight="var(--theme--typography-bold)">{strings.labels.cardEnding} {paymentMethod.last4}</Text>
                  <Text variant="caption" tone="text-muted">{strings.format.paymentMethodSummary.replace("{holder}", paymentMethod.holderName).replace("{expiresLabel}", strings.labels.expiresAt).replace("{expiresAt}", paymentMethod.expiresAt)}</Text>
                </Stack>
              </Card>
            ))}
          </div>
        </Stack>
      </Card>
      <Card className={styles.panelCard}>
        <Stack gap="lg">
          <AccountSectionHeader title={strings.sections.invoiceTitle} description={strings.sections.invoiceDescription} />
          {invoices.length === 0 ? <Text tone="text-muted">{strings.empty.noInvoices}</Text> : null}
          <Stack gap="sm">
            {invoices.map((invoice) => (
              <Card className={styles.nestedCard} key={invoice.id} size="sm">
                <Inline justify="between">
                  <Stack gap="xs">
                    <Inline gap="xs">
                      <Text weight="var(--theme--typography-bold)">{invoice.description}</Text>
                      <AccountChip>{invoice.status}</AccountChip>
                    </Inline>
                    <Text variant="caption" tone="text-muted">{strings.format.invoiceSummary.replace("{date}", invoice.date).replace("{paymentMethod}", invoice.paymentMethodLabel).replace("{id}", invoice.id)}</Text>
                  </Stack>
                  <Inline gap="md">
                    <Text weight="var(--theme--typography-bold)">{strings.currencyPrefix} {invoice.amountLabel}</Text>
                    <Button appearance="outline" tone="neutral" size="sm">{strings.actions.downloadReceipt}</Button>
                  </Inline>
                </Inline>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export function NotificationsPanel({
  notifications,
  onUpdate,
  strings,
}: {
  notifications: ClientCustomerNotificationPreferences;
  onUpdate: (key: keyof ClientCustomerNotificationPreferences, value: boolean) => void;
  strings: MinhaContaStrings;
}) {
  const items: Array<keyof ClientCustomerNotificationPreferences> = ["whatsapp", "email", "sms", "offers"];
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <AccountSectionHeader title={strings.sections.notificationsTitle} description={strings.sections.notificationsDescription} />
        <Stack gap="sm">
          {items.map((key) => {
            const item = strings.notifications[key];
            const checked = notifications[key];
            return (
              <Card className={checked ? styles.highlightCard : styles.nestedCard} key={key} size="sm">
                <Inline justify="between">
                  <Stack gap="xs">
                    <Text weight="var(--theme--typography-bold)">{item.title}</Text>
                    <Text variant="caption" tone="text-muted">{item.description}</Text>
                  </Stack>
                  <Button
                    appearance={checked ? "soft" : "outline"}
                    aria-pressed={checked}
                    className={styles.switch}
                    onClick={() => onUpdate(key, !checked)}
                    tone="neutral"
                  >
                    {checked ? strings.states.active : strings.states.inactive}
                  </Button>
                </Inline>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}

export function SecurityPanel({ strings }: { strings: MinhaContaStrings }) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <AccountSectionHeader title={strings.sections.securityTitle} description={strings.sections.securityDescription} />
        <SecurityRow title={strings.security.passwordTitle} description={strings.security.passwordDescription} action={strings.actions.changePassword} />
        <div className={styles.divider} />
        <SecurityRow title={strings.security.exportTitle} description={strings.security.exportDescription} action={strings.actions.exportData} />
        <div className={styles.divider} />
        <SecurityRow
          title={strings.security.closeTitle}
          description={strings.security.closeDescription}
          action={strings.actions.closeAccount}
          danger
        />
        <Text variant="caption" tone="text-muted">{strings.legalNotice}</Text>
      </Stack>
    </Card>
  );
}

function SecurityRow({
  action,
  danger,
  description,
  title,
}: {
  action: string;
  danger?: boolean;
  description: string;
  title: string;
}) {
  return (
    <Inline justify="between">
      <Stack gap="xs">
        <Text className={danger ? styles.dangerText : undefined} weight="var(--theme--typography-bold)">{title}</Text>
        <Text variant="caption" tone="text-muted">{description}</Text>
      </Stack>
      <Button appearance="outline" className={danger ? styles.dangerText : undefined} tone="neutral">{action}</Button>
    </Inline>
  );
}

export function PlanComparisonModal({
  currentPlanKey,
  onClose,
  onConfirm,
  onSelect,
  open,
  plans,
  selectedPlanKey,
  strings,
}: {
  currentPlanKey: ClientCustomerSubscriptionTier;
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (plan: ClientCustomerSubscriptionTier) => void;
  open: boolean;
  plans: ClientCustomerPlan[];
  selectedPlanKey: ClientCustomerSubscriptionTier;
  strings: MinhaContaStrings;
}) {
  return (
    <Modal
      closeLabel={strings.actions.closeModal}
      description={strings.modal.planDescription}
      onClose={onClose}
      open={open}
      size="lg"
      title={strings.modal.planTitle}
      variant="auto"
    >
      <Stack gap="lg">
        <div className={styles.cardsGrid}>
          {plans.map((plan) => (
            <PlanCard
              isCurrent={plan.key === currentPlanKey}
              key={plan.key}
              onSelect={() => onSelect(plan.key)}
              plan={plan}
              strings={strings}
              valueLabel={plan.monthlyPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            />
          ))}
        </div>
        <Inline justify="end">
          <Button appearance="outline" tone="neutral" onClick={onClose}>{strings.actions.closeModal}</Button>
          <Button appearance="outline" tone="neutral" onClick={onConfirm}>
            {selectedPlanKey === currentPlanKey ? strings.actions.keepPlan : strings.actions.confirmPlan}
          </Button>
        </Inline>
      </Stack>
    </Modal>
  );
}

export function EmptyProfileGate({
  onLogin,
  strings,
}: {
  onLogin: () => void;
  strings: MinhaContaStrings;
}) {
  return (
    <Card className={styles.highlightCard} size="lg">
      <Stack align="center" gap="lg">
        <UserIcon size={32} />
        <Stack align="center" gap="xs">
          <Text as="h1" variant="h2">{strings.title}</Text>
          <Text tone="text-muted">{strings.subtitle}</Text>
        </Stack>
        <Button appearance="outline" tone="neutral" onClick={onLogin}>
          {strings.actions.viewDetails}
        </Button>
      </Stack>
    </Card>
  );
}
