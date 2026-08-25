"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isDark?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isDark = false,
  children,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    width: fullWidth ? "100%" : "auto",
    boxSizing: "border-box"
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "8px 16px", fontSize: "11px" },
    md: { padding: "12px 24px", fontSize: "12px" },
    lg: { padding: "16px 32px", fontSize: "13px" }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: isDark ? "#FCFBF7" : "#1A1A1A",
      color: isDark ? "#0B0908" : "#FCFBF7"
    },
    accent: {
      background: "#B87333",
      color: "#FFFFFF"
    },
    outline: {
      background: "transparent",
      color: isDark ? "#FCFBF7" : "#1A1A1A",
      border: `1px solid ${isDark ? "#FCFBF7" : "#1A1A1A"}`
    },
    ghost: {
      background: "transparent",
      color: isDark ? "#FCFBF7" : "#1A1A1A"
    }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};
