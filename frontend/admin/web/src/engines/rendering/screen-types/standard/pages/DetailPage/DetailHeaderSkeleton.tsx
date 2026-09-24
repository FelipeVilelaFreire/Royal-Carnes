import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { DetailAvatarSkeleton } from "./DetailAvatarSkeleton";
import { DetailHeaderActionsSkeleton } from "./DetailHeaderActionsSkeleton";
import { DetailHeaderMetaSkeleton } from "./DetailHeaderMetaSkeleton";
import styles from "./DetailPageSkeleton.module.css";

export interface DetailHeaderSkeletonProps {
  hasDeleteAction: boolean;
  hasEditAction: boolean;
  hasStatus: boolean;
  metaCount: number;
}

export const DetailHeaderSkeleton: React.FC<DetailHeaderSkeletonProps> = ({ hasDeleteAction, hasEditAction, hasStatus, metaCount }) => (
  <Inline align="center" className={styles.header} justify="between" wrap>
    <Inline align="center" className={styles.identity} gap="md" wrap={false}>
      <ButtonSkeleton size="sm" width="sm" />
      <DetailAvatarSkeleton />
      <Stack className={styles.identityCopy} gap="xs">
        <Skeleton shape="text" size="lg" width="md" />
        <DetailHeaderMetaSkeleton hasStatus={hasStatus} metaCount={metaCount} />
      </Stack>
    </Inline>
    <DetailHeaderActionsSkeleton hasDeleteAction={hasDeleteAction} hasEditAction={hasEditAction} />
  </Inline>
);
