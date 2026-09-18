import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel, AdminStandardLineItemsHierarchyViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { resolveLineItemDisplayValue } from "../line-items.utils";
import styles from "../LineItemsEditor.module.css";

interface HierarchyNode {
  children: Map<string, HierarchyNode>;
  item?: Record<string, any>;
  label: string;
}

interface LineItemsHierarchyProps {
  columns: AdminStandardLineItemColumnViewModel[];
  hierarchy: AdminStandardLineItemsHierarchyViewModel;
  items: Array<Record<string, any>>;
  t: AdminTranslate;
}

function createHierarchy(items: Array<Record<string, any>>, pathKey: string) {
  const root: HierarchyNode = { children: new Map(), label: "" };
  items.forEach((item) => {
    const parts = String(item[pathKey] || "").split("/").map((part) => part.trim()).filter(Boolean);
    let current = root;
    parts.forEach((label) => {
      const next = current.children.get(label) || { children: new Map(), label };
      current.children.set(label, next);
      current = next;
    });
    if (parts.length) current.item = item;
  });
  return root;
}

export const LineItemsHierarchy: React.FC<LineItemsHierarchyProps> = ({ columns, hierarchy, items, t }) => {
  const quantityColumn = columns.find((column) => column.key === hierarchy.quantityKey);
  const maxSelectionsColumn = hierarchy.maxSelectionsKey
    ? columns.find((column) => column.key === hierarchy.maxSelectionsKey)
    : undefined;
  const root = createHierarchy(items, hierarchy.pathKey);

  const renderNode = (node: HierarchyNode) => {
    const quantity = node.item && quantityColumn
      ? resolveLineItemDisplayValue(quantityColumn, node.item, t)
      : "";
    const maxSelections = node.item && maxSelectionsColumn
      ? resolveLineItemDisplayValue(maxSelectionsColumn, node.item, t)
      : "";
    return (
      <li className={styles.hierarchyNode} key={node.label}>
        <div className={styles.hierarchyRow}>
          <Text as="span" className={styles.hierarchyLabel} variant="body" weight="semibold">{node.label}</Text>
          {node.item ? (
            <Stack className={styles.hierarchyLimits} gap="2xs">
              <Text as="span" tone="muted" variant="caption">{t(hierarchy.limitLabelKey)}</Text>
              <Text as="strong" variant="body" weight="bold">{quantity}</Text>
              {maxSelections && hierarchy.maxSelectionsLabelKey ? (
                <Text as="span" tone="muted" variant="caption">{t(hierarchy.maxSelectionsLabelKey, "", { count: maxSelections })}</Text>
              ) : null}
            </Stack>
          ) : null}
        </div>
        {node.children.size ? <ul className={styles.hierarchyChildren}>{[...node.children.values()].map(renderNode)}</ul> : null}
      </li>
    );
  };

  return <ul className={styles.hierarchy}>{[...root.children.values()].map(renderNode)}</ul>;
};
