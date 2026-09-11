"use client";

import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import { CloseIcon } from "../Icon/AppIcons";
import { Surface } from "../Surface";
import { Text } from "../Text";
import styles from "./Modal.module.css";
import type { ModalProps, UiModalVariant } from "./types";

interface ModalFrameProps extends Omit<ModalProps, "variant"> {
  variant: UiModalVariant;
}

const variantToData = (variant: UiModalVariant) => (variant === "center" ? "center" : variant);

export const ModalFrame: React.FC<ModalFrameProps> = ({
  ariaLabel,
  children,
  closeLabel,
  description,
  onClose,
  open,
  size = "md",
  title,
  variant,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.backdrop}
      data-variant={variantToData(variant)}
      onMouseDown={onClose}
      role="presentation"
    >
      <Surface
        aria-describedby={description ? descriptionId : undefined}
        aria-label={ariaLabel || (title ? undefined : closeLabel)}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        as="section"
        className={styles.panel}
        data-size={size}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <div className={styles.heading}>
            {title ? (
              <Text id={titleId} as="h2" className={styles.title} tone="inherit" variant="h2">
                {title}
              </Text>
            ) : null}
            {description ? (
              <Text id={descriptionId} className={styles.description} tone="inherit" variant="body">
                {description}
              </Text>
            ) : null}
          </div>
          <Button
            aria-label={closeLabel}
            appearance="outline"
            className={styles.closeButton}
            icon={<CloseIcon size={18} />}
            iconPosition="only"
            onClick={onClose}
            size="sm"
            tone="neutral"
            type="button"
          />
        </div>
        <div className={styles.body}>{children}</div>
      </Surface>
    </div>,
    document.body,
  );
};
