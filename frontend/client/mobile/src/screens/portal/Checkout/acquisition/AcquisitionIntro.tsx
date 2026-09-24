import React, { type ReactNode } from "react";
import { Stack } from "@foundation/ui/native/Layout";

export interface AcquisitionIntroProps {
  children: ReactNode;
  isCompact?: boolean;
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, isCompact = false }) => (
  <Stack gap={isCompact ? "md" : "lg"}>
    {children}
  </Stack>
);
