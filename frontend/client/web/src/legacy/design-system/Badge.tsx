"use client";

import React from "react";

export interface BadgeProps {
  variant?: "offer" | "limited" | "copper";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "offer",
  children,
  style
}) => {
  const bg = {
    offer: "#B87333",
    limited: "#1A1A1A",
    copper: "#B87333"
  }[variant];

  return (
    <span
      style={{
        background: bg,
        color: "#FCFBF7",
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px",
        fontWeight: "600",
        padding: "4px 8px",
        borderRadius: "2px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        display: "inline-block",
        ...style
      }}
    >
      {children}
    </span>
  );
};
