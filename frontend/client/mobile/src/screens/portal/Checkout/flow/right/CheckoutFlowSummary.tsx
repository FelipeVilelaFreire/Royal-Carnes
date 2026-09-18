import React from "react";
import { MobileSelectionSummary } from "../../summary/MobileSelectionSummary";

type CheckoutFlowSummaryProps = React.ComponentProps<typeof MobileSelectionSummary>;

export const CheckoutFlowSummary: React.FC<CheckoutFlowSummaryProps> = (props) => (
  <MobileSelectionSummary {...props} />
);
