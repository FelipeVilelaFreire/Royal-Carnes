"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "linen" | "glass";
  bordered?: boolean;
  hoverable?: boolean;
  isDark?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "surface",
  bordered = true,
  hoverable = true,
  isDark = false,
  children,
  style,
  ...props
}) => {
  const variantBg = isDark
    ? {
        surface: "#181513",
        linen: "#221E1B",
        glass: "rgba(24, 21, 19, 0.85)"
      }[variant]
    : {
        surface: "#FCFBF7",
        linen: "#F2F1ED",
        glass: "rgba(252, 251, 247, 0.85)"
      }[variant];

  const borderStyle = isDark ? "rgba(209, 209, 209, 0.15)" : "#D1D1D1";

  return (
    <div
      style={{
        background: variantBg,
        color: isDark ? "#F5F3EF" : "#1A1A1A",
        border: bordered ? `1px solid ${borderStyle}` : "none",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: hoverable ? "transform 0.3s ease, box-shadow 0.3s ease" : "none",
        boxSizing: "border-box",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
