import React, { type ReactNode } from "react";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import styles from "./CheckoutFlow.module.css";

interface CheckoutFlowProps {
  currentStep: ClientCheckoutStepKey;
  left: ReactNode;
  right?: ReactNode;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ currentStep, left, right }) => (
  <section
    className={`${styles.root} ${right ? styles.withSummary : styles.review}`}
    data-checkout-step={currentStep}
  >
    <div className={styles.left}>{left}</div>
    {right}
  </section>
);
