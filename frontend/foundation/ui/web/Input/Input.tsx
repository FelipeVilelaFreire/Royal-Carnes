"use client";

import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Skeleton, type SkeletonSize, type SkeletonWidth } from "../Skeleton";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
  label?: string;
  skeletonSize?: Extract<SkeletonSize, "md" | "lg" | "xl">;
  skeletonWidth?: SkeletonWidth;
  state?: "active" | "default" | "skeleton";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, icon, id, label, skeletonSize = "lg", skeletonWidth = "full", state = "default", style, ...props },
  ref,
) {
  const inputId = id || props.name;

  if (state === "skeleton") {
    return (
      <div aria-busy="true" className={[styles.root, className].filter(Boolean).join(" ")} data-state="skeleton" style={style}>
        {label ? <Skeleton shape="text" size="xs" width="sm" /> : null}
        <Skeleton className={styles.skeletonControl} shape="block" size={skeletonSize} width={skeletonWidth} />
      </div>
    );
  }

  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")} data-state={state} htmlFor={inputId} style={style}>
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
