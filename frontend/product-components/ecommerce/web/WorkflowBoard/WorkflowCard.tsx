import React from "react";
import { Card } from "../../../../foundation/ui/web/Card";
import { Text } from "../../../../foundation/ui/web/Text";
import type { WorkflowBoardCardModel } from "./WorkflowBoard.types";
import styles from "./WorkflowBoard.module.css";

interface WorkflowCardProps {
  ariaLabel?: string;
  card: WorkflowBoardCardModel;
  isUpdating?: boolean;
  onDragEnd?: () => void;
  onDragStart?: (card: WorkflowBoardCardModel) => void;
  onSelect?: (card: WorkflowBoardCardModel) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  ariaLabel,
  card,
  isUpdating = false,
  onDragEnd,
  onDragStart,
  onSelect,
}) => (
  <Card aria-busy={isUpdating || undefined} aria-label={ariaLabel || card.title} className={styles.card} data-updating={isUpdating || undefined} draggable={Boolean(onDragStart) && !isUpdating} onClick={() => onSelect?.(card)} onDragEnd={onDragEnd} onDragStart={() => onDragStart?.(card)} onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(card);
    }
  }} role={onSelect ? "button" : undefined} size="md" tabIndex={onSelect && !isUpdating ? 0 : undefined}>
    <div className={styles.cardHeader}>
      <Text as="h3" className={styles.cardTitle} tone="inherit" variant="caption" weight="semibold">
        {card.title}
      </Text>
    </div>
    {card.subtitle ? <Text as="p" className={styles.cardSubtitle} tone="inherit" variant="caption">{card.subtitle}</Text> : null}
    {card.metadata.length ? <Text as="p" className={styles.metadataItem} tone="inherit" variant="caption">{card.metadata.join(" · ")}</Text> : null}
  </Card>
);
