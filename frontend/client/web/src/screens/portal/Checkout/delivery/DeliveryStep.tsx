import React from "react";
import { Button, Grid, GridItem, Inline, Input, Stack, Surface, Text } from "@foundation/ui";
import { StoreIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import type { ClientCheckoutAddressFieldKey } from "@/manifest/checkout.config";
import { CheckoutPanel } from "../layout/CheckoutPanel";
import styles from "../CheckoutView.module.css";

export interface DeliveryStepProps {
  addressSaveState: "idle" | "saving" | "error";
  addresses: ClientCheckoutAddress[];
  canSaveNewAddress: boolean;
  checkoutConfig: { deliveryDays: number[] };
  deliveryCopy: any;
  formatMoney: (value: number) => string;
  freightOptions: Array<{ key: ClientCheckoutFreightOptionKey; label: string; price: number; etaLabel: string }>;
  isAddingAddress: boolean;
  newAddressDraft: Record<ClientCheckoutAddressFieldKey, string>;
  newAddressFields: Array<{
    autoComplete: string;
    gridSpan: number;
    inputMode?: "numeric" | "text";
    key: ClientCheckoutAddressFieldKey;
    label: string;
    maxLength?: number;
    placeholder: string;
  }>;
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
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  addressSaveState,
  addresses,
  canSaveNewAddress,
  checkoutConfig,
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
}) => {
  const [isCustomDeliveryDay, setIsCustomDeliveryDay] = React.useState(false);
  const [customDeliveryDay, setCustomDeliveryDay] = React.useState("");
  const customDeliveryDayNumber = Number(customDeliveryDay);
  const isCustomDeliveryDayValid = customDeliveryDayNumber >= 1 && customDeliveryDayNumber <= 31;

  const handleCustomDeliveryDayChange = (value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(0, 2);
    const nextDay = Number(nextValue);
    setCustomDeliveryDay(nextValue);
    if (nextDay >= 1 && nextDay <= 31) onSelectDeliveryDay(nextDay);
  };

  return (
    <CheckoutPanel
    badge={strings.deliveryStep.badge}
    description={deliveryCopy?.description || strings.deliveryStep.description}
    title={strings.deliveryStep.title}
  >
    <Stack className={styles.deliveryStack} gap="xl">
      <section className={styles.deliverySection}>
        <div className={styles.deliverySectionHeader}>
          <Button
            appearance="outline"
            className={styles.checkoutSubtleAction}
            size="sm"
            tone="neutral"
            type="button"
            onClick={() => onSetAddingAddress(true)}
          >
            {strings.deliveryStep.common.addAddress}
          </Button>
        </div>
        {isAddingAddress ? (
          <Surface appearance="soft" className={[styles.formPanel, styles.addressFormPanel].join(" ")}>
            <div className={styles.addressFormHeader}>
              <Text as="h3" tone="inherit" variant="h3">
                {strings.deliveryStep.common.newAddressTitle}
              </Text>
            </div>
            <Grid className={styles.addressForm} gap="md">
              {newAddressFields.map((field) => (
                <GridItem className={styles.addressField} key={field.key} span={field.gridSpan}>
                  <Input
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    label={field.label}
                    maxLength={field.maxLength}
                    onChange={(event) => {
                      const nextValue = field.key === "zipCode"
                        ? event.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")
                        : event.target.value;
                      onUpdateNewAddressDraft(field.key, nextValue);
                    }}
                    placeholder={field.placeholder}
                    value={newAddressDraft[field.key]}
                  />
                </GridItem>
              ))}
            </Grid>
            <Inline className={styles.addressFormActions} justify="end">
              <Button appearance="outline" onClick={() => onSetAddingAddress(false)}>
                {strings.deliveryStep.common.cancelAddress}
              </Button>
              <Button appearance="solid" className={styles.checkoutPrimaryAction} disabled={!canSaveNewAddress || addressSaveState === "saving"} tone="neutral" onClick={() => void onSubmitNewAddress()}>
                {strings.deliveryStep.common.saveAddress}
              </Button>
            </Inline>
            {addressSaveState === "error" ? (
              <Text tone="danger" variant="caption">{strings.deliveryStep.common.addressSaveError}</Text>
            ) : null}
          </Surface>
        ) : null}
        <Grid className={[styles.optionGrid, styles.addressGrid].join(" ")}>
          {addresses.map((address) => {
            const isSelectedAddress = selectedAddressId === address.id;

            return (
              <Button
                appearance="soft"
                aria-pressed={isSelectedAddress}
                className={styles.addressOption}
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
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
                </span>
              </Button>
            );
          })}
        </Grid>

      </section>

      {selectedMode === "royalBox" ? (
        <section className={styles.deliverySection}>
          <div className={styles.deliverySectionCopy}>
            <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
              {strings.deliveryStep.royalBox.deliveryDayLabel}
            </Text>
            <Text className={styles.optionDescription} tone="inherit">
              {strings.deliveryStep.royalBox.deliveryDayHint}
            </Text>
          </div>
          <Grid className={styles.deliveryDayPicker}>
            {checkoutConfig.deliveryDays.map((day) => {
              const isActive = !isCustomDeliveryDay && selectedDeliveryDay === day;

              return (
                <Button
                  appearance="soft"
                  aria-label={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${day}`}
                  aria-pressed={isActive}
                  className={styles.deliveryDayButton}
                  key={day}
                  onClick={() => {
                    setIsCustomDeliveryDay(false);
                    setCustomDeliveryDay("");
                    onSelectDeliveryDay(day);
                  }}
                  tone="neutral"
                  type="button"
                >
                  <strong className={styles.choiceValue}>{day}</strong>
                </Button>
              );
            })}
            {isCustomDeliveryDay ? (
              <Input
                aria-label={strings.deliveryStep.royalBox.customDayLabel}
                autoFocus
                className={styles.deliveryDayCustom}
                error={customDeliveryDay && !isCustomDeliveryDayValid ? strings.deliveryStep.royalBox.customDayInvalid : undefined}
                inputMode="numeric"
                maxLength={2}
                onChange={(event) => handleCustomDeliveryDayChange(event.target.value)}
                placeholder={strings.deliveryStep.royalBox.customDayShortPlaceholder}
                state={isCustomDeliveryDayValid ? "active" : "default"}
                value={customDeliveryDay}
              />
            ) : (
              <Button
                appearance="outline"
                className={[styles.deliveryDayButton, styles.deliveryDayCustom].join(" ")}
                onClick={() => {
                  setCustomDeliveryDay(String(selectedDeliveryDay));
                  setIsCustomDeliveryDay(true);
                }}
                tone="primary"
                type="button"
              >
                {strings.deliveryStep.royalBox.customDayAction}
              </Button>
            )}
          </Grid>
          {isCustomDeliveryDay && customDeliveryDayNumber === 31 ? (
            <Text tone="text-muted" variant="caption">
              {strings.deliveryStep.royalBox.lastDayOfMonthHint}
            </Text>
          ) : null}
        </section>
      ) : null}

      {selectedMode === "royalDelivery" ? (
        <section className={styles.deliverySection}>
        <div className={styles.deliverySectionCopy}>
          <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
            {strings.deliveryStep.royalDelivery.freightLabel}
          </Text>
        </div>
          <Grid className={[styles.compactOptionGrid, styles.freightOptions].join(" ")}>
            {freightOptions.map((freight) => {
              const isActive = selectedFreight === freight.key;

              return (
                <Button
                  appearance="soft"
                  aria-pressed={isActive}
                  className={styles.freightButton}
                  key={freight.key}
                  onClick={() => onSelectFreight(freight.key)}
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
        </section>
      ) : null}

      <Inline className={styles.deliveryActions} justify="between">
        <Button appearance="outline" onClick={onBack}>
          {strings.deliveryStep.back}
        </Button>
        <Button appearance="solid" className={styles.checkoutPrimaryAction} disabled={isCustomDeliveryDay && !isCustomDeliveryDayValid} tone="neutral" onClick={onNext}>
          {strings.deliveryStep.next}
        </Button>
      </Inline>
    </Stack>
    </CheckoutPanel>
  );
};
