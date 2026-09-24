import React from "react";
import { Button, Grid, Inline, Stack, Text } from "@foundation/ui";
import { CheckIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { ClientCheckoutPaymentMethodKey } from "@/view-models/checkout.view-model";
import { CheckoutPanel } from "../layout/CheckoutPanel";
import styles from "../CheckoutView.module.css";

export interface PaymentStepProps {
  onBack: () => void;
  onContactWhatsApp?: () => void;
  onNext: () => void;
  onSelectPaymentMethod: (method: ClientCheckoutPaymentMethodKey) => void;
  paymentCopy: any;
  paymentMethods: Array<{ key: ClientCheckoutPaymentMethodKey; label: string; description: string }>;
  selectedPaymentMethod: ClientCheckoutPaymentMethodKey;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  onContactWhatsApp,
  onNext,
  onSelectPaymentMethod,
  paymentCopy,
  paymentMethods,
  selectedPaymentMethod,
}) => {
  const isWhatsAppSelected = selectedPaymentMethod === "whatsapp";
  const handlePrimaryAction = isWhatsAppSelected && onContactWhatsApp ? onContactWhatsApp : onNext;

  return (
  <CheckoutPanel
    badge={paymentCopy.badge}
    description={paymentCopy.description}
    title={paymentCopy.title}
  >
    <Stack gap="lg">
      <Stack gap="sm">
        <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
          {paymentCopy.methodsTitle}
        </Text>
        <Grid className={styles.paymentMethodGrid} data-payment-count={paymentMethods.length}>
          {paymentMethods.map((method) => {
            const isActive = selectedPaymentMethod === method.key;

            return (
              <Button
                appearance="soft"
                aria-pressed={isActive}
                className={styles.paymentMethodButton}
                key={method.key}
                onClick={() => onSelectPaymentMethod(method.key)}
                tone="neutral"
                type="button"
              >
                <span className={styles.paymentCopy}>
                  <Text as="strong" tone="inherit" variant="body" weight="semibold">
                    {method.label}
                  </Text>
                  <Text className={styles.optionDescription} tone="inherit" variant="caption">
                    {method.description}
                  </Text>
                </span>
                {isActive ? (
                  <span className={styles.paymentSelected}>
                    <CheckIcon size={15} />
                  </span>
                ) : null}
              </Button>
            );
          })}
        </Grid>
      </Stack>

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {paymentCopy.back}
        </Button>
        <Button appearance="solid" className={styles.checkoutPrimaryAction} tone="neutral" onClick={handlePrimaryAction}>
          {isWhatsAppSelected ? paymentCopy.whatsappAction : paymentCopy.next}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
  );
};
