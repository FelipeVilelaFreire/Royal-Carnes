"use client";

import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { Input } from "@foundation/ui/web/Input";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import { CartIcon, CheckIcon, FlameIcon, TruckIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCustomerAccountViewModel,
  ClientCustomerUsageMetric,
} from "@royalprime/client/view-models/customer.view-model";
import type {
  ClientCustomerAddress,
  ClientCustomerAddressCreateInput,
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
        <Card className={styles.highlightCard} size="sm">
          <Stack gap="sm">
            <Inline justify="between" wrap={false}>
              <Text variant="caption" tone="text-muted">{strings.planLabel}</Text>
              <AccountChip>{strings.badge}</AccountChip>
            </Inline>
            <Text weight="var(--theme--typography-bold)">{strings.planNamePrefix} {viewModel.activeSubscriptionLabel}</Text>
            <Text variant="caption" tone="text-muted">{strings.format.labelValue.replace("{label}", strings.renewLabel).replace("{value}", viewModel.nextBillingLabel)}</Text>
          </Stack>
        </Card>
        <nav>
          <Inline className={styles.tabList} gap="xs">
            {items.map((item) => {
              const isActive = item.key === activeTab;
              return (
                <Button
                  appearance="transparent"
                  className={[styles.tabButton, isActive ? styles.tabButtonActive : ""].filter(Boolean).join(" ")}
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
  strings,
  viewModel,
}: {
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
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      </Stack>
    </Card>
  );
}

function MetricCard({
  metric,
}: {
  metric: ClientCustomerUsageMetric;
}) {
  return (
    <Card className={styles.nestedCard} size="sm">
      <Stack gap="sm">
        <Text variant="caption" tone="text-muted">{metric.label}</Text>
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
                  <OrderImage imageUrl={order.imageUrl} title={order.title} />
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
                  {order.estimateLabel ? <Text variant="caption" tone="text-muted">{strings.format.labelValue.replace("{label}", strings.labels.estimate).replace("{value}", order.estimateLabel)}</Text> : null}
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

function OrderImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [isUnavailable, setIsUnavailable] = React.useState(false);
  if (!imageUrl || isUnavailable) {
    return <span aria-hidden="true" className={styles.orderImageFallback}><FlameIcon size={24} /></span>;
  }
  return <img className={styles.orderImage} src={imageUrl} alt={title} onError={() => setIsUnavailable(true)} />;
}

export function SubscriptionPanel({
  currentPlanKey,
  plans,
  strings,
  viewModel,
}: {
  currentPlanKey: ClientCustomerSubscriptionTier;
  plans: ClientCustomerPlan[];
  strings: MinhaContaStrings;
  viewModel: ClientCustomerAccountViewModel;
}) {
  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <AccountSectionHeader title={strings.sections.subscriptionTitle} description={strings.sections.subscriptionDescription} />
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
        <Stack gap="xs">
          {plan.includedItems.map((item) => (
            <Inline key={item.id} gap="xs" wrap={false}>
              <CheckIcon size={14} />
              <Stack gap="xs">
                <Text variant="caption">{strings.format.includedItem.replace("{quantity}", item.quantityLabel).replace("{item}", item.name)}</Text>
                {item.selectionLimit ? <Text variant="caption" tone="text-muted">{strings.format.selectionLimit.replace("{count}", String(item.selectionLimit))}</Text> : null}
              </Stack>
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
  onCreate,
  onLookupPostalCode,
  strings,
}: {
  addresses: ClientCustomerAddress[];
  onCreate: (input: ClientCustomerAddressCreateInput) => Promise<void>;
  onLookupPostalCode: (postalCode: string) => Promise<Pick<ClientCustomerAddressCreateInput, "street" | "district" | "city" | "state"> | null>;
  strings: MinhaContaStrings;
}) {
  const emptyDraft: ClientCustomerAddressCreateInput = {
    label: "",
    recipientName: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    zipCode: "",
    isPrimary: addresses.length === 0,
  };
  const [draft, setDraft] = React.useState(emptyDraft);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [postalCodeState, setPostalCodeState] = React.useState<"idle" | "loading" | "notFound" | "error">("idle");
  const postalCodeRequest = React.useRef(0);

  const updateDraft = (field: keyof ClientCustomerAddressCreateInput, value: string | boolean) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
  };
  const updatePostalCode = async (value: string) => {
    const formattedPostalCode = value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    updateDraft("zipCode", formattedPostalCode);
    const normalizedPostalCode = formattedPostalCode.replace(/\D/g, "");
    const requestId = ++postalCodeRequest.current;
    if (normalizedPostalCode.length !== 8) {
      setPostalCodeState("idle");
      return;
    }

    setPostalCodeState("loading");
    try {
      const address = await onLookupPostalCode(normalizedPostalCode);
      if (requestId !== postalCodeRequest.current) return;
      if (!address) {
        setPostalCodeState("notFound");
        return;
      }
      setDraft((current) => ({ ...current, ...address, zipCode: formattedPostalCode }));
      setPostalCodeState("idle");
    } catch {
      if (requestId === postalCodeRequest.current) setPostalCodeState("error");
    }
  };
  const save = async () => {
    setIsSaving(true);
    try {
      await onCreate(draft);
      setDraft({ ...emptyDraft, isPrimary: false });
      setIsFormOpen(false);
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={styles.panelCard}>
      <Stack gap="lg">
        <Inline justify="between">
          <AccountSectionHeader title={strings.sections.addressesTitle} description={strings.sections.addressesDescription} />
          <Button appearance="outline" tone="neutral" onClick={() => setIsFormOpen(true)}>{strings.actions.addAddress}</Button>
        </Inline>
        {isFormOpen ? (
          <Card className={styles.nestedCard} size="sm">
            <Stack gap="md">
              <div className={styles.cardsGrid}>
                <Input
                  autoComplete="postal-code"
                  error={postalCodeState === "notFound" ? strings.addressLookup.notFound : postalCodeState === "error" ? strings.addressLookup.error : undefined}
                  inputMode="numeric"
                  label={strings.labels.zipCode}
                  maxLength={9}
                  required
                  value={draft.zipCode}
                  onChange={(event) => void updatePostalCode(event.target.value)}
                />
                {postalCodeState === "loading" ? <Text variant="caption" tone="text-muted">{strings.addressLookup.loading}</Text> : null}
                <Input label={strings.labels.addressLabel} value={draft.label} onChange={(event) => updateDraft("label", event.target.value)} />
                <Input label={strings.labels.recipientName} value={draft.recipientName} onChange={(event) => updateDraft("recipientName", event.target.value)} />
                <Input label={strings.labels.street} required value={draft.street} onChange={(event) => updateDraft("street", event.target.value)} />
                <Input label={strings.labels.number} value={draft.number} onChange={(event) => updateDraft("number", event.target.value)} />
                <Input label={strings.labels.complement} value={draft.complement} onChange={(event) => updateDraft("complement", event.target.value)} />
                <Input label={strings.labels.district} value={draft.district} onChange={(event) => updateDraft("district", event.target.value)} />
                <Input label={strings.labels.city} required value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} />
                <Input label={strings.labels.state} required value={draft.state} onChange={(event) => updateDraft("state", event.target.value)} />
              </div>
              <Inline>
                <Button appearance="outline" disabled={draft.zipCode.replace(/\D/g, "").length !== 8 || !draft.street || !draft.city || !draft.state || isSaving} tone="neutral" onClick={() => void save()}>{strings.actions.saveChanges}</Button>
                <Button appearance="transparent" disabled={isSaving} tone="neutral" onClick={() => setIsFormOpen(false)}>{strings.actions.closeModal}</Button>
              </Inline>
            </Stack>
          </Card>
        ) : null}
        {isSaved ? <Text className={styles.statusSuccess} weight="var(--theme--typography-semibold)">{strings.feedback.addressSaved}</Text> : null}
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
