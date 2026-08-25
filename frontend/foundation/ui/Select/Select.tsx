"use client";

import React, { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ label: string; value: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options = [], children, style, ...props },
  ref
) {
  return (
    <select
      {...props}
      ref={ref}
      style={{
        background: "var(--theme--color-surface, rgba(255, 255, 255, 0.05))",
        color: "var(--theme--color-text, inherit)",
        border: "1px solid var(--theme--color-border, rgba(255, 255, 255, 0.2))",
        borderRadius: "14px",
        padding: "12px 16px",
        fontSize: "14px",
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
        ...style
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ background: "#0B0908", color: "#F0F8FF" }}>
          {opt.label}
        </option>
      ))}
      {children}
    </select>
  );
});
