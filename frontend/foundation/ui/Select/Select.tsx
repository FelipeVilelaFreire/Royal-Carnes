"use client";

import React, { forwardRef, type SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ label: string; value: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options = [], children, ...props },
  ref,
) {
  return (
    <select {...props} className={[styles.select, className].filter(Boolean).join(" ")} ref={ref}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
      {children}
    </select>
  );
});
