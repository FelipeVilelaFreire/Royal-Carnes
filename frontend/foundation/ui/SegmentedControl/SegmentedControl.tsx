"use client";

import React from "react";
import { themeColorsDefault } from "../../tokens/theme.tokens";

export interface SegmentedControlProps {
  items: Array<{ key: string; label: string }>;
  value?: string;
  onChange?: (key: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items = [],
  value,
  onChange
}) => {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "8px", gap: "4px" }}>
      {items.map((item) => {
        const isActive = value === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange && onChange(item.key)}
            style={{
              background: isActive ? themeColorsDefault.dark.primary : "transparent",
              color: isActive ? themeColorsDefault.dark.background : themeColorsDefault.dark.text,
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: isActive ? "600" : "400",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
