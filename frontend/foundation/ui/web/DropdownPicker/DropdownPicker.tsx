"use client";

import React, { useId, useMemo, useState } from "react";
import { ChevronRightIcon } from "../Icon/AppIcons";
import { Button } from "../Button";
import { Surface } from "../Surface";
import styles from "./DropdownPicker.module.css";

export interface DropdownPickerOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface DropdownPickerProps {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  onChange?: (value: string) => void;
  options: DropdownPickerOption[];
  placeholder?: string;
  value?: string;
  width?: "auto" | "full";
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  ariaLabel,
  className,
  disabled = false,
  label,
  onChange,
  options = [],
  placeholder,
  value,
  width = "full",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const selectedLabel = selected?.label || placeholder || options[0]?.label || "";

  const close = () => setIsOpen(false);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-open={isOpen || undefined}
      data-width={width}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <Button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        appearance="outline"
        className={styles.trigger}
        disabled={disabled}
        icon={<ChevronRightIcon />}
        iconPosition="end"
        onClick={() => setIsOpen((current) => !current)}
        size="sm"
        tone="neutral"
        type="button"
      >
        <span className={styles.value}>
          {label ? <span className={styles.inlineLabel}>{label}</span> : null}
          <span>{selectedLabel}</span>
        </span>
      </Button>

      <Surface
        appearance="solid"
        className={styles.panel}
        id={listboxId}
        role="listbox"
        tabIndex={-1}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Button
              aria-selected={isSelected}
              appearance={isSelected ? "soft" : "transparent"}
              className={styles.option}
              disabled={option.disabled}
              key={option.value}
              onClick={() => {
                if (option.disabled) return;
                onChange?.(option.value);
                close();
              }}
              role="option"
              size="sm"
              tone={isSelected ? "primary" : "neutral"}
              type="button"
            >
              {option.label}
            </Button>
          );
        })}
      </Surface>
    </div>
  );
};
