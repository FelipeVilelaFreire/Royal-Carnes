import React from "react";

export interface AvatarCellProps {
  name?: string;
  image?: string;
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  showName?: boolean;
  style?: React.CSSProperties;
}

function getInitials(name?: string): string {
  if (!name) return "RP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AvatarCell: React.FC<AvatarCellProps> = ({
  name = "",
  image,
  size = "md",
  subtitle,
  showName = true,
  style
}) => {
  const initials = getInitials(name);

  const dimension = size === "sm" ? 32 : size === "lg" ? 56 : 40;
  const fontSize = size === "sm" ? "12px" : size === "lg" ? "20px" : "14px";
  const borderRadius = size === "sm" ? "10px" : size === "lg" ? "16px" : "12px";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", ...style }}>
      {image ? (
        <img
          src={image}
          alt={name}
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
            borderRadius,
            objectFit: "cover",
            border: "1px solid var(--theme--color-border, rgba(201, 162, 39, 0.25))",
            flexShrink: 0
          }}
        />
      ) : (
        <div
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
            borderRadius,
            background: "rgba(255, 198, 101, 0.12)",
            border: "1px solid var(--theme--color-border, rgba(201, 162, 39, 0.3))",
            color: "var(--theme--color-primary, #FFC665)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontWeight: "800",
            fontSize,
            letterSpacing: "0.5px",
            flexShrink: 0
          }}
        >
          {initials}
        </div>
      )}

      {showName && name && (
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <span
            style={{
              color: "var(--theme--color-text, #E8E1DE)",
              fontWeight: "700",
              fontSize: size === "lg" ? "18px" : "14px",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {name}
          </span>
          {subtitle && (
            <span
              style={{
                color: "var(--theme--color-text-muted, #D4C4B0)",
                fontWeight: "500",
                fontSize: "12px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden"
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
