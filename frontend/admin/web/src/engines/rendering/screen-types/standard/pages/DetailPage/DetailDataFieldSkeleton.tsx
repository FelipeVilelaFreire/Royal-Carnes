import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { Skeleton, type SkeletonWidth } from "@foundation/ui/web/Skeleton";

export const DetailDataFieldSkeleton: React.FC<{ valueWidth?: SkeletonWidth }> = ({ valueWidth = "md" }) => (
  <Stack gap="xs">
    <Skeleton shape="text" size="xs" width="sm" />
    <Skeleton shape="text" size="sm" width={valueWidth} />
  </Stack>
);
