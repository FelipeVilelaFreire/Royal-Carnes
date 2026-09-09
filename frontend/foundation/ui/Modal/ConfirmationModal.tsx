"use client";

import React from "react";
import { Button } from "../Button";
import { Inline, Stack } from "../Layout";
import { Modal } from "./Modal";
import type { UiModalSize, UiModalVariant } from "./types";

export interface ConfirmationModalProps {
  cancelLabel: string;
  closeLabel: string;
  confirmLabel: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  variant?: UiModalVariant;
  size?: UiModalSize;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  cancelLabel,
  closeLabel,
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  open,
  size = "sm",
  title,
  variant = "auto",
}) => (
  <Modal
    closeLabel={closeLabel}
    description={description}
    onClose={onCancel}
    open={open}
    size={size}
    title={title}
    variant={variant}
  >
    <Stack gap="lg">
      <Inline gap="sm" justify="end" wrap>
        <Button appearance="outline" onClick={onCancel} size="md" tone="neutral" type="button">
          {cancelLabel}
        </Button>
        <Button appearance="solid" onClick={onConfirm} size="md" tone="danger" type="button">
          {confirmLabel}
        </Button>
      </Inline>
    </Stack>
  </Modal>
);
