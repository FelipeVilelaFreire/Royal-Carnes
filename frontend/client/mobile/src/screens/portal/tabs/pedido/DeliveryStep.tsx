import React from "react";
import { Button } from "../../../../ui/Button";
import { Stack } from "../../../../ui/Layout";
import { Surface } from "../../../../ui/Surface";
import { Text } from "../../../../ui/Text";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOption,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProductExperience,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import type { ClientCheckoutConfig } from "../../../../../../shared-core/manifest/checkout.config";
import { createPedidoStyles } from "./styles";

export interface DeliveryStepProps {
  addresses: ClientCheckoutAddress[];
  checkoutConfig: ClientCheckoutConfig;
  currentFreightPrice: number;
  formatMoney: (value: number) => string;
  freightOptions: Array<ClientCheckoutFreightOption & { label: string }>;
  onBack: () => void;
  onNext: () => void;
  onSelectAddress: (addressId: string) => void;
  onSelectDeliveryDay: (day: number) => void;
  onSelectFreight: (freight: ClientCheckoutFreightOptionKey) => void;
  selectedAddressId: string;
  selectedDeliveryDay: number;
  selectedFreight: ClientCheckoutFreightOptionKey | null;
  selectedMode: ClientCheckoutProductExperience;
  strings: any;
  tokens: any;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  addresses,
  checkoutConfig,
  currentFreightPrice,
  formatMoney,
  freightOptions,
  onBack,
  onNext,
  onSelectAddress,
  onSelectDeliveryDay,
  onSelectFreight,
  selectedAddressId,
  selectedDeliveryDay,
  selectedFreight,
  selectedMode,
  strings,
  tokens,
}) => {
  const styles = createPedidoStyles(tokens);
  const deliveryCopy = strings.deliveryStep[selectedMode];

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.accent} variant="caption">{strings.deliveryStep.badge}</Text>
        <Text style={styles.title} variant="h2">{strings.deliveryStep.title}</Text>
        <Text style={styles.muted}>{deliveryCopy?.description || strings.deliveryStep.description}</Text>
        {selectedMode === "royalBox" ? (
          <Stack style={styles.compactStack}>
            <Text style={styles.title}>{strings.deliveryStep.royalBox.deliveryDayLabel}</Text>
            {checkoutConfig.deliveryDays.map((day) => (
              <Button
                appearance={day === selectedDeliveryDay ? "soft" : "transparent"}
                key={day}
                onAction={() => onSelectDeliveryDay(day)}
                style={{ ...styles.option, ...(day === selectedDeliveryDay ? styles.optionActive : {}) }}
                tone={day === selectedDeliveryDay ? "primary" : "neutral"}
              >
                {`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${day}`}
              </Button>
            ))}
          </Stack>
        ) : null}
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
        <Button onAction={onBack}>{strings.deliveryStep.back}</Button>
        <Button onAction={onNext} style={styles.action}>{strings.deliveryStep.next}</Button>
      </Stack>
    </Surface>
  );
};
