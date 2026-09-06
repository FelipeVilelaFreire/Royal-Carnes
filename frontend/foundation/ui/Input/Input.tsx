"use client";

import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, icon, id, label, style, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")} htmlFor={inputId} style={style}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.control} data-invalid={Boolean(error) || undefined} data-with-icon={Boolean(icon) || undefined}>
        {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
        <input {...props} className={styles.input} id={inputId} ref={ref} />
      </span>
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
});

export const UiInput = Input;
