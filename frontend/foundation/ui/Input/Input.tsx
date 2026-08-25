import React from "react";

export interface UiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const UiInput: React.FC<UiInputProps> = ({ label, error, icon, style = {}, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label && <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--theme--color-text-muted, #8DA7C4)" }}>{label}</label>}
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: "16px", display: "inline-flex", alignItems: "center", color: "var(--theme--color-text-muted)" }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: "100%",
            background: "var(--theme--color-surface, rgba(255, 255, 255, 0.04))",
            border: error ? "1px solid #EF4444" : "1px solid var(--theme--color-border, rgba(255, 255, 255, 0.15))",
            borderRadius: "14px",
            padding: icon ? "12px 16px 12px 46px" : "12px 16px",
            color: "var(--theme--color-text, inherit)",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            ...style
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: "500" }}>{error}</span>}
    </div>
  );
};
