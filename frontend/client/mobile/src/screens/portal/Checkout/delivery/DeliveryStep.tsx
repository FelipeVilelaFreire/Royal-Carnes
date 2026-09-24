import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Input } from "@foundation/ui/native/Input";
import { Inline, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOption,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProductExperience,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import type { ClientCheckoutAddressFieldKey, ClientCheckoutConfig } from "../../../../../../shared-core/manifest/checkout.config";
import { createCheckoutStyles } from "../checkout.styles";

export interface DeliveryStepProps {
  addressSaveState: "idle" | "saving" | "error";
  addresses: ClientCheckoutAddress[];
  canSaveNewAddress: boolean;
  checkoutConfig: ClientCheckoutConfig;
  currentFreightPrice: number;
  formatMoney: (value: number) => string;
  freightOptions: Array<ClientCheckoutFreightOption & { label: string }>;
  isAddingAddress: boolean;
  newAddressDraft: Record<ClientCheckoutAddressFieldKey, string>;
  newAddressFields: Array<{
    key: ClientCheckoutAddressFieldKey;
    label: string;
    placeholder: string;
  }>;
  onBack: () => void;
  onNext: () => void;
  onSetAddingAddress: (value: boolean) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectDeliveryDay: (day: number) => void;
  onSelectFreight: (freight: ClientCheckoutFreightOptionKey) => void;
  onSubmitNewAddress: () => void;
  onUpdateNewAddressDraft: (field: ClientCheckoutAddressFieldKey, value: string) => void;
  selectedAddressId: string;
  selectedDeliveryDay: number;
  selectedFreight: ClientCheckoutFreightOptionKey | null;
  selectedMode: ClientCheckoutProductExperience;
  strings: any;
  tokens: any;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  addressSaveState,
  addresses,
  canSaveNewAddress,
  checkoutConfig,
  currentFreightPrice,
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
}) => {
  const styles = createCheckoutStyles(tokens);
  const deliveryCopy = strings.deliveryStep[selectedMode];
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
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.accent} variant="caption">{strings.deliveryStep.badge}</Text>
        <Text style={styles.title} variant="h2">{strings.deliveryStep.title}</Text>
        <Text style={styles.muted}>{deliveryCopy?.description || strings.deliveryStep.description}</Text>
        {selectedMode === "royalDelivery" ? (
          <Stack style={styles.compactStack}>
            <Text style={styles.title}>{strings.deliveryStep.royalDelivery.freightLabel}</Text>
            {freightOptions.map((option) => (
              <Button
                appearance={option.key === selectedFreight ? "soft" : "transparent"}
                key={option.key}
                onAction={() => onSelectFreight(option.key)}
                style={{ ...styles.option, ...(option.key === selectedFreight ? styles.optionActive : {}) }}
                tone={option.key === selectedFreight ? "primary" : "neutral"}
              >
                {`${option.label} - ${formatMoney(option.price)}`}
              </Button>
            ))}
            <Text style={styles.muted}>{formatMoney(currentFreightPrice)}</Text>
          </Stack>
        ) : null}
        <Text style={styles.title}>{strings.deliveryStep.common.addressTitle}</Text>
        <Button appearance="outline" onAction={() => onSetAddingAddress(true)} tone="neutral">
          {strings.deliveryStep.common.addAddress}
        </Button>
        {addresses.map((address) => {
          const active = selectedAddressId === address.id;

          return (
            <Button key={address.id} onAction={() => onSelectAddress(address.id)} style={{ ...styles.option, ...(active ? styles.optionActive : {}) }}>
              <Surface style={{ borderWidth: 0, ...styles.compactStack }}>
                <Text style={styles.title}>{address.label}</Text>
                <Text style={styles.muted}>{address.recipientName}</Text>
                <Text style={styles.muted}>{address.streetLine}</Text>
                <Text style={styles.muted}>{address.neighborhoodLine}</Text>
                <Text style={styles.muted}>{`${strings.deliveryStep.common.zipPrefix} ${address.zipCode}`}</Text>
              </Surface>
            </Button>
          );
        })}
        {isAddingAddress ? (
          <Surface style={styles.option}>
            <Stack style={styles.compactStack}>
              <Text style={styles.title}>{strings.deliveryStep.common.newAddressTitle}</Text>
              {newAddressFields.map((field) => (
                <Stack key={field.key} style={styles.compactStack}>
                  <Text style={styles.muted} variant="caption">{field.label}</Text>
                  <Input
                    accessibilityLabel={field.label}
                    onChangeText={(value) => onUpdateNewAddressDraft(field.key, value)}
                    placeholder={field.placeholder}
                    value={newAddressDraft[field.key]}
                  />
                </Stack>
              ))}
              <Button appearance="outline" onAction={() => onSetAddingAddress(false)} tone="neutral">
                {strings.deliveryStep.common.cancelAddress}
              </Button>
              <Button disabled={!canSaveNewAddress || addressSaveState === "saving"} onAction={() => void onSubmitNewAddress()} style={styles.action}>
                {strings.deliveryStep.common.saveAddress}
              </Button>
              {addressSaveState === "error" ? <Text style={styles.muted} variant="caption">{strings.deliveryStep.common.addressSaveError}</Text> : null}
            </Stack>
          </Surface>
        ) : null}
        {selectedMode === "royalBox" ? (
          <Stack style={styles.compactStack}>
            <Text style={styles.title}>{strings.deliveryStep.royalBox.deliveryDayLabel}</Text>
            <Text style={styles.muted}>{strings.deliveryStep.royalBox.deliveryDayHint}</Text>
            <Inline style={styles.deliveryDayPicker}>
            {checkoutConfig.deliveryDays.map((day) => {
              const isActive = !isCustomDeliveryDay && day === selectedDeliveryDay;

              return (
                <Button
                  accessibilityLabel={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${day}`}
                  appearance={isActive ? "soft" : "outline"}
                  key={day}
                  onAction={() => {
                    setIsCustomDeliveryDay(false);
                    setCustomDeliveryDay("");
                    onSelectDeliveryDay(day);
                  }}
                  style={styles.deliveryDayButton}
                  tone={isActive ? "primary" : "neutral"}
                >
                  {String(day)}
                </Button>
              );
            })}
            {isCustomDeliveryDay ? (
              <Input
                accessibilityLabel={strings.deliveryStep.royalBox.customDayLabel}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={handleCustomDeliveryDayChange}
                placeholder={strings.deliveryStep.royalBox.customDayShortPlaceholder}
                state={isCustomDeliveryDayValid ? "active" : "default"}
                style={styles.deliveryDayInput}
                value={customDeliveryDay}
              />
            ) : (
              <Button
                appearance="outline"
                onAction={() => {
                  setCustomDeliveryDay(String(selectedDeliveryDay));
                  setIsCustomDeliveryDay(true);
                }}
                style={styles.deliveryDayButton}
                tone="primary"
              >
                {strings.deliveryStep.royalBox.customDayAction}
              </Button>
            )}
            </Inline>
            {isCustomDeliveryDay && customDeliveryDayNumber === 31 ? (
              <Text style={styles.muted} variant="caption">{strings.deliveryStep.royalBox.lastDayOfMonthHint}</Text>
            ) : null}
          </Stack>
        ) : null}
        <Button onAction={onBack}>{strings.deliveryStep.back}</Button>
        <Button disabled={isCustomDeliveryDay && !isCustomDeliveryDayValid} onAction={onNext} style={styles.action}>{strings.deliveryStep.next}</Button>
      </Stack>
    </Surface>
  );
};
