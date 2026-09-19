"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronRightIcon, SearchIcon } from "../Icon/AppIcons";
import { AvatarCell } from "../Avatar";
import { Button } from "../Button";
import { Input } from "../Input";
import { Stack } from "../Layout";
import { Surface } from "../Surface";
import styles from "./DropdownPicker.module.css";

export interface DropdownPickerOption {
  description?: string;
  disabled?: boolean;
  imageAlt?: string;
  imageSrc?: string;
  label: string;
  value: string;
}

export interface DropdownPickerProps {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  onChange?: (value: string) => void;
  optionPresentation?: "media" | "text";
  options: DropdownPickerOption[];
  emptySearchLabel?: string;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  value?: string;
  width?: "auto" | "full";
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  ariaLabel,
  className,
  disabled = false,
  label,
  onChange,
  optionPresentation = "text",
  options = [],
  emptySearchLabel,
  placeholder,
  searchable = false,
  searchPlaceholder,
  value,
  width = "full",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [query, setQuery] = useState("");
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => [option.label, option.description]
      .filter(Boolean)
      .some((entry) => String(entry).toLocaleLowerCase().includes(normalizedQuery)));
  }, [options, query]);
  const selectedLabel = selected?.label || placeholder || options[0]?.label || "";

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
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

    if (searchable) searchInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const enabledIndexes = filteredOptions
          .map((option, index) => option.disabled ? -1 : index)
          .filter((index) => index >= 0);
        if (!enabledIndexes.length) return;
        const currentIndex = enabledIndexes.indexOf(activeOptionIndex);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = currentIndex < 0
          ? (direction > 0 ? 0 : enabledIndexes.length - 1)
          : (currentIndex + direction + enabledIndexes.length) % enabledIndexes.length;
        setActiveOptionIndex(enabledIndexes[nextIndex]);
      }
      if (event.key === "Enter") {
        const activeOption = filteredOptions[activeOptionIndex];
        if (!activeOption || activeOption.disabled) return;
        event.preventDefault();
        onChange?.(activeOption.value);
        close(true);
      }
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
  }, [activeOptionIndex, filteredOptions, isOpen, onChange, searchable, value]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = filteredOptions.findIndex((option) => option.value === value && !option.disabled);
    setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : filteredOptions.findIndex((option) => !option.disabled));
  }, [filteredOptions, isOpen, value]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-open={isOpen || undefined}
      data-presentation={optionPresentation}
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
        ref={triggerRef}
        size="sm"
        tone="neutral"
        type="button"
      >
        <span className={styles.value}>
          {selected?.imageSrc && optionPresentation !== "media" ? <img alt={selected.imageAlt || ""} className={styles.triggerImage} src={selected.imageSrc} /> : null}
          {selected && optionPresentation === "media" ? <AvatarCell image={selected.imageSrc} name={selected.imageAlt || selected.label} showName={false} size="sm" /> : null}
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
          <Stack className={styles.panelContent} gap="xs">
            {searchable ? (
              <div className={styles.searchField}>
                <Input
                  aria-label={searchPlaceholder}
                  icon={<SearchIcon aria-hidden="true" />}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  ref={searchInputRef}
                  type="search"
                  value={query}
                />
              </div>
            ) : null}
            <div className={styles.optionsList}>
              {filteredOptions.length ? filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeOptionIndex;
                return (
                  <Button
                    aria-selected={isSelected}
                    appearance={isSelected ? "soft" : "transparent"}
                    className={styles.option}
                    data-active={isActive || undefined}
                    data-presentation={optionPresentation}
                    disabled={option.disabled}
                    key={option.value}
                    onClick={() => {
                      if (option.disabled) return;
                      onChange?.(option.value);
                      close(true);
                    }}
                    role="option"
                    size="sm"
                    tone={isSelected ? "primary" : "neutral"}
                    type="button"
                  >
                    {optionPresentation === "media" ? <AvatarCell image={option.imageSrc} name={option.imageAlt || option.label} showName={false} size="sm" /> : option.imageSrc ? <img alt={option.imageAlt || ""} className={styles.optionImage} src={option.imageSrc} /> : null}
                    <span className={styles.optionCopy}>
                      <span>{option.label}</span>
                      {option.description ? <span className={styles.optionDescription}>{option.description}</span> : null}
                    </span>
                    {isSelected ? <span aria-hidden="true" className={styles.selectionIndicator}><CheckIcon /></span> : null}
                  </Button>
                );
              }) : searchable && emptySearchLabel ? <span className={styles.emptySearch}>{emptySearchLabel}</span> : null}
            </div>
          </Stack>
        </Surface>,
        document.body,
      ) : null}
    </div>
  );
};
