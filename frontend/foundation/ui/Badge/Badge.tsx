import React from "react";

export interface UiBadgeProps {
  status?: "active" | "paused" | "canceled" | "warning" | "neutral" | "primary";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const UiBadge: React.FC<UiBadgeProps> = ({ status = "active", children, style }) => {
  const getBadgeStyle = (): React.CSSProperties => {
    if (status === "primary") {
      return {
        background: "rgba(0, 229, 255, 0.12)",
        color: "var(--theme--color-primary, #00E5FF)",
        border: "1px solid var(--theme--color-border, rgba(0, 229, 255, 0.3))"
      };
    }
    if (status === "active") {
      return {
        background: "rgba(34, 197, 94, 0.12)",
        color: "#22C55E",
        border: "1px solid rgba(34, 197, 94, 0.3)"
      };
    }
    if (status === "canceled") {
      return {
        background: "rgba(239, 68, 68, 0.12)",
        color: "#EF4444",
        border: "1px solid rgba(239, 68, 68, 0.3)"
      };
    }
    if (status === "warning" || status === "paused") {
      return {
        background: "rgba(245, 158, 11, 0.12)",
        color: "#F59E0B",
        border: "1px solid rgba(245, 158, 11, 0.3)"
      };
    }
    return {
      background: "rgba(255, 255, 255, 0.08)",
      color: "var(--theme--color-text-muted, #8DA7C4)",
      border: "1px solid var(--theme--color-border, rgba(255, 255, 255, 0.15))"
    };
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        boxSizing: "border-box",
        ...getBadgeStyle(),
        ...style
      }}
    >
      {children}
    </span>
  );
};
