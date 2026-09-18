import React, { type ReactNode } from "react";
import { Stack } from "@foundation/ui/native/Layout";

interface CheckoutFlowProps {
  main: ReactNode;
  summary?: ReactNode;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ main, summary }) => (
  <Stack gap="lg">
    <Stack gap="lg">{main}</Stack>
    {summary}
  </Stack>
);
