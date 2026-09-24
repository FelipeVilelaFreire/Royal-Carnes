"use client";

import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { Input } from "@foundation/ui/web/Input";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Modal } from "@foundation/ui/web/Modal";
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

const formatCpf = (value: string) => value
  .replace(/\D/g, "")
  .slice(0, 11)
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const formatBrazilPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").replace(/^55/, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `+55 (${digits}`;
  if (digits.length <= 6) return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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
}: {
  activeTab: ClientCustomerTabKey;
  items: AccountTabItem[];
  onSelect: (tab: ClientCustomerTabKey) => void;
}) {
  return (
    <aside className={styles.sidebar}>
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
        <Inline className={styles.heroIdentity} align="start" justify="between">
          <Inline align="center" gap="md">
            <AccountAvatar initials={viewModel.initials} />
            <Stack gap="xs">
              <Text variant="caption" tone="text-muted">{strings.accountSummaryLabel}</Text>
              <Text as="h2" variant="h1">{strings.title}</Text>
              <Text tone="text-muted">{strings.headerGreeting}</Text>
            </Stack>
          </Inline>
        </Inline>
        <div className={styles.statsGrid}>
          <SummaryStat label={strings.labels.plan} value={viewModel.activeSubscriptionLabel} />
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
    <Card className={[styles.nestedCard, styles.metricCard].join(" ")} size="xs">
      <Stack gap="xs">
        <Text variant="caption" tone="text-muted">{metric.label}</Text>
        <Text className={styles.metricValue} variant="h3">{metric.valueLabel}</Text>
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
    <Card className={[styles.planCard, isCurrent ? styles.planCardCurrent : styles.nestedCard].join(" ")} size="sm" onClick={onSelect}>
      <div className={styles.planCardContent}>
        <Inline className={styles.planHeader} justify="between">
          <Stack gap="2xs">
            <Text className={styles.planEyebrow} variant="caption">{strings.labels.plan}</Text>
            <Text as="h3" variant="h3">{plan.name}</Text>
          </Stack>
          {isCurrent ? <AccountChip>{strings.states.current}</AccountChip> : null}
        </Inline>
        <Stack className={styles.planIntro} gap="xs">
          <Inline align="end" className={styles.planPriceRow} gap="2xs">
            <Text className={styles.planPrice} variant="h2">{strings.currencyPrefix} {valueLabel}</Text>
            <Text className={styles.planPricePeriod} variant="caption">{strings.labels.perMonth}</Text>
          </Inline>
          {plan.description ? <Text className={styles.planDescription} variant="caption" tone="text-muted">{plan.description}</Text> : null}
        </Stack>
        <div className={styles.planDivider} />
        <Stack className={styles.planBenefits} gap="2xs">
          {plan.includedItems.map((item) => (
            <Inline className={styles.planBenefit} gap="xs" key={item.id} wrap={false}>
              <CheckIcon size={14} />
              <Text variant="caption">{strings.format.includedItem.replace("{quantity}", item.quantityLabel).replace("{item}", item.name)}</Text>
            </Inline>
          ))}
        </Stack>
      </div>
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
        <div className={styles.profileFields}>
          <Input autoComplete="name" className={styles.profileIdentityField} label={strings.labels.name} value={draft.name} onChange={(event) => onUpdate("name", event.target.value)} />
          <Input autoComplete="email" label={strings.labels.email} type="email" value={draft.email} onChange={(event) => onUpdate("email", event.target.value)} />
          <Input autoComplete="tel" inputMode="tel" label={strings.labels.phone} maxLength={19} value={formatBrazilPhone(draft.phone)} onChange={(event) => onUpdate("phone", formatBrazilPhone(event.target.value))} />
          <Input inputMode="numeric" label={strings.labels.cpf} maxLength={14} value={formatCpf(draft.cpf)} onChange={(event) => onUpdate("cpf", formatCpf(event.target.value))} />
          <Input className={styles.profileIdentityField} label={strings.labels.birthdate} type="date" value={draft.birthdate} onChange={(event) => onUpdate("birthdate", event.target.value)} />
          <Input label={strings.labels.preferredDoneness} value={draft.preferredDoneness} onChange={(event) => onUpdate("preferredDoneness", event.target.value)} />
        </div>
        <Inline className={styles.profileActions}>
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
  onUpdate,
  onLookupPostalCode,
  strings,
}: {
  addresses: ClientCustomerAddress[];
  onCreate: (input: ClientCustomerAddressCreateInput) => Promise<void>;
  onUpdate: (addressId: string, input: ClientCustomerAddressCreateInput) => Promise<void>;
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
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
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
      if (editingAddressId) await onUpdate(editingAddressId, draft);
      else await onCreate(draft);
      setDraft({ ...emptyDraft, isPrimary: false });
      setEditingAddressId(null);
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
          <Button appearance="outline" tone="neutral" onClick={() => { setEditingAddressId(null); setDraft(emptyDraft); setIsFormOpen(true); }}>{strings.actions.addAddress}</Button>
        </Inline>
        {isFormOpen ? (
          <Modal closeLabel={strings.actions.closeModal} onClose={() => setIsFormOpen(false)} open title={strings.sections.addressesTitle} variant="auto">
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
          </Modal>
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
                <Button appearance="transparent" size="sm" tone="neutral" onClick={() => { setEditingAddressId(address.id); setDraft({ label: address.label, recipientName: address.recipientName, street: address.street, number: address.number, complement: address.complement, district: address.district, city: address.city, state: address.state, zipCode: address.zipCode, isPrimary: Boolean(address.isPrimary) }); setIsFormOpen(true); }}>{strings.actions.edit}</Button>
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
  strings,
}: {
  invoices: ClientCustomerInvoice[];
  strings: MinhaContaStrings;
}) {
  return (
    <Stack gap="lg">
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

export function SecurityPanel({
  onLogoutRequest,
  strings,
}: {
  onLogoutRequest?: () => void;
  strings: MinhaContaStrings;
}) {
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
          onAction={onLogoutRequest}
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
  onAction,
  title,
}: {
  action: string;
  danger?: boolean;
  description: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <Inline justify="between">
      <Stack gap="xs">
        <Text className={danger ? styles.dangerText : undefined} weight="var(--theme--typography-bold)">{title}</Text>
        <Text variant="caption" tone="text-muted">{description}</Text>
      </Stack>
      <Button appearance="outline" className={danger ? styles.dangerText : undefined} onClick={onAction} tone="neutral">{action}</Button>
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
