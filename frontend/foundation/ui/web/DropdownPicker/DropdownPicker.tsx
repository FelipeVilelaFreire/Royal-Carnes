"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const selectedLabel = selected?.label || placeholder || options[0]?.label || "";

  const close = () => setIsOpen(false);
  const updatePanelPosition = useCallback(() => {
    const rect = rootRef.current?.getBoundingClientRect();
    const panel = panelRef.current;
    if (!rect || !panel) return;

    panel.style.setProperty("--ui-dropdown-picker-panel-block-start", `${rect.bottom}px`);
    panel.style.setProperty("--ui-dropdown-picker-panel-inline-start", `${rect.left}px`);
    panel.style.setProperty("--ui-dropdown-picker-panel-width", `${rect.width}px`);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();
    const observer = typeof ResizeObserver === "undefined" || !rootRef.current
      ? undefined
      : new ResizeObserver(updatePanelPosition);

    observer?.observe(rootRef.current);
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-open={isOpen || undefined}
      data-width={width}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !panelRef.current?.contains(event.relatedTarget as Node)) close();
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

      {isOpen && typeof document !== "undefined" ? createPortal(
        <Surface
          appearance="solid"
          className={styles.panel}
          data-open="true"
          id={listboxId}
          ref={panelRef}
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
        </Surface>,
        document.body,
      ) : null}
    </div>
  );
};
