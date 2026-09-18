"use client";

import React from "react";
import { Button } from "../Button";
import { CloseIcon } from "../Icon/AppIcons";
import { Stack } from "../Layout";
import { Text } from "../Text";
import { Modal } from "./Modal";
import type { UiModalSize, UiModalVariant } from "./types";
import styles from "./ConfirmationModal.module.css";

export interface ConfirmationModalProps {
  cancelLabel: string;
  closeLabel: string;
  confirmLabel: string;
  description?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  tone?: "danger" | "primary";
  variant?: UiModalVariant;
  size?: UiModalSize;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  cancelLabel,
  closeLabel,
  confirmLabel,
  description,
  icon,
  isLoading = false,
  onCancel,
  onConfirm,
  open,
  size = "sm",
  title,
  tone = "primary",
  variant = "auto",
}) => (
  <Modal
    ariaLabel={title}
    closeLabel={closeLabel}
    hideHeader
    onClose={() => {
      if (!isLoading) onCancel();
    }}
    open={open}
    size={size}
    variant={variant}
  >
    <section className={styles.confirmation} data-tone={tone}>
      <Button
        aria-label={closeLabel}
        appearance="transparent"
        className={styles.closeButton}
        disabled={isLoading}
        icon={<CloseIcon size={18} />}
        iconPosition="only"
        onClick={onCancel}
        size="sm"
        tone="neutral"
        type="button"
      />
      {icon ? <div aria-hidden="true" className={styles.iconFrame}>{icon}</div> : null}
      <Stack align="center" gap="xs">
        <Text as="h2" className={styles.title} tone="inherit" variant="h2">{title}</Text>
        {description ? <Text className={styles.description} tone="inherit">{description}</Text> : null}
      </Stack>
      <div className={styles.actions}>
        <Button appearance="solid" className={styles.confirmButton} loading={isLoading} onClick={onConfirm} size="md" tone={tone} type="button">
          {confirmLabel}
        </Button>
        <Button appearance="transparent" className={styles.cancelButton} disabled={isLoading} onClick={onCancel} size="md" tone="neutral" type="button">
          {cancelLabel}
        </Button>
      </div>
    </section>
  </Modal>
);
