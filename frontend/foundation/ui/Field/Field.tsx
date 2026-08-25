"use client";

import React from "react";
import { Text } from "../Text";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
  htmlFor?: string;
  level?: any;
  required?: boolean;
  width?: any;
}

export const Field: React.FC<FieldProps> = ({
  label,
  description,
  error,
  children,
  htmlFor,
  level,
  required,
  width,
  style,
  ...props
}) => {
  return (
    <div {...props} style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && <Text variant="caption" style={{ fontWeight: "600" }}>{label}</Text>}
      {children}
      {description && <Text variant="caption" style={{ opacity: 0.7 }}>{description}</Text>}
      {error && <Text variant="caption" style={{ color: "#EF4444" }}>{error}</Text>}
    </div>
  );
};
