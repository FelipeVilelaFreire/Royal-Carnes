import React from "react";
import { Button, Grid, Inline, Stack, Surface, Text } from "@foundation/ui";
import { CartIcon as CreditCardIcon, CheckIcon } from "@foundation/ui/Icon/AppIcons";
import type {
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import { CheckoutPanel } from "./CheckoutPanel";
import { getCheckoutPrimaryActionStyle } from "./actionStyles";
import styles from "../PedidoView.module.css";

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
  tokens,
}) => (
  <CheckoutPanel
    badge={paymentCopy.badge}
    description={paymentCopy.description}
    title={paymentCopy.title}
    tokens={tokens}
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
                style={{
                  "--pedido-option-border": isActive ? tokens.copper : tokens.border,
                  "--pedido-option-bg": tokens.surfaceContainer,
                  "--pedido-option-text": tokens.text,
                  "--pedido-option-muted": tokens.textMuted,
                  "--pedido-option-accent": tokens.copper,
                  "--pedido-option-accent-contrast": tokens.ivory || tokens.surfaceContainer,
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
                <span className={styles.paymentIcon}>
                  <CreditCardIcon size={24} />
                </span>
                <span className={styles.paymentCopy}>
                  <Text as="strong" tone="inherit" variant="body" weight="semibold">
                    {method.label}
                  </Text>
                  <Text tone="inherit" variant="caption" style={{ color: tokens.textMuted }}>
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
          <Text tone="inherit" style={{ color: tokens.textMuted }}>
            {paymentCopy.recurrenceDescription}
          </Text>
        </Surface>
      ) : null}

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {paymentCopy.back}
        </Button>
        <Button appearance="solid" tone="neutral" style={getCheckoutPrimaryActionStyle(tokens)} onClick={onNext}>
          {paymentCopy.next}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
);
