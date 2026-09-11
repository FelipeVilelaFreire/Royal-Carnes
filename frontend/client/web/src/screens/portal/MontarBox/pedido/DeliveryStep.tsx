import React from "react";
import { Button, Grid, Inline, Input, Stack, Surface, Text, TextArea } from "@foundation/ui";
import { CheckIcon, StoreIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import type { ClientCheckoutAddressFieldKey } from "@/manifest/checkout.config";
import { CheckoutPanel } from "./CheckoutPanel";
import styles from "../MontarBoxView.module.css";

export interface DeliveryStepProps {
  addresses: ClientCheckoutAddress[];
  checkoutConfig: { deliveryDays: number[] };
  currentFreightPrice: number;
  deliveryCopy: any;
  formatMoney: (value: number) => string;
  freightOptions: Array<{ key: ClientCheckoutFreightOptionKey; label: string; price: number; etaLabel: string }>;
  isAddingAddress: boolean;
  newAddressDraft: Record<ClientCheckoutAddressFieldKey, string>;
  newAddressFields: Array<{ key: ClientCheckoutAddressFieldKey; label: string; placeholder: string; gridColumn: string; gridSpan: string }>;
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
}) => (
  <CheckoutPanel
    badge={strings.deliveryStep.badge}
    description={deliveryCopy?.description || strings.deliveryStep.description}
    title={strings.deliveryStep.title}
  >
    <Grid className={styles.infoGrid}>
      {(deliveryCopy?.fields || []).map((field: string) => (
        <Surface appearance="soft" className={styles.infoTile} key={field}>
          <span className={styles.infoIcon}>
            <CheckIcon size={16} />
          </span>
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
                      <CheckIcon size={14} />
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
          className={styles.checkoutSubtleAction}
          size="sm"
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
                  data-grid-column={field.gridSpan}
                  key={field.key}
                  label={field.label}
                  onChange={(event) => onUpdateNewAddressDraft(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  value={newAddressDraft[field.key]}
                />
              ))}
            </Grid>
            <Inline justify="end">
              <Button appearance="outline" onClick={() => onSetAddingAddress(false)}>
                {strings.deliveryStep.common.cancelAddress}
              </Button>
              <Button appearance="solid" className={styles.checkoutPrimaryAction} tone="neutral" onClick={onSubmitNewAddress}>
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
          <Text className={styles.optionDescription} tone="inherit">
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
          <Text as="strong" className={styles.summaryValue} tone="inherit" variant="body">
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
        <Button appearance="solid" className={styles.checkoutPrimaryAction} tone="neutral" onClick={onNext}>
          {strings.deliveryStep.next}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
);
