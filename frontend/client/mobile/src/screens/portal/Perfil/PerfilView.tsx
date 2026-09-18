import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Container, Inline, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useClientCustomer, type ClientCustomerTabKey } from "../../../../../shared-core/hooks/useClientCustomer";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { createMobileAppShellConfig, type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";
import { ProfileScreenHeader } from "./minha-conta/fixed/ProfileScreenHeader";
import { ProfileTabNavigation } from "./minha-conta/fixed/ProfileTabNavigation";
import { EmptyStateScreen } from "../feedback/EmptyStateScreen/EmptyStateScreen";

export interface PerfilViewProps {
  activePath?: string;
  strings: ReturnType<typeof useClientStrings>;
  themeMode?: AppThemeMode;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  strings: allStrings,
  themeMode = "dark",
}) => {
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const strings = allStrings.minhaContaV2;
  const customer = useClientCustomer();
  const tabs: Array<{ key: ClientCustomerTabKey; label: string }> = [
    { key: "overview", label: strings.tabs.overview },
    { key: "subscription", label: strings.tabs.subscription },
    { key: "orders", label: strings.tabs.orders },
    { key: "data", label: strings.tabs.personalData },
    { key: "addresses", label: strings.tabs.addresses },
    { key: "payments", label: strings.tabs.payment },
    { key: "notifications", label: strings.tabs.preferences },
    { key: "security", label: strings.tabs.security },
  ];

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
      <EmptyStateScreen
        actions={customer.error ? (
          <Button appearance="outline" onAction={() => void customer.actions.reload()} tone="neutral">
            {strings.states.retry}
          </Button>
        ) : undefined}
        description={description}
        iconIntent="user"
        title={title}
      />
    );
  }

  const basePanel = {
    borderColor: theme.border,
    borderRadius: theme.radius?.xl,
    borderWidth: theme.borderWidth?.hairline,
    padding: theme.spacing?.md,
  };
  const stack = { gap: theme.spacing?.md };
  const compactStack = { gap: theme.spacing?.xs };
  const muted = { color: theme.textMuted };
  const title = { color: theme.text, fontWeight: "800" };
  const accent = { color: theme.text, fontWeight: "800" };

  const AccountProfileSummary = () => (
    <Surface style={basePanel}>
      <Stack style={stack}>
        <Inline style={{ alignItems: "center", gap: theme.spacing?.sm }}>
          <Surface appearance="outline" tone="neutral" style={{ borderRadius: theme.radius?.full, minHeight: 48, minWidth: 48, justifyContent: "center", alignItems: "center" }}>
            <Text style={accent}>{customer.viewModel.initials}</Text>
          </Surface>
          <Stack style={compactStack}>
            <Text style={title} variant="h1">{customer.viewModel.customer.name}</Text>
            <Text style={muted}>{strings.headerGreeting}</Text>
          </Stack>
        </Inline>
        <Inline style={{ gap: theme.spacing?.sm, flexWrap: "wrap" }}>
          <SummaryPill label={strings.labels.plan} value={`${strings.planNamePrefix} ${customer.viewModel.activeSubscriptionLabel}`} />
          <SummaryPill label={strings.renewLabel} value={customer.viewModel.nextBillingLabel} />
          <SummaryPill label={strings.deliveryLabel} value={customer.viewModel.nextDeliveryLabel} />
          <SummaryPill label={strings.memberSinceLabel} value={customer.viewModel.customer.memberSince} />
        </Inline>
      </Stack>
    </Surface>
  );

  const renderOverview = () => (
    <Stack style={stack}>
      <Surface style={basePanel}>
        <Stack style={stack}>
          <Text style={title}>{strings.sections.capacityTitle}</Text>
          {customer.viewModel.usageMetrics.map((metric) => (
            <Inline key={metric.key} style={{ justifyContent: "space-between", gap: theme.spacing?.sm }}>
              <Text style={muted}>{metric.label}</Text>
              <Text style={title}>{metric.valueLabel}</Text>
            </Inline>
          ))}
        </Stack>
      </Surface>
      <OrdersPanel />
    </Stack>
  );

  const OrdersPanel = () => (
    <Surface style={basePanel}>
      <Stack style={stack}>
        <Text style={title}>{strings.sections.recentOrdersTitle}</Text>
        {customer.dataSource.recentOrders.map((order) => (
          <Surface key={order.id} appearance="outline" style={basePanel}>
            <Stack style={compactStack}>
              <Text style={accent}>{order.kindLabel}</Text>
              <Text style={title}>{order.title}</Text>
              <Text style={muted}>{order.summary}</Text>
              <Inline style={{ justifyContent: "space-between" }}>
                <Text style={muted}>{order.statusLabel}</Text>
                <Text style={title}>{order.totalLabel}</Text>
              </Inline>
            </Stack>
          </Surface>
        ))}
      </Stack>
    </Surface>
  );

  const renderPanel = () => {
    if (customer.activeTab === "overview") return renderOverview();
    if (customer.activeTab === "orders") return <OrdersPanel />;
    if (customer.activeTab === "subscription") {
      return (
        <Surface style={basePanel}>
          <Stack style={stack}>
            <Text style={title}>{strings.sections.subscriptionTitle}</Text>
            {customer.dataSource.plans.map((plan) => (
              <Surface key={plan.key} appearance={plan.key === customer.selectedPlanKey ? "soft" : "outline"} tone="neutral" style={basePanel}>
                <Stack style={compactStack}>
                  <Text style={title}>{strings.planNamePrefix} {plan.name}</Text>
                  <Text style={accent}>{strings.currencyPrefix} {plan.monthlyPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
                  {plan.includedItems.map((item) => (
                    <Stack key={item.id} style={compactStack}>
                      <Text style={muted}>{strings.format.includedItem.replace("{quantity}", item.quantityLabel).replace("{item}", item.name)}</Text>
                      {item.selectionLimit ? <Text style={muted}>{strings.format.selectionLimit.replace("{count}", String(item.selectionLimit))}</Text> : null}
                    </Stack>
                  ))}
                </Stack>
              </Surface>
            ))}
          </Stack>
        </Surface>
      );
    }
    if (customer.activeTab === "data") {
      return (
        <Surface style={basePanel}>
          <Stack style={stack}>
            <Text style={title}>{strings.sections.personalTitle}</Text>
            <SummaryPill label={strings.labels.name} value={customer.profileDraft.name} />
            <SummaryPill label={strings.labels.email} value={customer.profileDraft.email} />
            <SummaryPill label={strings.labels.phone} value={customer.profileDraft.phone} />
            <SummaryPill label={strings.labels.preferredDoneness} value={customer.profileDraft.preferredDoneness} />
          </Stack>
        </Surface>
      );
    }
    if (customer.activeTab === "addresses") {
      return (
        <Surface style={basePanel}>
          <Stack style={stack}>
            <Text style={title}>{strings.sections.addressesTitle}</Text>
            {customer.dataSource.customer.addresses.map((address) => (
              <SummaryPill key={address.id} label={address.label} value={`${address.streetLine} | ${address.neighborhoodLine}`} />
            ))}
          </Stack>
        </Surface>
      );
    }
    if (customer.activeTab === "payments") {
      return (
        <Surface style={basePanel}>
          <Stack style={stack}>
            <Text style={title}>{strings.sections.paymentTitle}</Text>
            {customer.dataSource.customer.paymentMethods.map((method) => (
              <SummaryPill key={method.id} label={method.brand} value={`${strings.labels.cardEnding} ${method.last4}`} />
            ))}
          </Stack>
        </Surface>
      );
    }
    if (customer.activeTab === "notifications") {
      return (
        <Surface style={basePanel}>
          <Stack style={stack}>
            <Text style={title}>{strings.sections.notificationsTitle}</Text>
            {(["whatsapp", "email", "sms", "offers"] as const).map((key) => (
              <Inline key={key} style={{ justifyContent: "space-between", gap: theme.spacing?.sm }}>
                <Stack style={compactStack}>
                  <Text style={title}>{strings.notifications[key].title}</Text>
                  <Text style={muted}>{strings.notifications[key].description}</Text>
                </Stack>
                <Button
                  appearance={customer.notifications[key] ? "soft" : "outline"}
                  onAction={() => customer.actions.updateNotification(key, !customer.notifications[key])}
                  tone="neutral"
                >
                  {customer.notifications[key] ? strings.states.active : strings.states.inactive}
                </Button>
              </Inline>
            ))}
          </Stack>
        </Surface>
      );
    }
    return (
      <Surface style={basePanel}>
        <Stack style={stack}>
          <Text style={title}>{strings.sections.securityTitle}</Text>
          <SummaryPill label={strings.security.passwordTitle} value={strings.security.passwordDescription} />
          <SummaryPill label={strings.security.exportTitle} value={strings.security.exportDescription} />
          <SummaryPill label={strings.security.closeTitle} value={strings.security.closeDescription} />
        </Stack>
      </Surface>
    );
  };

  const SummaryPill = ({ label, value }: { label: string; value: string }) => (
    <Surface appearance="outline" style={{ ...basePanel, flex: 1 }}>
      <Stack style={compactStack}>
        <Text style={muted}>{label}</Text>
        <Text style={title}>{value}</Text>
      </Stack>
    </Surface>
  );

  return (
    <>
      <ProfileScreenHeader strings={strings} />
      <Container style={{ padding: theme.spacing?.md }}>
        <Stack style={stack}>
          <AccountProfileSummary />
        <ProfileTabNavigation
          activeTab={customer.activeTab}
          items={tabs}
          onSelect={customer.actions.setActiveTab}
          spacing={theme.spacing?.xs}
        />
        {renderPanel()}
        </Stack>
      </Container>
    </>
  );
};
