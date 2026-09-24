import type {
  AdminStandardFieldOption,
  AdminStandardLineItemColumnViewModel,
} from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";

export function createEmptyLineItem(columns: AdminStandardLineItemColumnViewModel[]): Record<string, any> {
  return Object.fromEntries(columns.filter((column) => !column.readOnly).map((column) => [column.key, ""]));
}

export function resolveLineItemOptions(
  column: AdminStandardLineItemColumnViewModel,
  item: Record<string, any>,
): AdminStandardFieldOption[] {
  if (column.sourceBy && column.sources) {
    return column.sourceOptions?.[String(item[column.sourceBy])] || [];
  }
  return column.options || [];
}

export function resolveNextLineItem(
  item: Record<string, any>,
  column: AdminStandardLineItemColumnViewModel,
  nextValue: string,
): Record<string, any> {
  const selectedOption = resolveLineItemOptions(column, item)
    .find((candidate) => candidate.value === nextValue);
  const nextItem = {
    ...item,
    ...column.writeValues,
    [column.key]: nextValue,
  };

  Object.entries(column.writeOptionMeta || {}).forEach(([metaKey, itemKey]) => {
    const metaValue = selectedOption?.meta?.[metaKey];
    if (metaValue !== undefined && metaValue !== null) nextItem[itemKey] = metaValue;
  });

  return nextItem;
}

export function resolveLineItemDisplayValue(
  column: AdminStandardLineItemColumnViewModel,
  item: Record<string, any>,
  t: AdminTranslate,
) {
  const rawValue = String(item[column.key] || "");
  const option = resolveLineItemOptions(column, item).find((candidate) => candidate.value === rawValue);
  const value = column.valueType === "translationKey"
    ? t(rawValue, rawValue)
    : option?.label || t(option?.labelKey || "", rawValue) || rawValue;
  const suffix = column.suffixKey ? String(item[column.suffixKey] || "") : "";
  return suffix && value ? `${value} ${suffix}` : value;
}

export function resolveLineItemSuffix(
  column: AdminStandardLineItemColumnViewModel,
  item: Record<string, any>,
) {
  return column.suffixKey ? String(item[column.suffixKey] || "") : "";
}

export function resolveLineItemMaximum(
  column: AdminStandardLineItemColumnViewModel,
  item: Record<string, any>,
) {
  const value = column.maxKey ? Number(item[column.maxKey]) : Number.NaN;
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}
