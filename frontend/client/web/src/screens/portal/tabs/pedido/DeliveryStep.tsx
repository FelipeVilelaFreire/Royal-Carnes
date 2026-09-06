import React from "react";
import { Button, Grid, Inline, Input, Stack, Surface, Text, TextArea } from "@foundation/ui";
import { CheckIcon, StoreIcon } from "@foundation/ui/Icon/AppIcons";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import type { ClientCheckoutAddressFieldKey } from "@/manifest/checkout.config";
import { CheckoutPanel } from "./CheckoutPanel";
import { getCheckoutPrimaryActionStyle, getCheckoutSubtleActionStyle } from "./actionStyles";
import styles from "../PedidoView.module.css";

export interface DeliveryStepProps {
  addresses: ClientCheckoutAddress[];
  checkoutConfig: { deliveryDays: number[] };
  currentFreightPrice: number;
  deliveryCopy: any;
  formatMoney: (value: number) => string;
  freightOptions: Array<{ key: ClientCheckoutFreightOptionKey; label: string; price: number; etaLabel: string }>;
  isAddingAddress: boolean;
  newAddressDraft: Record<ClientCheckoutAddressFieldKey, string>;
  newAddressFields: Array<{ key: ClientCheckoutAddressFieldKey; label: string; placeholder: string; gridColumn: string }>;
  onBack: () => void;
  onNext: () => void;
  onSetAddingAddress: (value: boolean) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectDeliveryDay: (day: number) => void;
  onSelectFreight: (key: ClientCheckoutFreightOptionKey) => void;
  onSubmitNewAddress: () => void;
  onUpdateNewAddressDraft: (field: ClientCheckoutAddressFieldKey, value: string) => void;
  selectedAddressId: string;
  selectedDeliveryDay: number;
  selectedFreight: ClientCheckoutFreightOptionKey | null;
  selectedMode: ClientCheckoutProductExperience;
  strings: any;
  tokens: {
    background?: string;
    border: string;
    copper: string;
    ivory?: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  addresses,
  checkoutConfig,
  currentFreightPrice,
  deliveryCopy,
  formatMoney,
  freightOptions,
  isAddingAddress,
  newAddressDraft,
  newAddressFields,
  onBack,
  onNext,
  onSetAddingAddress,
  onSelectAddress,
  onSelectDeliveryDay,
  onSelectFreight,
  onSubmitNewAddress,
  onUpdateNewAddressDraft,
  selectedAddressId,
  selectedDeliveryDay,
  selectedFreight,
  selectedMode,
  strings,
  tokens,
}) => (
  <CheckoutPanel
    badge={strings.deliveryStep.badge}
    description={deliveryCopy?.description || strings.deliveryStep.description}
    title={strings.deliveryStep.title}
    tokens={tokens}
  >
    <Grid className={styles.infoGrid}>
      {(deliveryCopy?.fields || []).map((field: string) => (
        <Surface appearance="soft" className={styles.infoTile} key={field}>
          <CheckIcon size={16} color={tokens.copper} />
          <Text as="strong" tone="inherit" variant="body" weight="semibold">
            {field}
          </Text>
        </Surface>
      ))}
    </Grid>

    <Stack gap="lg">
      <Stack gap="sm">
        <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
          {strings.deliveryStep.common.addressTitle}
        </Text>
        <Grid className={styles.optionGrid}>
          {addresses.map((address) => {
            const isSelectedAddress = selectedAddressId === address.id;

            return (
              <Button
                appearance="soft"
                aria-pressed={isSelectedAddress}
                className={styles.addressOption}
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                style={{
                  "--pedido-option-border": isSelectedAddress ? tokens.copper : tokens.border,
                  "--pedido-option-bg": tokens.surfaceContainer,
                  "--pedido-option-text": tokens.text,
                  "--pedido-option-muted": tokens.textMuted,
                  "--pedido-option-accent": tokens.copper,
                  "--ui-surface-bg": isSelectedAddress
                    ? "color-mix(in srgb, var(--pedido-option-accent) 7%, var(--pedido-option-bg))"
                    : "var(--pedido-option-bg)",
                  "--ui-surface-border": isSelectedAddress
                    ? "color-mix(in srgb, var(--pedido-option-accent) 76%, var(--pedido-option-border))"
                    : "var(--pedido-option-border)",
                  "--ui-surface-color": "var(--pedido-option-text)",
                } as React.CSSProperties}
                tone="neutral"
                type="button"
              >
                <span className={styles.optionIcon}>
                  <StoreIcon size={21} />
                </span>
                <span className={styles.addressCopy}>
                  <span className={styles.addressTitleLine}>
                    <Text as="strong" tone="inherit" variant="body" weight="semibold">
                      {address.label}
                    </Text>
                    {address.isPrimary ? (
                      <Text as="span" className={styles.smallBadge} tone="inherit" variant="caption">
                        {strings.deliveryStep.common.primaryAddress}
                      </Text>
                    ) : null}
                  </span>
                  <Text as="strong" tone="inherit" variant="caption" weight="semibold">
                    {address.recipientName}
                  </Text>
                  <Text tone="inherit" variant="caption">{address.streetLine}</Text>
                  <Text tone="inherit" variant="caption">{address.neighborhoodLine}</Text>
                  <Text tone="inherit" variant="caption">
                    {strings.deliveryStep.common.zipPrefix} {address.zipCode}
                    {address.phone ? ` - ${strings.deliveryStep.common.phonePrefix} ${address.phone}` : ""}
                  </Text>
                  {isSelectedAddress ? (
                    <Text as="span" className={styles.selectedHint} tone="inherit" variant="caption">
                      <CheckIcon size={14} color={tokens.copper} />
                      {strings.deliveryStep.common.addressHint}
                    </Text>
                  ) : null}
                </span>
              </Button>
            );
          })}
        </Grid>

        <Button
          appearance="outline"
          size="sm"
          style={getCheckoutSubtleActionStyle(tokens)}
          tone="neutral"
          type="button"
          onClick={() => onSetAddingAddress(true)}
        >
          {strings.deliveryStep.common.addAddress}
        </Button>

        {isAddingAddress ? (
          <Surface appearance="soft" className={styles.formPanel}>
            <Text as="h3" tone="inherit" variant="h3">
              {strings.deliveryStep.common.newAddressTitle}
            </Text>
            <Grid className={styles.addressForm}>
              {newAddressFields.map((field) => (
                <Input
                  className={styles.addressField}
                  key={field.key}
                  label={field.label}
                  onChange={(event) => onUpdateNewAddressDraft(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  value={newAddressDraft[field.key]}
                  style={{ gridColumn: field.gridColumn, minWidth: 0 }}
                />
              ))}
            </Grid>
            <Inline justify="end">
              <Button appearance="outline" onClick={() => onSetAddingAddress(false)}>
                {strings.deliveryStep.common.cancelAddress}
              </Button>
              <Button appearance="solid" tone="neutral" style={getCheckoutPrimaryActionStyle(tokens)} onClick={onSubmitNewAddress}>
                {strings.deliveryStep.common.saveAddress}
              </Button>
            </Inline>
          </Surface>
        ) : null}
      </Stack>

      {selectedMode === "royalBox" ? (
        <Stack gap="sm">
          <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
            {strings.deliveryStep.royalBox.deliveryDayLabel}
          </Text>
          <Text tone="inherit" style={{ color: tokens.textMuted }}>
            {strings.deliveryStep.royalBox.deliveryDayHint}
          </Text>
          <Grid className={styles.compactOptionGrid}>
            {checkoutConfig.deliveryDays.map((day) => {
              const isActive = selectedDeliveryDay === day;

              return (
                <Button
                  appearance="soft"
                  aria-pressed={isActive}
                  className={styles.choiceButton}
                  key={day}
                  onClick={() => onSelectDeliveryDay(day)}
                  style={{
                    "--pedido-option-border": isActive ? tokens.copper : tokens.border,
                    "--pedido-option-bg": tokens.surfaceContainer,
                    "--pedido-option-accent": tokens.copper,
                    "--pedido-option-text": isActive ? tokens.copper : tokens.text,
                    "--ui-surface-bg": isActive
                      ? "color-mix(in srgb, var(--pedido-option-accent) 7%, var(--pedido-option-bg))"
                      : "var(--pedido-option-bg)",
                    "--ui-surface-border": isActive
                      ? "color-mix(in srgb, var(--pedido-option-accent) 76%, var(--pedido-option-border))"
                      : "var(--pedido-option-border)",
                    "--ui-surface-color": "var(--pedido-option-text)",
                  } as React.CSSProperties}
                  tone="neutral"
                  type="button"
                >
                  <span className={styles.choiceEyebrow}>{strings.deliveryStep.royalBox.deliveryDayPrefix}</span>
                  <strong className={styles.choiceValue}>{day}</strong>
                </Button>
              );
            })}
          </Grid>
        </Stack>
      ) : null}

      <Stack gap="sm">
        <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
          {strings.deliveryStep.royalDelivery.freightLabel}
        </Text>
        {selectedMode === "royalDelivery" ? (
          <Grid className={styles.compactOptionGrid}>
            {freightOptions.map((freight) => {
              const isActive = selectedFreight === freight.key;

              return (
                <Button
                  appearance="soft"
                  aria-pressed={isActive}
                  className={styles.freightButton}
                  key={freight.key}
                  onClick={() => onSelectFreight(freight.key)}
                  style={{
                    "--pedido-option-border": isActive ? tokens.copper : tokens.border,
                    "--pedido-option-bg": tokens.surfaceContainer,
                    "--pedido-option-accent": tokens.copper,
                    "--pedido-option-text": isActive ? tokens.copper : tokens.text,
                    "--pedido-option-muted": tokens.textMuted,
                    "--ui-surface-bg": isActive
                      ? "color-mix(in srgb, var(--pedido-option-accent) 7%, var(--pedido-option-bg))"
                      : "var(--pedido-option-bg)",
                    "--ui-surface-border": isActive
                      ? "color-mix(in srgb, var(--pedido-option-accent) 76%, var(--pedido-option-border))"
                      : "var(--pedido-option-border)",
                    "--ui-surface-color": "var(--pedido-option-text)",
                  } as React.CSSProperties}
                  tone="neutral"
                  type="button"
                >
                  <strong>{freight.label}</strong>
                  <span>{formatMoney(freight.price)}</span>
                  <small>{freight.etaLabel}</small>
                </Button>
              );
            })}
          </Grid>
        ) : null}
        <Surface appearance="soft" className={styles.summaryLine}>
          <Text as="strong" tone="inherit" variant="body" weight="semibold">
            {selectedMode === "royalDelivery" && !selectedFreight
              ? strings.deliveryStep.royalDelivery.pendingFreight
              : selectedMode === "royalDelivery"
                ? strings.deliveryStep.royalDelivery.calculatedFreight
                : strings.deliveryStep.royalDelivery.includedFreight}
          </Text>
          <Text as="strong" style={{ color: tokens.copper }} tone="inherit" variant="body">
            {selectedMode === "royalDelivery" && !selectedFreight
              ? strings.summary.freightNotSelected
              : formatMoney(currentFreightPrice)}
          </Text>
        </Surface>
      </Stack>

      <TextArea label={strings.deliveryStep.common.notesTitle} placeholder={strings.deliveryStep.common.notesPlaceholder} rows={4} />

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {strings.deliveryStep.back}
        </Button>
        <Button appearance="solid" tone="neutral" style={getCheckoutPrimaryActionStyle(tokens)} onClick={onNext}>
          {strings.deliveryStep.next}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
);
