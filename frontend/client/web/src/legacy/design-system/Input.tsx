"use client";

import React from "react";
import { SearchIcon } from "./Icons";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: "search" | "none";
  rounded?: boolean;
  isDark?: boolean;
}

export const Input: React.FC<InputProps> = ({
  icon = "none",
  rounded = true,
  isDark = false,
  style,
  ...props
}) => {
  const hasIcon = icon === "search";
  const bg = isDark ? "#221E1B" : "#F2F1ED";
  const border = isDark ? "rgba(209, 209, 209, 0.2)" : "#D1D1D1";
  const text = isDark ? "#F5F3EF" : "#1A1A1A";
  const iconColor = isDark ? "#A09A92" : "#4A4A4A";

  return (
    <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
      {hasIcon && (
        <span style={{ position: "absolute", left: "14px", color: iconColor, display: "flex", pointerEvents: "none" }}>
          <SearchIcon size={18} />
        </span>
      )}
      <input
        style={{
          width: "100%",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: rounded ? "9999px" : "4px",
          padding: hasIcon ? "10px 16px 10px 42px" : "10px 16px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: text,
          outline: "none",
          transition: "border-color 0.2s ease",
          boxSizing: "border-box",
          ...style
        }}
        {...props}
      />
    </div>
  );
};
