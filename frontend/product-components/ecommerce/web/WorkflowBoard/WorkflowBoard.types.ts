export interface WorkflowBoardStatusOption {
  label: string;
  value: string;
}

export interface WorkflowBoardCardModel {
  allowedStatusKeys?: string[];
  id: string | number;
  metadata: string[];
  sourceRow: Record<string, any>;
  statusKey: string;
  subtitle: string;
  title: string;
}

export interface WorkflowBoardColumnModel {
  cards: WorkflowBoardCardModel[];
  key: string;
  label: string;
  statusColor?: string;
  statusTone?: "danger" | "neutral" | "primary" | "success" | "warning";
}
