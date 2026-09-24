import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Inline } from "@foundation/ui/web/Layout";
import styles from "./DetailPageSkeleton.module.css";

export const DetailHeaderActionsSkeleton: React.FC<{ hasDeleteAction: boolean; hasEditAction: boolean }> = ({ hasDeleteAction, hasEditAction }) => {
  if (!hasDeleteAction && !hasEditAction) return null;
  return (
    <Inline align="center" className={styles.headerActions} gap="sm" wrap>
      {hasEditAction ? <ButtonSkeleton size="md" width="md" /> : null}
      {hasDeleteAction ? <ButtonSkeleton size="md" width="md" /> : null}
    </Inline>
  );
};
