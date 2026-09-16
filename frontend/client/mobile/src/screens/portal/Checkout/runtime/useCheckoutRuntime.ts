import { useCallback } from "react";
import type { ClientCheckoutStepKey } from "../../../../../../shared-core/manifest/checkout.config";
import { requestClientCheckoutStep } from "../../../../../../shared-core/utils/checkout-step-guard";

export const useCheckoutRuntime = ({
  isAuthenticated,
  onRequestAccess,
}: {
  isAuthenticated: boolean;
  onRequestAccess: () => void;
}) => {
  const requestProtectedStep = useCallback(
    (step: ClientCheckoutStepKey, setCurrentStep: (nextStep: ClientCheckoutStepKey) => void) => {
      requestClientCheckoutStep({ isAuthenticated, onRequestAccess, setCurrentStep, step });
    },
    [isAuthenticated, onRequestAccess],
  );

  return { requestProtectedStep };
};
