import React from "react";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import { DeliveryStep } from "../../delivery/DeliveryStep";
import { PaymentStep } from "../../payment/PaymentStep";
import { ReviewStep } from "../../review/ReviewStep";
import { CheckoutMontageStep } from "./CheckoutMontageStep";

interface CheckoutFlowLeftProps {
  currentStep: ClientCheckoutStepKey;
  delivery: React.ComponentProps<typeof DeliveryStep>;
  montage: React.ComponentProps<typeof CheckoutMontageStep>;
  payment: React.ComponentProps<typeof PaymentStep>;
  review: React.ComponentProps<typeof ReviewStep>;
}

export const CheckoutFlowLeft: React.FC<CheckoutFlowLeftProps> = ({
  currentStep,
  delivery,
  montage,
  payment,
  review,
}) => (
  <>
    {currentStep === "montagem" ? <CheckoutMontageStep {...montage} /> : null}
    {currentStep === "entrega" ? <DeliveryStep {...delivery} /> : null}
    {currentStep === "pagamento" ? <PaymentStep {...payment} /> : null}
    {currentStep === "resumo" ? <ReviewStep {...review} /> : null}
  </>
);
