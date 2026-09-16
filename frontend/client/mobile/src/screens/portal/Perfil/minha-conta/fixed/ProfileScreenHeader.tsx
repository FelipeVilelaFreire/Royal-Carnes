import React from "react";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import type { useClientStrings } from "../../../../../../../shared-core/hooks/useClientStrings";

export function ProfileScreenHeader({ strings }: { strings: ReturnType<typeof useClientStrings>["minhaContaV2"] }) {
  return (
    <ScreenHeader
      description={strings.subtitle}
      eyebrow={strings.eyebrow}
      mobileMode="collapsible"
      mobileTitle={strings.title}
      showScrollBorder={false}
      title={strings.title}
    />
  );
}
