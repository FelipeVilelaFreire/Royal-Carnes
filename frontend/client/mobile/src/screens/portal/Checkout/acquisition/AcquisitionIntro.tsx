import React, { type ReactNode } from "react";
import { Stack } from "@foundation/ui/native/Layout";
import { Text } from "@foundation/ui/native/Text";

export interface AcquisitionIntroProps {
  children: ReactNode;
  strings: {
    description: string;
    eyebrow: string;
  };
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, strings }) => (
  <Stack gap="lg">
    <Stack gap="sm">
      <Text tone="primary" variant="caption" weight="bold">{strings.eyebrow}</Text>
      <Text tone="muted">{strings.description}</Text>
    </Stack>
    {children}
  </Stack>
);
