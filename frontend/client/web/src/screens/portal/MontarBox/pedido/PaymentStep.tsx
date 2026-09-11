import React from "react";
import { Button, Grid, Inline, Stack, Surface, Text } from "@foundation/ui";
import { CartIcon as CreditCardIcon, CheckIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import { CheckoutPanel } from "./CheckoutPanel";
import styles from "../MontarBoxView.module.css";

export interface PaymentStepProps {
  onBack: () => void;
  onNext: () => void;
  onSelectInstallments: (installments: number) => void;
  onSelectPaymentMethod: (method: ClientCheckoutPaymentMethodKey) => void;
  paymentCopy: any;
  paymentInstallments: number[];
  paymentMethods: Array<{ key: ClientCheckoutPaymentMethodKey; label: string; description: string }>;
  selectedInstallments: number;
  selectedMode: ClientCheckoutProductExperience;
  selectedPaymentMethod: ClientCheckoutPaymentMethodKey;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  onNext,
  onSelectInstallments,
  onSelectPaymentMethod,
  paymentCopy,
  paymentInstallments,
  paymentMethods,
  selectedInstallments,
  selectedMode,
  selectedPaymentMethod,
}) => (
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
        <Grid className={styles.paymentMethodGrid}>
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
                <span className={styles.paymentIcon}>
                  <CreditCardIcon size={24} />
                </span>
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

      {selectedPaymentMethod === "creditCard" ? (
        <Stack gap="sm">
          <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
            {paymentCopy.installmentsTitle}
          </Text>
          <Grid className={styles.installmentGrid}>
            {paymentInstallments.map((installment) => {
              const isActive = selectedInstallments === installment;

              return (
                <Button
                  appearance="soft"
                  aria-pressed={isActive}
                  className={styles.installmentButton}
                  key={installment}
                  onClick={() => onSelectInstallments(installment)}
                  tone="neutral"
                  type="button"
                >
                  {installment}{paymentCopy.installmentsSuffix}
                </Button>
              );
            })}
          </Grid>
        </Stack>
      ) : null}

      {selectedMode === "subscription" || selectedMode === "royalBox" ? (
        <Surface appearance="soft" className={styles.formPanel}>
          <Text as="strong" tone="inherit" variant="body" weight="semibold">
            {paymentCopy.recurrenceTitle}
          </Text>
          <Text className={styles.optionDescription} tone="inherit">
            {paymentCopy.recurrenceDescription}
          </Text>
        </Surface>
      ) : null}

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {paymentCopy.back}
        </Button>
        <Button appearance="solid" className={styles.checkoutPrimaryAction} tone="neutral" onClick={onNext}>
          {paymentCopy.next}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
);
