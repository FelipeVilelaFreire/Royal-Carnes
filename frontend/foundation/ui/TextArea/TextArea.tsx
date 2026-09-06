"use client";

import React, { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, error, id, label, style, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")} htmlFor={inputId} style={style}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.control} data-invalid={Boolean(error) || undefined}>
        <textarea {...props} className={styles.textarea} id={inputId} ref={ref} />
      </span>
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
});

export const UiTextArea = TextArea;
