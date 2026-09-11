"use client";

import React, { forwardRef, useEffect, useRef, useState, type DragEvent, type HTMLAttributes, type KeyboardEvent } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { CloseIcon } from "../Icon/AppIcons";
import { Inline, Stack } from "../Layout";
import { ConfirmationModal } from "../Modal";
import { Input } from "../Input";
import { Text } from "../Text";
import styles from "./AssetPicker.module.css";

export type AssetPickerValue = File | string | null | undefined;

export interface AssetPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  chooseFileLabel: string;
  confirmRemoveDescription?: string;
  confirmRemoveLabel?: string;
  confirmRemoveTitle?: string;
  cancelRemoveLabel?: string;
  disabled?: boolean;
  dropzoneLabel: string;
  onChange?: (value: File | string | null) => void;
  previewAlt: string;
  removeModalCloseLabel?: string;
  removeLabel: string;
  urlPlaceholder: string;
  value?: AssetPickerValue;
}

function isFileValue(value: AssetPickerValue): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export const AssetPicker = forwardRef<HTMLDivElement, AssetPickerProps>(function AssetPicker(
  {
    accept = "image/*",
    chooseFileLabel,
    cancelRemoveLabel,
    className,
    confirmRemoveDescription,
    confirmRemoveLabel,
    confirmRemoveTitle,
    disabled = false,
    dropzoneLabel,
    onChange,
    previewAlt,
    removeModalCloseLabel,
    removeLabel,
    urlPlaceholder,
    value,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState("");
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);
  const previewUrl = isFileValue(value) ? objectUrl : typeof value === "string" ? value : "";

  useEffect(() => {
    if (!isFileValue(value)) {
      setObjectUrl("");
      return undefined;
    }

    const nextObjectUrl = URL.createObjectURL(value);
    setObjectUrl(nextObjectUrl);
    return () => URL.revokeObjectURL(nextObjectUrl);
  }, [value]);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    onChange?.(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    handleFiles(event.dataTransfer.files);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    inputRef.current?.click();
  };

  const requestRemove = () => {
    if (!confirmRemoveTitle || !confirmRemoveLabel || !cancelRemoveLabel || !removeModalCloseLabel) {
      onChange?.(null);
      return;
    }
    setIsConfirmingRemoval(true);
  };

  return (
    <div {...props} className={[styles.assetPicker, className].filter(Boolean).join(" ")} ref={ref}>
      <Stack gap="sm">
        <Card
          aria-disabled={disabled || undefined}
          className={styles.dropZone}
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? undefined : 0}
        >
          {previewUrl ? (
            <img alt={previewAlt} className={styles.previewImage} src={previewUrl} />
          ) : (
            <Text as="span" tone="muted" variant="body">
              {dropzoneLabel}
            </Text>
          )}
        </Card>

        <input
          accept={accept}
          className={styles.fileInput}
          disabled={disabled}
          onChange={(event) => handleFiles(event.target.files)}
          ref={inputRef}
          type="file"
        />

        <Input
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={urlPlaceholder}
          type="url"
          value={typeof value === "string" ? value : ""}
        />

        <Inline gap="sm" wrap>
          <Button
            appearance="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            size="sm"
            tone="neutral"
            type="button"
          >
            {chooseFileLabel}
          </Button>
          {previewUrl ? (
            <Button
              appearance="transparent"
              disabled={disabled}
              icon={<CloseIcon aria-hidden="true" />}
              onClick={requestRemove}
              size="sm"
              tone="neutral"
              type="button"
            >
              {removeLabel}
            </Button>
          ) : null}
        </Inline>
      </Stack>
      <ConfirmationModal
        cancelLabel={cancelRemoveLabel || ""}
        closeLabel={removeModalCloseLabel || ""}
        confirmLabel={confirmRemoveLabel || ""}
        description={confirmRemoveDescription}
        onCancel={() => setIsConfirmingRemoval(false)}
        onConfirm={() => {
          setIsConfirmingRemoval(false);
          onChange?.(null);
        }}
        open={isConfirmingRemoval}
        title={confirmRemoveTitle || ""}
      />
    </div>
  );
});
