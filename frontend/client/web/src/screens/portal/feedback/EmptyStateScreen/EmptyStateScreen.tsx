import React, { type ReactNode } from "react";
import { Text } from "@foundation/ui/web/Text";
import styles from "./EmptyStateScreen.module.css";

export interface EmptyStateScreenProps {
  actions?: ReactNode;
  description?: string;
  icon?: ReactNode;
  title: string;
}

export const EmptyStateScreen: React.FC<EmptyStateScreenProps> = ({
  actions,
  description,
  icon,
  title,
}) => (
  <section className={styles.root} data-empty-state-screen>
    <div className={styles.content}>
      {icon ? <div aria-hidden="true" className={styles.icon}>{icon}</div> : null}
      <Text as="h1" className={styles.title} variant="h2">
        {title}
      </Text>
      {description ? (
        <Text className={styles.description} tone="text-muted">
          {description}
        </Text>
      ) : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  </section>
);
