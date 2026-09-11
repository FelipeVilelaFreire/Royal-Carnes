import React from "react";
import styles from "./AvatarCell.module.css";

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

  return (
    <div className={styles.root} data-size={size} style={style}>
      {image ? (
        <img
          alt={name}
          className={styles.media}
          src={image}
        />
      ) : (
        <div className={styles.initials}>
          {initials}
        </div>
      )}

      {showName && name && (
        <div className={styles.content}>
          <span className={styles.name}>
            {name}
          </span>
          {subtitle && (
            <span className={styles.subtitle}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
