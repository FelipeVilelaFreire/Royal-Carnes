import React, { type ReactNode } from "react";
import { Stack } from "@foundation/ui/native/Layout";
import { Text } from "@foundation/ui/native/Text";

export interface AcquisitionIntroProps {
  children: ReactNode;
  isCompact?: boolean;
  strings: {
    description: string;
  };
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, isCompact = false, strings }) => (
  <Stack gap={isCompact ? "md" : "lg"}>
    <Stack gap="sm">
      <Text tone="muted">{strings.description}</Text>
    </Stack>
    {children}
  </Stack>
);
