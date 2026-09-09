"use client";

import React, { forwardRef, useState, type HTMLAttributes } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { CloseIcon } from "../Icon/AppIcons";
import { Inline, Stack } from "../Layout";
import { ConfirmationModal } from "../Modal";
import { Select } from "../Select";
import styles from "./MultiSelect.module.css";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  cancelRemoveLabel?: string;
  confirmRemoveDescription?: (optionLabel: string) => string;
  confirmRemoveLabel?: string;
  confirmRemoveTitle?: string;
  disabled?: boolean;
  emptyOptionLabel: string;
  onChange?: (value: string[]) => void;
  options?: MultiSelectOption[];
  removeLabel: (optionLabel: string) => string;
  removeModalCloseLabel?: string;
  value?: string[];
}

function normalizeValue(value: string[] | undefined): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    cancelRemoveLabel,
    className,
    confirmRemoveDescription,
    confirmRemoveLabel,
    confirmRemoveTitle,
    disabled = false,
    emptyOptionLabel,
    onChange,
    options = [],
    removeLabel,
    removeModalCloseLabel,
    value,
    ...props
  },
  ref,
) {
  const [pendingRemoval, setPendingRemoval] = useState<MultiSelectOption | null>(null);
  const selectedValues = normalizeValue(value);
  const selectedSet = new Set(selectedValues);
  const availableOptions = options.filter((option) => !selectedSet.has(option.value));
  const selectedOptions = selectedValues.map(
    (selectedValue) => options.find((option) => option.value === selectedValue) || {
      label: selectedValue,
      value: selectedValue,
    },
  );

  const handleAdd = (nextValue: string) => {
    if (!nextValue || selectedSet.has(nextValue)) return;
    onChange?.([...selectedValues, nextValue]);
  };

  const handleRemove = (nextValue: string) => {
    onChange?.(selectedValues.filter((selectedValue) => selectedValue !== nextValue));
    setPendingRemoval(null);
  };

  const requestRemove = (option: MultiSelectOption) => {
    if (!confirmRemoveTitle || !confirmRemoveLabel || !cancelRemoveLabel || !removeModalCloseLabel) {
      handleRemove(option.value);
      return;
    }
    setPendingRemoval(option);
  };

  return (
    <div
      {...props}
      className={[styles.multiSelect, className].filter(Boolean).join(" ")}
      ref={ref}
    >
      <Stack gap="sm">
        <Select
          disabled={disabled || availableOptions.length === 0}
          onChange={(event) => handleAdd(event.target.value)}
          options={[
            { label: emptyOptionLabel, value: "" },
            ...availableOptions,
          ]}
          value=""
        />

        {selectedOptions.length ? (
          <Inline className={styles.badgeList} gap="xs" wrap>
            {selectedOptions.map((option) => (
              <Badge appearance="soft" className={styles.badge} key={option.value} tone="neutral">
                <span className={styles.badgeLabel}>{option.label}</span>
                <Button
                  appearance="transparent"
                  aria-label={removeLabel(option.label)}
                  className={styles.removeButton}
                  icon={<CloseIcon aria-hidden="true" />}
                  iconPosition="only"
                  onClick={() => requestRemove(option)}
                  size="sm"
                  tone="neutral"
                  type="button"
                />
              </Badge>
            ))}
          </Inline>
        ) : null}
      </Stack>
      {pendingRemoval ? (
        <ConfirmationModal
          cancelLabel={cancelRemoveLabel || ""}
          closeLabel={removeModalCloseLabel || ""}
          confirmLabel={confirmRemoveLabel || ""}
          description={confirmRemoveDescription?.(pendingRemoval.label)}
          onCancel={() => setPendingRemoval(null)}
          onConfirm={() => handleRemove(pendingRemoval.value)}
          open
          title={confirmRemoveTitle || ""}
        />
      ) : null}
    </div>
  );
});
