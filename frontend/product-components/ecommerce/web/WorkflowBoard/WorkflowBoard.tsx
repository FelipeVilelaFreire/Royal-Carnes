import React, { useState } from "react";
import { WorkflowColumn } from "./WorkflowColumn";
import type { WorkflowBoardCardModel, WorkflowBoardColumnModel } from "./WorkflowBoard.types";
import styles from "./WorkflowBoard.module.css";

export interface WorkflowBoardProps {
  cardAriaLabel?: (card: WorkflowBoardCardModel) => string;
  columns: WorkflowBoardColumnModel[];
  onSelectCard?: (card: WorkflowBoardCardModel) => void;
  onStatusChange?: (cardId: string | number, statusKey: string) => void;
  updatingCardId?: string | number | null;
}

export const WorkflowBoard: React.FC<WorkflowBoardProps> = ({
  cardAriaLabel,
  columns,
  onSelectCard,
  onStatusChange,
  updatingCardId,
}) => {
  const [draggedCard, setDraggedCard] = useState<WorkflowBoardCardModel | null>(null);
  const [dropTargetKey, setDropTargetKey] = useState<string | null>(null);

  const handleDragStart = (card: WorkflowBoardCardModel) => {
    setDraggedCard(card);
    setDropTargetKey(null);
  };

  const clearDrag = () => {
    setDraggedCard(null);
    setDropTargetKey(null);
  };

  const canMoveTo = (statusKey: string) => !draggedCard?.allowedStatusKeys || draggedCard.allowedStatusKeys.includes(statusKey);

  const handleDragEnter = (statusKey: string) => {
    setDropTargetKey(canMoveTo(statusKey) ? statusKey : null);
  };

  const handleDrop = (statusKey: string) => {
    if (draggedCard && draggedCard.statusKey !== statusKey && canMoveTo(statusKey)) onStatusChange?.(draggedCard.id, statusKey);
    clearDrag();
  };

  return <div className={styles.board}>
    {columns.map((column) => (
      <WorkflowColumn
        cardAriaLabel={cardAriaLabel}
        column={column}
        isDropTarget={dropTargetKey === column.key}
        key={column.key}
        onCardDragEnd={clearDrag}
        onDropCard={handleDrop}
        onEnterCardDrag={handleDragEnter}
        onSelectCard={onSelectCard}
        onStartCardDrag={handleDragStart}
        updatingCardId={updatingCardId}
      />
    ))}
  </div>;
};
