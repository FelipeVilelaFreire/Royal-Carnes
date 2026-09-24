import React from "react";
import { DropdownPickerSkeleton } from "@foundation/ui/web/DropdownPicker";
import { InputSkeleton } from "@foundation/ui/web/Input";
import { Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import type { AdminStandardFormFieldViewModel } from "@/view-models/standard.view-model";
import styles from "./AddPageSkeleton.module.css";

export const AddPageFormFieldSkeleton: React.FC<{ field: AdminStandardFormFieldViewModel }> = ({ field }) => (
  <Stack className={styles.field} gap="xs">
    <Skeleton shape="text" size="xs" width="sm" />
    {field.type === "select" || field.type === "multiSelect"
      ? <DropdownPickerSkeleton size="lg" width="full" />
      : field.type === "textarea" || field.type === "lineItems"
        ? <Skeleton className={styles.multilineField} size="xl" width="full" />
        : <InputSkeleton size="lg" width="full" />}
  </Stack>
);
