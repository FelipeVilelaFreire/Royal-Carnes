import type { ReactNode } from "react";

export type ScreenTranslate = (key: string, variables?: Record<string, string | number>) => string;

export type ScreenFilterConfig = {
  key: string;
  labelKey: string;
  options: Array<{ labelKey: string; value: string }>;
};

export type ScreenStatConfig = {
  key: string;
  labelKey: string;
  value: string;
  helper: string;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
};

export type HistoryEventSeverity = "info" | "warning" | "critical" | "success";

export type HistoryEventRow = {
  id: number;
  title: string;
  description: string;
  actor: string;
  actorType: "system" | "support" | "admin";
  target: string;
  eventType: "security" | "tenant" | "billing" | "recovery";
  severity: HistoryEventSeverity;
  severityLabelKey: string;
  date: string;
};

export type HistoryScreenConfig = {
  titleKey: string;
  subtitleKey: string;
  icon?: ReactNode;
  searchPlaceholderKey: string;
  filters: ScreenFilterConfig[];
  stats: ScreenStatConfig[];
  rows: HistoryEventRow[];
};

export type TrashItemStatus = "recoverable" | "expiring" | "locked";

export type TrashItemRow = {
  id: number;
  name: string;
  description: string;
  entity: string;
  entityLabelKey: string;
  removedBy: string;
  status: TrashItemStatus;
  statusLabelKey: string;
  removedAt: string;
  retention: string;
};

export type TrashScreenConfig = {
  titleKey: string;
  subtitleKey: string;
  icon?: ReactNode;
  searchPlaceholderKey: string;
  filters: ScreenFilterConfig[];
  stats: ScreenStatConfig[];
  rows: TrashItemRow[];
};

export type DashboardWidgetTone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";
export type DashboardWidgetSize = "sm" | "md" | "lg" | "xl";

export type DashboardStatWidgetConfig = {
  type: "stat";
  key: string;
  titleKey: string;
  descriptionKey?: string;
  value: string;
  helper: string;
  icon?: ReactNode;
  tone?: DashboardWidgetTone;
};

export type DashboardWidgetConfig = DashboardStatWidgetConfig;

export type DashboardConfig = {
  screenType: "dashboard";
  titleKey: string;
  subtitleKey: string;
  widgets: DashboardWidgetConfig[];
  recentOrders?: Array<{ id: string; member: string; plan: string; box: string; status: string; date: string }>;
};

export type EntityColumnConfig = {
  key: string;
  labelKey: string;
  render?: (row: any) => ReactNode;
};

export type EntityFormFieldConfig = {
  key: string;
  labelKey: string;
  type: "text" | "select" | "textarea" | "asset";
  options?: Array<{ labelKey: string; value: string }>;
  required?: boolean;
};

export type EntityListConfig = {
  titleKey: string;
  subtitleKey: string;
  actionLabelKey: string;
  searchPlaceholderKey: string;
  filters: ScreenFilterConfig[];
  columns: EntityColumnConfig[];
  rows: any[];
};

export type EntityFormConfig = {
  fields: EntityFormFieldConfig[];
};

export type RuntimeEntityConfig = {
  screenType: "standard";
  entityKey: string;
  listPage: EntityListConfig;
  form?: EntityFormConfig;
};
