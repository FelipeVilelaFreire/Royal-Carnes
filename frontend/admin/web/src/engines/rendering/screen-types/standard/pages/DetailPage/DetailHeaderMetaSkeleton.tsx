import React from "react";
import { Inline } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { DetailBadgeSkeleton } from "./DetailBadgeSkeleton";
import styles from "./DetailPageSkeleton.module.css";

export const DetailHeaderMetaSkeleton: React.FC<{ hasStatus: boolean; metaCount: number }> = ({ hasStatus, metaCount }) => (
  <Inline className={styles.headerMeta} gap="sm" wrap>
    {Array.from({ length: metaCount }).map((_, index) => <Skeleton key={index} shape="text" size="xs" width="sm" />)}
    {hasStatus ? <DetailBadgeSkeleton /> : null}
  </Inline>
);
