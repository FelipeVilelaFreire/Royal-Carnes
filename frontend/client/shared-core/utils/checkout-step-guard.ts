import type { ClientCheckoutStepKey } from "../manifest/checkout.config";

export const requestClientCheckoutStep = ({
  isAuthenticated,
  onRequestAccess,
  setCurrentStep,
  step,
}: {
  isAuthenticated: boolean;
  onRequestAccess: () => void;
  setCurrentStep: (step: ClientCheckoutStepKey) => void;
  step: ClientCheckoutStepKey;
}) => {
  if (!isAuthenticated) {
    onRequestAccess();
    return;
  }

  setCurrentStep(step);
};
