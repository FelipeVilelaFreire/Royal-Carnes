import React from "react";
import { StickyOrderSummary } from "../../summary/StickyOrderSummary";

type CheckoutFlowRightProps = React.ComponentProps<typeof StickyOrderSummary>;

export const CheckoutFlowRight: React.FC<CheckoutFlowRightProps> = (props) => (
  <StickyOrderSummary {...props} />
);
