import React from "react";
import { Text } from "../../../../foundation/ui/web/Text";
import { WorkflowCard } from "./WorkflowCard";
import type { WorkflowBoardCardModel, WorkflowBoardColumnModel } from "./WorkflowBoard.types";
import styles from "./WorkflowBoard.module.css";

interface WorkflowColumnProps {
  cardAriaLabel?: (card: WorkflowBoardCardModel) => string;
  column: WorkflowBoardColumnModel;
  isDropTarget?: boolean;
  updatingCardId?: string | number | null;
  onCardDragEnd?: () => void;
  onDropCard?: (statusKey: string) => void;
  onEnterCardDrag?: (statusKey: string) => void;
  onSelectCard?: (card: WorkflowBoardCardModel) => void;
  onStartCardDrag?: (card: WorkflowBoardCardModel) => void;
}

export const WorkflowColumn: React.FC<WorkflowColumnProps> = ({
  cardAriaLabel,
  column,
  isDropTarget = false,
  updatingCardId,
  onCardDragEnd,
  onDropCard,
  onEnterCardDrag,
  onSelectCard,
  onStartCardDrag,
}) => (
  <section className={styles.column} data-drop-target={isDropTarget} data-status-tone={column.statusTone} onDragEnter={() => onEnterCardDrag?.(column.key)} onDragOver={(event) => event.preventDefault()} onDrop={() => onDropCard?.(column.key)}>
    <header className={styles.columnHeader}>
      <Text as="h2" className={styles.columnTitle} tone="inherit" variant="caption" weight="semibold">{column.label}</Text>
    </header>
    <div className={styles.cards}>
      {column.cards.map((card) => (
        <WorkflowCard
          ariaLabel={cardAriaLabel?.(card)}
          card={card}
          isUpdating={String(updatingCardId) === String(card.id)}
          key={card.id}
          onDragEnd={onCardDragEnd}
          onDragStart={onStartCardDrag}
          onSelect={onSelectCard}
        />
      ))}
    </div>
  </section>
);
