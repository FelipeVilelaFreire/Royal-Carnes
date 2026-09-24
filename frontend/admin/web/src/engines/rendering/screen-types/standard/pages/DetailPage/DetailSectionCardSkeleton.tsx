import React, { type ReactNode } from "react";
import { Card } from "@foundation/ui/web/Card";
import { DetailSectionHeaderSkeleton } from "./DetailSectionHeaderSkeleton";
import styles from "./DetailPageSkeleton.module.css";

export const DetailSectionCardSkeleton: React.FC<{ children: ReactNode; hasTitle: boolean }> = ({ children, hasTitle }) => (
  <Card className={styles.sectionCard} size="lg">
    {hasTitle ? <DetailSectionHeaderSkeleton /> : null}
    <div className={styles.sectionContent}>{children}</div>
  </Card>
);
