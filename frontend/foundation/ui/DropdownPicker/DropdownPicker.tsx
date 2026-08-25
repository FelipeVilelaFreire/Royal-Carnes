"use client";

import React, { useState } from "react";
import { themeColorsDefault } from "../../tokens/theme.tokens";

export interface DropdownPickerProps {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  options = [],
  value,
  onChange,
  placeholder = "Selecione..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: themeColorsDefault.dark.surface,
          color: themeColorsDefault.dark.text,
          border: `1px solid ${themeColorsDefault.dark.border}`,
          borderRadius: "8px",
          padding: "10px 14px",
          textAlign: "left",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: themeColorsDefault.dark.surface,
            border: `1px solid ${themeColorsDefault.dark.border}`,
            borderRadius: "8px",
            zIndex: 200,
            overflow: "hidden"
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                if (onChange) onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: "10px 14px",
                fontSize: "14px",
                color: themeColorsDefault.dark.text,
                cursor: "pointer",
                background: opt.value === value ? "rgba(212, 175, 55, 0.15)" : "transparent"
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
