import React from "react";
import { Grid, Stack } from "@foundation/ui/web/Layout";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import styles from "./DetailQuickInfo.module.css";

export interface DetailQuickInfoItem {
  key: string;
  label: string;
  value: string;
}

export interface DetailQuickInfoProps {
  items: DetailQuickInfoItem[];
}

export const DetailQuickInfo: React.FC<DetailQuickInfoProps> = ({ items }) => {
  if (!items.length) return null;

  return (
    <Grid className={styles.grid} columns={items.length} gap="sm">
      {items.map((item) => (
        <Surface appearance="glass" className={styles.card} key={item.key} tone="neutral">
          <Stack gap="2xs">
            <Text as="span" className={styles.label} tone="muted" variant="caption" weight="bold">{item.label}</Text>
            <Text as="strong" className={styles.value} variant="body" weight="bold">{item.value}</Text>
          </Stack>
        </Surface>
      ))}
    </Grid>
  );
};
