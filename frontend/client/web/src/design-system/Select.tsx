"use client";

import React, { useState, useRef, useEffect } from "react";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  isDark?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  isDark = false,
  placeholder = "Selecionar...",
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block", minWidth: "180px", ...style }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: tokens.surface,
          color: tokens.text,
          border: `1px solid ${isOpen ? tokens.copper : tokens.border}`,
          borderRadius: "4px",
          padding: "10px 16px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? `0 0 0 2px rgba(184, 115, 51, 0.2)` : "none"
        }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.text}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease"
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: isDark ? "rgba(24, 21, 19, 0.98)" : "rgba(252, 251, 247, 0.98)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${tokens.border}`,
            borderRadius: "6px",
            boxShadow: isDark
              ? "0 12px 32px rgba(0, 0, 0, 0.6)"
              : "0 12px 32px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "4px 0"
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 16px",
                  background: isSelected
                    ? isDark ? "rgba(184, 115, 51, 0.2)" : "rgba(184, 115, 51, 0.1)"
                    : "transparent",
                  color: isSelected ? tokens.copper : tokens.text,
                  border: "none",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: isSelected ? "700" : "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.copper} strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
